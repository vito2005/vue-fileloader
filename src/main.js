import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dataSizeFilter from '@/lib/filters/dataSizeFilter'

Vue.config.productionTip = false

Vue.filter('dataSize', dataSizeFilter)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
