export default () => ({
  namespaced: true,
  state: {
  },
  getters: {
    statistics: s => s.statistics
  },
  mutations: {
    changeStartDate (state, value) {
      state.photoreport.DateStart = value
    }
  },
  actions: {
  }
})
