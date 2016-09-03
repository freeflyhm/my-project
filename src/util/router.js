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

    // 排班表 checkSys10
    // 保险卡 checkSys10
    // 登机牌 checkSys10

    // 现场责任人 checkSys20
    '/servermanlist': {
      name: 'servermanlist',
      component: function (resolve) {
        require(['../components/Servermanlist'], resolve)
      }
    },

    // 排班表管理 checkSys20
    // 往来账管理 checkSys20
    '/bplist/:bpmonth/:bpcompany/:n': {
      name: 'bplist',
      component: function (resolve) {
        require(['../components/Bplist'], resolve)
      }
    },

    // 应收款 checkSys20
    '/billsnow': {
      name: 'billsnow',
      component: function (resolve) {
        require(['../components/Billsnow'], resolve)
      }
    },

    // 月账单列表 checkSys20
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

    // 月账单汇总报表 checkSys20
    '/billstotal/:bpmonth': {
      name: 'billstotal',
      component: function (resolve) {
        require(['../components/Billstotal'], resolve)
      }
    },
    // 集合地点管理 checkSys30
    '/setplacelist': {
      name: 'setplacelist',
      component: function (resolve) {
        require(['../components/Setplacelist'], resolve)
      }
    },
    // 服务费模板管理 checkSys30
    '/feestemplist': {
      name: 'feestemplist',
      component: function (resolve) {
        require(['../components/Feestemplist'], resolve)
      }
    },
    // 登机牌用户管理 checkSys30
    '/dengjipailist': {
      name: 'dengjipailist',
      component: function (resolve) {
        require(['../components/Dengjipailist'], resolve)
      }
    },
    // 公司列表 checkSys30 checkSys99
    '/companylist': {
      name: 'companylist',
      component: function (resolve) {
        require(['../components/Companylist'], resolve)
      }
    },
    // 用户列表 checkCus10 checkSys10 checkSys99
    '/userlist/:cid': {
      name: 'userlist',
      component: function (resolve) {
        require(['../components/Userlist'], resolve)
      }
    },
    // 在线用户 checkSys99
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
