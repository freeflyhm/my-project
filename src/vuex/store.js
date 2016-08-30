/**
 * somebody: 有人已登录
 * company: { _id, category, city }
 * user: { _id, name, role, status }
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  provincecityobj: {},
  somebody: false,
  sids: [],
  authenticated: false,
  token: '',
  dbName: '',
  sio: {},
  smlistDate: '',
  company: {},
  user: {},
  city: ''
}

const mutations = {
  SET_PROVINCECITYOBJ (state, provincecityobj) {
    state.provincecityobj = provincecityobj
  },

  // 有人已登录
  SET_SOMEBODY (state, isTrue) {
    state.somebody = isTrue
  },

  // 有人要登录
  PUSH_SID (state, sid) {
    state.sids.push(sid)
  },

  CLEAR_SIDS (state) {
    state.sids = []
  },

  // 验证通过
  SET_AUTHENTICATED (state, authenticated) {
    state.authenticated = authenticated
  },

  SET_TOKEN (state, token) {
    state.token = token
  },

  // sz
  SET_DB_NAME (state, dbName) {
    state.dbName = dbName
  },

  SET_SIO (state, sio) {
    state.sio = sio
  },

  SET_SMLIST_DATE (state, smlistDate) {
    state.smlistDate = smlistDate
  },

  SET_COMPANY (state, company) {
    state.company = company
  },

  SET_USER (state, user) {
    state.user = user
  },

  // 深圳
  SET_CITY (state, city) {
    state.city = city
  }
}

export default new Vuex.Store({
  // 生产模式请注释下一行
  strict: true,
  state,
  mutations
})
