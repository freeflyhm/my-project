// import moment from 'moment'

import store from '../vuex/store'
import { setSomebody,
  pushSid,
  clearSids,
  setAuthenticated,
  setToken,
  setSio,
  setSmlistDate,
  setCompany,
  setUser,
  setCity } from '../vuex/actions'
import { makeSio } from './data'

let router012 = null
// let goHome = false

// 不需要权限验证进入的页面
const UN_CHECK_ROUTER_NAME = {
  login: 1
}

// URL and endpoint constants
const API_URL = 'http://120.76.232.12:8080/'
const LOGIN_URL = API_URL + 'api/login/'
const SIGNUP_URL = API_URL + 'api/register'

const options = {
  emulateJSON: true
}

const clearStore = () => {
  setAuthenticated(store, false)
  setToken(store, '')
  setSio(store, {})

  setSmlistDate(store, '')

  setCompany(store, {})
  setUser(store, {})
  setCity(store, '')
}

export const initStorePre = (token) => {
  setToken(store, token)
  setSio(store, makeSio(token))

  // setSmlistDate(store, moment().format('YYYY-MM-DD'))
}

export const initStore = (results) => {
  setAuthenticated(store, true)
  setCompany(store, results.company)
  setUser(store, results.user)
  setCity(store, results.city)

  // if (goHome) {
  //   goHome = false
  //   router012.go('/home')
  // }
}

export const checkToken = (name, router) => {
  let branch = 0 // 进入无需授权的页面或者已得到授权, 直接 next()
  let token = ''

  if (!router012) {
    router012 = router
  }

  if (!(UN_CHECK_ROUTER_NAME[name] || store.state.authenticated)) {
    // 进入需要授权的页面但没有获得授权时
    token = window.localStorage.getItem('token')
    if (token) {
      branch = 1 // initStorePre
    } else {
      branch = 2 // router.go('/login')
    }
  }

  return { branch: branch, token: token }
}

// export const checkAuth = (name, router) => {
//   let token
//
//   if (!(UN_CHECK_ROUTER_NAME[name] || store.state.authenticated)) {
//     token = window.localStorage.getItem('token')
//     if (token) {
//       initStorePre(token)
//     } else {
//       router.go('/login')
//     }
//   }
// }

export const signup = (context, obj, callback) => {
  context.$http.post(SIGNUP_URL, obj, options).then((response) => {
    let results = JSON.parse(response.body)
    callback(results)
  }, (err) => {
    callback(err)
  })
}

export const login = (context, creds, callback) => {
  context.$http.post(LOGIN_URL, creds, options).then((response) => {
    let results = JSON.parse(response.body)
    let token

    if (results.success === 1) {
      token = results.token
      window.localStorage.setItem('token', token)
      initStorePre(token)

      // goHome = true
    }
    callback(results)
  }, (err) => {
    callback(err)
  })
}

export const logout = () => {
  window.localStorage.removeItem('token')
  setSomebody(store, false)
  store.state.sio.disconnect()
  clearStore()
  router012.go('/login')
}

export const somebodyIsOnlined = () => {
  setSomebody(store, true)
}

export const somebodyWantOnline = (sid) => {
  pushSid(store, sid)
}

export const setStoreSomebodyFalse = (isLogout) => {
  if (isLogout) {
    return logout()
  }
  setSomebody(store, false)
}

export const clearStoreSids = (isLogout) => {
  if (isLogout) {
    logout()
  } else {
    emitToServer('cancelSomebodyOnline', store.state.sids, null)
  }
  clearSids(store)
}

// export const emitSmlist = () => {
//   let date = router.app.$route.query.date || ''
//   if (store.state.smlistDate !== date) {
//     setSmlistDate(store, date)
//   }
//
//   store.state.sio.emit('emit-echo', 'smlist data ' + date, (results) => {
//     console.log(results)
//   })
// }

// export const updateDate = (val) => {
//   router.go({
//     name: 'smlist',
//     query: {
//       date: val
//     }
//   })
// }

// 集合地点
// 登机牌用户
// 现场责任人
export const emitToServer = (methodName, obj, callback) => {
  store.state.sio.emit('emit-' + methodName, obj, (results) => {
    callback(results)
  })
}

export const cloneObj = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}
