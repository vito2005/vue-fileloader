export default ({ get, post }) => ({
  namespaced: true,
  state: {
    file: null
  },
  getters: {
    file: s => s.file
  },
  mutations: {
    SET_FILE (state, payload) {
      state.file = payload
    }
  },
  actions: {
    async sendFile ({ state, commit, dispatch }) {
      const formData = new FormData()
      formData.append('file', state.file)
      try {
        const result = await post('/api/file', {
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        if (!result.success) throw Error(result.statusText)
        commit('addLoadingRecord', result.data)
        commit('SET_FILE', null)
        return result
      } catch (error) {
        if (error.message === 'Failed to upload') {
          dispatch('notification/callError', { group: 'app', errorText: 'Не удалось загрузить файл' }, { root: true })
        }
        commit('SET_FILE', null)
      }
    }
  }
})
