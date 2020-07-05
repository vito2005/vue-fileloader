import Vue from 'vue'
import Vuex from 'vuex'
import FileLoader from './modules/fileLoader'
import Statistics from './modules/statistics'
import * as fetch from '../lib/fetch'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    fileLoader: FileLoader(fetch),
    statistics: Statistics()
  }
})
