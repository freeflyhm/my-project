/* 自定义过滤器 */
'use strict'
import Vue from 'vue'
import moment from 'moment'

export default function () {
  Vue.filter('formatYYYYMMDD', (value) => {
    return moment(value).format('YYYY-MM-DD')
  })

  Vue.filter('currencyYuan', {
    // model -> view
    // 在更新 <input> 元素之前 ／ 100
    read (val) {
      return val / 100
    },
    // view -> model
    // 在写回数据之前 ＊ 100
    write (val, oldVal) {
      return isNaN(val) ? oldVal : val * 100
    }
  })

  // Vue.filter('jsonStringify2', (val) => {
  //   return JSON.stringify(val, null, 2)
  // })
}
