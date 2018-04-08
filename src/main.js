// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueCookie from 'vue-cookie'
import VueAffix from 'vue-affix'
import VueScrollTo from 'vue-scrollto'
import VueInfiniteScroll from 'vue-infinite-scroll'
import VueCheckView from 'vue-check-view'
import ElementUI from 'element-ui'
import popover from 'element-ui/packages/popover/src/directive'

import axios from 'axios'
import moment from 'moment'
import fontawesome from '@fortawesome/fontawesome'
import faRegular from '@fortawesome/fontawesome-free-regular'
import faSolid from '@fortawesome/fontawesome-free-solid'

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/normalize.css'
import '@/styles/post.css'

import App from './App'
import router from './router'
import store from './store'

fontawesome.library.add(faRegular)
fontawesome.library.add(faSolid)
moment.locale('zh-CN')

const httpOpts = {
  baseURL: 'https://developer-forum.rokid.com',
  // baseURL: 'http://forum.rokid.com:8888/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  responseType: 'json',
  withCredentials: true,
}

Vue.config.productionTip = false

const http = Vue.http = Vue.prototype.$http = axios.create(httpOpts)
http.interceptors.response.use((response) => {
  const username = response.headers['x-discourse-username']
  if (username)
    store.dispatch('login', { username })

  return response
})

Vue.registerWithCsrfToken = function(token) {
  Vue.http = Vue.prototype.$http = axios.create({
    ...httpOpts,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': token,
    }
  })
}

Vue.use(VueCookie)
Vue.use(VueAffix)
Vue.use(VueScrollTo)
Vue.use(VueInfiniteScroll)
Vue.use(VueCheckView)
Vue.use(ElementUI)
Vue.directive('popover', popover)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
