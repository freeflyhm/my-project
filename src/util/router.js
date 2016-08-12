// createRouterMap
'use strict'
import { checkToken, initStorePre } from './auth'

export default function (router) {
  router.beforeEach(({to, next}) => {
    let obj = checkToken(to.name, router)

    if (obj.branch === 1) {
      initStorePre(obj.token)
    } else if (obj.branch === 2) {
      router.go('/login')
    }

    next()
  })

  router.map({
    '/home': {
      name: 'home',
      component: require('../components/Home')
    },
    '/smlist': {
      name: 'smlist',
      component: function (resolve) {
        require(['../components/Smlist'], resolve)
      }
    },
    '/setplacelist': {
      name: 'setplacelist',
      component: function (resolve) {
        require(['../components/Setplacelist'], resolve)
      }
    },
    '/servermanlist': {
      name: 'servermanlist',
      component: function (resolve) {
        require(['../components/Servermanlist'], resolve)
      }
    },
    '/feestemplist': {
      name: 'feestemplist',
      component: function (resolve) {
        require(['../components/Feestemplist'], resolve)
      }
    },
    '/dengjipailist': {
      name: 'dengjipailist',
      component: function (resolve) {
        require(['../components/Dengjipailist'], resolve)
      }
    },
    '/companylist': {
      name: 'companylist',
      component: function (resolve) {
        require(['../components/Companylist'], resolve)
      }
    },
    '/getusers': {
      name: 'getusers',
      component: function (resolve) {
        require(['../components/Getusers'], resolve)
      }
    },
    '/login': {
      name: 'login',
      component: function (resolve) {
        require(['../components/Login'], resolve)
      }
    }
  })

  router.redirect({
    '*': '/home'
  })
}
