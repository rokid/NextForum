import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Category from '@/components/Category'
import Topic from '@/components/Topic'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/c/:id',
    name: 'CategoryDetail',
    component: Category
  }, {
    path: '/t/:id',
    name: 'TopicDetail',
    component: Topic
  }]
})
