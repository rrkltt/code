import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import './assets/css/global.css'
import  ElementUi  from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://192.168.1.141:8888/api/private/v1/'
axios.interceptors.request.use(ICrequest => {
  // console.log(config)
  ICrequest.headers.Authorization = window.sessionStorage.getItem('token')
  return ICrequest
})
Vue.config.productionTip = false
Vue.use(ElementUi)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
