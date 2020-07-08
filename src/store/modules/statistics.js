import Vue from 'vue'

export default () => ({
  namespaced: true,
  state: {
    uploadRecords: {}
  },
  getters: {
    uploadRecords: s => s.uploadRecords,
    commonStats: s => {
      return Object.values(s.uploadRecords).reduce((acc, r) => {
        r.status === 'success' && acc.success++
        r.status === 'error' && acc.error++
        r.status === 'canceled' && acc.canceled++
        r.status && acc.common++
        return acc
      }, { common: 0, success: 0, error: 0, canceled: 0 })
    }
  },
  mutations: {
    ADD_RECORD (state, record) {
      Vue.set(state.uploadRecords, record.id, record)
    },
    REMOVE_RECORD (state, recordId) {
      Vue.delete(state.uploadRecords, recordId)
    }
  },
  actions: {
  }
})
