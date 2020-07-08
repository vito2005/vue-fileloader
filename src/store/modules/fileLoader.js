export default (upload, resetCache) => ({
  namespaced: true,
  state: {
    file: null,
    uploadPercentage: 0,
    chunkSize: 1048576,
    chunksQueue: null,
    currentChunk: null,
    uploadedChunks: 0,
    uploading: null,
    lastSessionStatus: null
  },
  getters: {
    file: ({ file }) => file,
    uploading: ({ uploading }) => uploading,
    lastSessionStatus: ({ lastSessionStatus }) => lastSessionStatus,
    uploadPercentage: ({ uploadedChunks, file }, { chunksQuantity }) => file && Math.round(uploadedChunks / chunksQuantity * 100),
    chunksQuantity: ({ file, chunkSize }) => file && Math.ceil(file.size / chunkSize),
    session: ({ file, uploadedChunks }, { chunksQuantity }) => ({
      id: file.id,
      fileName: file.name,
      size: file.size,
      byteSize: file.size,
      uploadedChunks: uploadedChunks,
      chunks: chunksQuantity
    }) || {}
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
      state.uploadedChunks = Math.ceil(Math.min(loaded, state.file.size) / state.chunkSize)
    }
  },
  actions: {
    async sendFile ({ state, commit, getters, dispatch }) {
      const { chunksQuantity } = getters
      commit('TOGGLE_UPLOADING', true)
      commit('SET_LAST_SESSION_STATUS', null)
      commit('SET_CHUNKS_QUEUE', [...Array(chunksQuantity).keys()].reverse())
      try {
        await dispatch('sendChunk', { url: '/api/upload' })
        commit('SET_LAST_SESSION_STATUS', 'success')
      } catch (e) {
        if (e.message === 'error') {
          commit('SET_LAST_SESSION_STATUS', 'error')
        }
      }
      const record = {
        id: state.file.id,
        status: state.lastSessionStatus,
        fileName: state.file.name,
        size: state.file.size,
        byteSize: state.file.size,
        uploadedChunks: state.uploadedChunks,
        chunks: chunksQuantity
      }
      commit('statistics/ADD_RECORD', record, { root: true })
      setTimeout(() => {
        commit('TOGGLE_UPLOADING', false)
        commit('SET_UPLOADED_CHUNKS', 0)
        commit('SET_FILE', null)
        commit('SET_CHUNKS_QUEUE', null)
      }, 500)
      resetCache()
    },
    async sendChunk ({ state, getters, dispatch, commit }, { url }) {
      const { file } = state
      const { chunksQuantity } = getters
      commit('SET_CURRENT_CHUNK')
      try {
        if (state.lastSessionStatus === 'canceled') {
          throw new Error('canceled')
        }
        const result = await upload(url, { currentChunk: state.currentChunk, file, chunksQuantity })
        commit('SET_UPLOADED_CHUNKS', result)
        if (!state.chunksQueue.length) {
          return Promise.resolve()
        }
        await dispatch('sendChunk', { url })
      } catch (e) {
        if (e.message === 'error') {
          throw new Error('error')
        }
        if (e.message === 'canceled') {
          throw new Error('canceled')
        }
        commit('ADD_TO_CHUNKSQUEUE', state.currentChunk.id)
      }
    }
  }
})
