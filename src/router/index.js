import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Category from '@/components/Category'
import Topic from '@/components/Topic'
import Notification from '@/components/Notification'
import TagList from '@/components/TagList'
import Search from '@/components/Search'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Home',
    component: Home,
  }, {
    path: '/category/:id/:subId?',
    name: 'CategoryDetail',
    component: Category,
  }, {
    path: '/topic/:id',
    name: 'TopicDetail',
    component: Topic,
  }, {
    path: '/notifications',
    name: 'Notification',
    component: Notification,
  }, {
    path: '/tags',
    name: 'TagList',
    component: TagList,
  }, {
    path: '/search',
    name: 'Search',
    component: Search,
  }],
})
