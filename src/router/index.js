/* eslint-disable */

import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import ThreeTest from '@/components/ThreeTest'
import ShowModel from '@/components/ShowModel'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ShowModel',
      component: ShowModel
    }
  ]
})
