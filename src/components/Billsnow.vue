<template>
  <div id="billnow" class="container">
    <div class="col-sm-12 col-md-12">
      <h3>应收款</h3>
    </div>
    <table class="table table-bordered table-condensed table-responsive">
      <caption>按当前余额额降序排列</caption>
      <thead>
        <tr>
          <td>序号</td>
          <td>公司</td>
          <td>上月余额</td>
          <td>本月已收</td>
          <td>本月已付</td>
          <td>本月往来</td>
          <td>当前余额</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of companys | orderBy 'thisMonthBalance' -1">
          <td>{{$index + 1}}</td>
          <td v-if="item.is_billsitemised"><a v-link="{ name: 'billsitemised', params: { bpmonth: bpmonth, bpcompany: item._id }}">{{item.name}}</a></td>
          <td v-else>{{item.name}}</td>
          <td v-if="item.is_statement"><a v-link="{ name: 'statement', params: { id: item.statementid }}">{{item.lastMonthBalance / 100}}</a></td>
          <td v-else><span style="color: red; font-weight: 700;">{{item.lastMonthBalance / 100}}</span></td>
          <td>{{item.smAgencyFund_y / 100}}</td>
          <td>{{item.smPayment_y / 100}}</td>
          <td>{{item.bpNum / 100}}</td>
          <td>{{item.thisMonthBalance / 100}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"><strong>合计</strong></td>
          <td><strong>{{sum.lastMonthBalance / 100}}</strong></td>
          <td><strong>{{sum.smAgencyFund_y / 100}}</strong></td>
          <td><strong>{{sum.smPayment_y / 100}}</strong></td>
          <td><strong>{{sum.bpNum / 100}}</strong></td>
          <td><strong>{{sum.thisMonthBalance / 100}}</strong></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
import { emitToServer } from '../util/auth'

export default {
  route: {
    data () {
      emitToServer('getbillsnow', null, (result) => {
        console.log(result)
        let statements = result.statements
        let sms = result.sms
        let bps = result.bps
        let companys = result.companys
        let statementsObj = {}
        let smsObj = {}
        let bpsObj = {}
        let sum = {
          lastMonthBalance: 0,
          smAgencyFund_y: 0,
          smPayment_y: 0,
          bpNum: 0,
          thisMonthBalance: 0
        }

        // 上月余额
        statements.forEach(function (item) {
          statementsObj[item.company] = item
        })

        // 本月已收或已付
        sms.forEach(function (item) {
          smsObj[item._id] = item
        })

        // 本月往来
        bps.forEach(function (item) {
          bpsObj[item._id] = item
        })

        // 填充 companys
        companys.forEach(function (item) {
          let id = item._id
          let lastMonthBalance = 0 // 上月余额
          let smAgencyFundY = 0    // 本月已收
          let smPaymentY = 0       // 本月已付
          let bpNum = 0            // 本月往来
          let thisMonthBalance     // 本月余额

          // 上月余额
          if (statementsObj[id]) {
            item.is_statement = true
            item.statementid = statementsObj[id]._id
            lastMonthBalance = statementsObj[id].thisMonthBalance
          }

          // 本月已收或已付
          if (smsObj[id]) {
            item.is_billsitemised = true
            smAgencyFundY = smsObj[id].smAgencyFund_y_sum
            smPaymentY = smsObj[id].smPayment_y_sum
          }

          // 本月往来
          if (bpsObj[id]) {
            item.is_billsitemised = true
            bpNum = bpsObj[id].bpNum_sum
          }

          // 本月余额
          thisMonthBalance = lastMonthBalance + smAgencyFundY + smPaymentY + bpNum

          item.lastMonthBalance = lastMonthBalance
          item.smAgencyFund_y = smAgencyFundY
          item.smPayment_y = smPaymentY
          item.bpNum = bpNum
          item.thisMonthBalance = thisMonthBalance

          sum.lastMonthBalance += lastMonthBalance
          sum.smAgencyFund_y += smAgencyFundY
          sum.smPayment_y += smPaymentY
          sum.bpNum += bpNum
          sum.thisMonthBalance += thisMonthBalance
        })

        this.companys = companys
        this.sum = sum
      })
    }
  },
  data () {
    return {
      companys: [],
      sum: {
        lastMonthBalance: 0,
        smAgencyFund_y: 0,
        smPayment_y: 0,
        bpNum: 0,
        thisMonthBalance: 0
      }
    }
  },
  computed: {
    bpmonth () {
      return moment().format('YYYY-MM')
    }
  }
}
</script>

<style scoped>
</style>
