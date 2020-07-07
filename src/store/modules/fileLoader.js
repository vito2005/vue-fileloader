export default (upload) => ({
  namespaced: true,
  state: {
    file: null,
    uploadPercentage: 0,
    chunkSize: 1048576,
    chunksQueue: null,
    currentChunk: null
  },
  getters: {
    file: ({ file }) => file,
    uploadPercentage: ({ uploadPercentage }) => uploadPercentage,
    chunksQuantity: ({ file, chunkSize }) => Math.ceil(file.size / chunkSize)
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
    SET_CHUNKS_QUEUE (state, payload) {
      state.chunksQueue = payload
    },
    SET_UPLOAD_PERCENTAGE (state, loaded) {
      state.uploadPercentage = Math.round(Math.min(loaded, state.file.size) / state.file.size * 100)
    }
  },
  actions: {
    async sendFile ({ state, commit, getters, dispatch }) {
      const { chunksQuantity } = getters
      commit('SET_CHUNKS_QUEUE', [...Array(chunksQuantity).keys()].reverse())
      try {
        await dispatch('sendChunk', { url: '/api/upload' })
      } catch (error) {
        console.log(error.message)
        if (error.message === 'Failed to upload') {
          // dispatch('notification/callError', { group: 'app', errorText: 'Не удалось загрузить файл' }, { root: true })
        }
      }
      commit('SET_FILE', null)
    },
    async sendChunk ({ state, getters, dispatch, commit }, { url }) {
      const { file } = state
      const { chunksQuantity } = getters
      commit('SET_CURRENT_CHUNK')
      try {
        const result = await upload(url, { currentChunk: state.currentChunk, file, chunksQuantity })
        commit('SET_UPLOAD_PERCENTAGE', result)
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
