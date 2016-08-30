import store from '../vuex/store'
import { setProvincecityobj,
  setSomebody,
  pushSid,
  clearSids,
  setAuthenticated,
  setToken,
  setDbName,
  setSio,
  // setSmlistDate,
  setCompany,
  setUser,
  setCity } from '../vuex/actions'
import { makeSio } from './data'

// 不需要权限验证进入的页面
const UN_CHECK_ROUTER_NAME = {
  login: 1
}

// URL and endpoint constants
const API_URL = 'http://120.76.232.12:8080/'
const LOGIN_URL = API_URL + 'api/login/'
const SIGNUP_URL = API_URL + 'api/register'
const PROVINCECITY_URL = API_URL + 'api/provincecity'

const OPTIONS = {
  emulateJSON: true
}

const getCity = (provincecityobj, dbName) => {
  let city = ''
  let key1
  let cityObj
  let key2

  for (key1 in provincecityobj) {
    if (provincecityobj.hasOwnProperty(key1)) {
      cityObj = provincecityobj[key1]
      for (key2 in cityObj) {
        if (cityObj.hasOwnProperty(key2) && cityObj[key2] === dbName) {
          return key2
        }
      }
    }
  }
  return city
}

const clearStore = () => {
  setAuthenticated(store, false)
  setToken(store, '')
  setDbName(store, '')
  setSio(store, {})

  // setSmlistDate(store, '')

  setCompany(store, {})
  setUser(store, {})
  setCity(store, '')
}

export const initStorePre = (token, dbName, router) => {
  setToken(store, token)
  setDbName(store, dbName)
  setSio(store, makeSio(token, dbName, router))

  // setSmlistDate(store, moment().format('YYYY-MM-DD'))
}

export const initStore = (results) => {
  setAuthenticated(store, true)
  setCompany(store, {
    _id: results.company._id,
    category: results.company.category,
    city: results.company.city
  })
  setUser(store, {
    _id: results._id,
    name: results.name,
    status: results.status,
    role: results.role
  })

  setCity(store, getCity(store.state.provincecityobj, store.state.dbName))
}

export const checkToken = (name, router) => {
  // let branch = 0 // 进入无需授权的页面或者已得到授权, 直接 next()
  let token = ''
  let dbName = ''

  if (!(UN_CHECK_ROUTER_NAME[name] || store.state.authenticated)) {
    // 进入需要授权的页面但没有获得授权时
    token = window.localStorage.getItem('token')
    dbName = window.localStorage.getItem('dbName')
    if (token && dbName) {
      initStorePre(token, dbName, router)
    } else {
      router.go('/login')
    }
  }
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

export const provincecity = (context) => {
  context.$http.get(PROVINCECITY_URL, OPTIONS).then((response) => {
    let results = JSON.parse(response.body)
    if (results && Object.keys(results).length) {
      setProvincecityobj(store, results)
    }
  }, (err) => {
    window.alert('服务器错误:' + err)
  })
}

export const signup = (context, obj, callback) => {
  context.$http.post(SIGNUP_URL, obj, OPTIONS).then((response) => {
    let results = JSON.parse(response.body)
    callback(results)
  }, (err) => {
    callback(err)
  })
}

export const login = (context, creds, callback) => {
  context.$http.post(LOGIN_URL, creds, OPTIONS).then((response) => {
    let results = JSON.parse(response.body)
    callback(results)
  }, (err) => {
    callback(err)
  })
}

export const logout = (router) => {
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('dbName')
  setSomebody(store, false)
  store.state.sio.disconnect()
  clearStore()
  router.go('/login')
}

export const somebodyIsOnlined = () => {
  setSomebody(store, true)
}

export const somebodyWantOnline = (sid) => {
  pushSid(store, sid)
}

export const setStoreSomebodyFalse = (router, isLogout) => {
  if (isLogout) {
    return logout(router)
  }
  setSomebody(store, false)
}

export const clearStoreSids = (router, iscancel) => {
  emitToServer('cancelSomebodyOnline', iscancel, null)
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
  if (methodName === 'changeRoom') {
    setDbName(store, obj)
  }

  store.state.sio.emit && store.state.sio.emit('cemit-' + methodName, obj,
    (results) => {
      callback(results)
    }
  )
}

export const cloneObj = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

// 导出文件
export const loadFile = (fileName, callback) => {
  window.JSZipUtils.getBinaryContent('static/docx/' + fileName, callback)
}
