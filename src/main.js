/**
 * router.app.$route
 */

'use strict'

import Vue from 'vue' // 引入 vue

// 引入 vue-resource
// $resource
// $http
import VueResource from 'vue-resource'

// 引入 vue-validator
import VueValidator from 'vue-validator'

// 引入 vue-router
// $router
// $route
import VueRouter from 'vue-router'

import App from './App' // 引入根组件

import createPartial from './util/partial'              // 引入创建模板片段函数
import createCustomFilter from './util/filter'          // 引入创建自定义过滤器函数
import createCustomValidatorMap from './util/validator' // 引入创建自定义验证器函数
import createRouterMap from './util/router'             // 引入创建路由表函数

Vue.use(VueResource)  // 声明使用 vue-resource
Vue.use(VueValidator) // 声明使用 vue-validator
Vue.use(VueRouter)    // 声明使用 vue-router

createPartial()                // 创建模版片段
createCustomFilter()           // 创建自定义过滤器
createCustomValidatorMap()     // 创建自定义验证器

const router = new VueRouter() // 创建路由实例
createRouterMap(router)        // 创建路由表

router.start(App, '#app')      // 开启应用
