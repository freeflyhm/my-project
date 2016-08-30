// createRouterMap
'use strict'
import { checkToken } from './auth'

export default function (router) {
  router.beforeEach(({to, next}) => {
    checkToken(to.name, router)
    document.body.scrollTop = 0
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
    // 修改密码 10
    // 排班表 10
    // 保险卡 10
    // 登机牌 10

    // 现场责任人 20
    '/servermanlist': {
      name: 'servermanlist',
      component: function (resolve) {
        require(['../components/Servermanlist'], resolve)
      }
    },

    // 排班表管理 20
    // 往来账管理 20
    '/bplist/:bpmonth/:bpcompany/:n': {
      name: 'bplist',
      component: function (resolve) {
        require(['../components/Bplist'], resolve)
      }
    },

    // 应收款 20
    '/billsnow': {
      name: 'billsnow',
      component: function (resolve) {
        require(['../components/Billsnow'], resolve)
      }
    },

    // 月账单列表 20
    '/billsitemisedlist/:bpmonth': {
      name: 'billsitemisedlist',
      component: function (resolve) {
        require(['../components/Billsitemisedlist'], resolve)
      }
    },
    // -- 月账单明细
    '/billsitemised/:bpmonth/:bpcompany': {
      name: 'billsitemised',
      component: function (resolve) {
        require(['../components/Billsitemised'], resolve)
      }
    },
    // -- 对账单
    '/statement/:id': {
      name: 'statement',
      component: function (resolve) {
        require(['../components/Statement'], resolve)
      }
    },

    // 月账单汇总报表 20
    '/billstotal/:bpmonth': {
      name: 'billstotal',
      component: function (resolve) {
        require(['../components/Billstotal'], resolve)
      }
    },
    // 集合地点管理 30
    '/setplacelist': {
      name: 'setplacelist',
      component: function (resolve) {
        require(['../components/Setplacelist'], resolve)
      }
    },
    // 服务费模板管理 30
    '/feestemplist': {
      name: 'feestemplist',
      component: function (resolve) {
        require(['../components/Feestemplist'], resolve)
      }
    },
    // 登机牌用户管理 30
    '/dengjipailist': {
      name: 'dengjipailist',
      component: function (resolve) {
        require(['../components/Dengjipailist'], resolve)
      }
    },
    // 公司列表 30
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
