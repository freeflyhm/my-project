/* 自定义过滤器 */
'use strict'
import Vue from 'vue'
import moment from 'moment'

export default function () {
  Vue.filter('formatYYYYMMDD', (value) => {
    return moment(value).format('YYYY-MM-DD')
  })

  // Vue.filter('formatYYYYMM', (value) => {
  //   return moment(value).format('YYYY-MM')
  // })

  // 转换 正(非负) (元<->分) 千万以内
  Vue.filter('convertPositiveYuan', {
    // model -> view
    // 在更新 <input> 元素之前 ／ 100
    read (val) {
      return val / 100
    },
    // view -> model
    // 在写回数据之前 ＊ 100
    write (val, oldVal) {
      const re = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
      return re.test(val) ? val * 100 : oldVal * 100
    }
  })

  // 转换 正负 (元<->分) 千万以内
  Vue.filter('convertYuan', {
    read (val) {
      return val / 100
    },
    write (val, oldVal) {
      const re = /^(-?[1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
      return re.test(val) ? val * 100 : oldVal * 100
    }
  })

  Vue.filter('convertTime', {
    read (val) {
      return val
    },
    write (val, oldVal) {
      const re = /^(([01][0-9])|(2[0-3])):[0-5][0-9]$/
      return re.test(val) ? val : oldVal
    }
  })

  // 转换 正(非负) 整数 千万以内
  Vue.filter('convertPositiveNum', {
    read (val) {
      return val
    },
    write (val, oldVal) {
      const re = /^([1-9][\d]{0,7})$|^0$/
      return re.test(val) ? val : oldVal
    }
  })

  // 转换 正负 整数 千万以内
  Vue.filter('convertNum', {
    read (val) {
      return val
    },
    write (val, oldVal) {
      const re = /^(-?[1-9][\d]{0,7})$|^0$/
      return re.test(val) ? val : oldVal
    }
  })

  Vue.filter('getSmNum', (item, city) => {
    let smDate = moment(item.flight.flightDate).format('MMDD')
    let smType = item.flight.flightStartCity === city ? '送' : '接'
    let smTime = (item.flight.flightStartCity === city
      ? moment(item.flight.flightStartTime).format('HHmm')
      : moment(item.flight.flightEndTime).format('HHmm'))
    return smDate + smTime +
      item.flight.flightNum +
      (item.operator).substr(0, item.operator.length - 11) +
      item.smRealNumber + '人' +
      (item.smType2 === 1 ? '内' : '外') + smType
  })

  Vue.filter('getCompanyName', (item, companyIdObj) => {
    return companyIdObj[item]
  })

  // Vue.filter('substrOperator', (value) => {
  //   return value.substr(0, value.length - 11)
  // })
}
