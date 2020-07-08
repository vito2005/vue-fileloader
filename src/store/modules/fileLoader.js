export default (upload) => ({
  namespaced: true,
  state: {
    file: null,
    uploadPercentage: 0,
    chunkSize: 1048576,
    chunksQueue: null,
    currentChunk: null,
    uploadedChunks: null,
    uploading: null,
    lastSessionStatus: null
  },
  getters: {
    file: ({ file }) => file,
    uploading: ({ uploading }) => uploading,
    lastSessionStatus: ({ lastSessionStatus }) => lastSessionStatus,
    uploadPercentage: ({ uploadedChunks, file }) => file && Math.round(Math.min(uploadedChunks, file.size) / file.size * 100),
    chunksQuantity: ({ file, chunkSize }) => file && Math.ceil(file.size / chunkSize),
    session: ({ file, uploadedChunks }, { chunksQuantity }) => file && ({
      id: file.id,
      fileName: file.name,
      size: file.size,
      byteSize: file.size,
      uploadedChunks: uploadedChunks,
      chunks: chunksQuantity
    })
  },
  mutations: {
    ADD_TO_CHUNKSQUEUE (state, chunkId) {
      state.chunksQueue.push(chunkId)
    },
    SET_CURRENT_CHUNK (state) {
      const id = state.chunksQueue.pop()
      const start = id * state.chunkSize
      const value = state.file.slice(start, start + state.chunkSize)
      state.currentChunk = { id, value }
    },
    SET_FILE (state, payload) {
      state.file = payload
    },
    TOGGLE_UPLOADING (state, payload) {
      state.uploading = payload
    },
    SET_LAST_SESSION_STATUS (state, payload) {
      state.lastSessionStatus = payload
    },
    SET_CHUNKS_QUEUE (state, payload) {
      state.chunksQueue = payload
    },
    SET_UPLOADED_CHUNKS (state, loaded) {
      state.uploadedChunks = Math.min(loaded, state.file.size)
    }
  },
  actions: {
    async sendFile ({ state, commit, getters, dispatch }) {
      const { chunksQuantity } = getters
      commit('TOGGLE_UPLOADING', true)
      commit('SET_CHUNKS_QUEUE', [...Array(chunksQuantity).keys()].reverse())
      try {
        await dispatch('sendChunk', { url: '/api/upload' })
      } catch (error) {
        console.log(error.message)
        if (error.message === 'Failed to upload') {
          // dispatch('notification/callError', { group: 'app', errorText: 'Не удалось загрузить файл' }, { root: true })
        }
      }
      const record = {
        id: state.file.id,
        status: 'success',
        fileName: state.file.name,
        size: state.file.size,
        byteSize: state.file.size,
        uploadedChunks: chunksQuantity,
        chunks: chunksQuantity
      }
      commit('statistics/ADD_RECORD', record, { root: true })
      commit('SET_FILE', null)
      commit('SET_LAST_SESSION_STATUS', record.status)
      setTimeout(() => commit('TOGGLE_UPLOADING', false), 500)
    },
    async sendChunk ({ state, getters, dispatch, commit }, { url }) {
      const { file } = state
      const { chunksQuantity } = getters
      commit('SET_CURRENT_CHUNK')
      try {
        const result = await upload(url, { currentChunk: state.currentChunk, file, chunksQuantity })
        commit('SET_UPLOADED_CHUNKS', result)
        if (!state.chunksQueue.length) {
          return Promise.resolve()
        }
        await dispatch('sendChunk', { url })
      } catch (e) {
        commit('ADD_TO_CHUNKSQUEUE', state.currentChunk.id)
      }
    }
  }
})
