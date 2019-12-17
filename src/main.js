import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import './assets/css/main.css'

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
