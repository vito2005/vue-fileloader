import Vue from 'vue'
import Vuex from 'vuex'
import FileLoader from './modules/fileLoader'
import Statistics from './modules/statistics'
import { upload, resetCache } from '../lib/upload'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    fileLoader: FileLoader(upload, resetCache),
    statistics: Statistics()
  }
})
