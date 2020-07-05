import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

window._fetch = window.fetch
window.fetch = async (...args) => {
  const res = await window._fetch(...args)
  return res
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
