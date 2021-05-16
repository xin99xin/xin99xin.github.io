/* eslint-disable */

import Vue from 'vue'
import Router from 'vue-router'
import ThreeJsModel from '@/components/ThreeJsModel'
import ThreeJsObj from '@/components/ThreeJsObj'
import ShowModel from '@/components/ShowModel'
import ShowTerrain from '@/components/ShowTerrain'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ShowTerrain',
      component: ShowTerrain
    },
    {
      path: '/showM',
      name: 'ShowModel',
      component: ShowModel
    },
    {
      path: '/model',
      name: 'ThreeJsModel',
      component: ThreeJsModel
    },
    {
      path: '/obj',
      name: 'ThreeJsObj',
      component: ThreeJsObj
    }
  ]
})
