/* 自定义验证器 */
'use strict'
import Vue from 'vue'

export default function () {
  // 中文
  Vue.validator('chinese', (val) => {
    return /^[\u4E00-\uFA29]*$/.test(val)
  })

  // 字母和数字
  Vue.validator('letterNum', (val) => {
    return /^[a-zA-Z0-9]*$/.test(val)
  })

  // 用于密码和确认密码
  Vue.validator('match', (val, result) => {
    return result
  })

  // 11位有效手机号码
  Vue.validator('phone', (val) => {
    return /^1\d{10}$/.test(val)
  })

  // 电话
  Vue.validator('tel', (val) => {
    if (val) {
      return /^((\d{3,4})-)(\d{7,8})(-(\d{1,3}))?$/.test(val)
    }
    return true
  })

  // 传真
  Vue.validator('fax', (val) => {
    if (val) {
      return /^(\d{3,4}-)?\d{7,8}$/.test(val)
    }
    return true
  })

  // QQ
  Vue.validator('qq', (val) => {
    if (val) {
      return /^\d*$/.test(val)
    }
    return true
  })
}
