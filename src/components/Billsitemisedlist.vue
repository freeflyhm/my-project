<template>
  <div id="billsitemisedlist" class="container">
    <div class="row">
      <div class="col-sm-6 col-md-6">
        <h3><small><a v-link="{ name: 'billsnow' }">应收款</a> / ( {{months[0]}} ) 月账单列表</small></h3>
      </div>
      <div class="col-sm-6 col-md-6 text-right">
        <v-select placeholder="请选择月份" :value.sync="months">
          <v-option v-for="item of monthoptions" :value="item">{{item}}</v-option>
        </v-select>
      </div>
      <table class="table table-bordered table-condensed table-responsive">
        <caption>按金额降序排列</caption>
        <thead>
          <tr>
            <th>序号</th>
            <th>公司-月账单明细</th>
            <th>对账单</th>
            <th>金额</th>
            <th>客户是否已确认</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of list | orderBy 'fee' -1">
            <td>{{$index + 1}}</td>
            <td><a v-link="{ name: 'billsitemised', params: { bpmonth: months[0], bpcompany: item._id }}">{{item.name}}</a></td>
            <td v-if="item.statement"><a v-link="{ name: 'statement', params: { id: item.statementid }}">查看对账单</a></td>
            <td v-else></td>
            <td>{{item.statement ? item.fee : ''}}</td>
            <td>{{item.isLock ? '已确认' : ''}}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3"><strong>合计</strong></td>
            <td><strong>{{feeSum / 100}}</strong></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import vueStrap from 'vue-strap'
import { emitToServer } from '../util/auth'

export default {
  components: {
    vSelect: vueStrap.select,
    vOption: vueStrap.option
  },
  route: {
    data () {
      this.months = [ this.$route.params.bpmonth ]

      emitToServer('getbillsitemisedlist', this.$route.params, (result) => {
        console.log(result)
        let list = []
        let feeSum = 0
        let statements = result.statements
        let companys = result.companys
        let statementsObj = {}
        // let statementsFeeObj = {}

        statements.forEach((item) => {
          statementsObj[item.company] = {
            id: item._id,
            isLock: item.isLock,
            thisMonthBalance: item.thisMonthBalance
          }
          // statementsFeeObj[item.company] = item.thisMonthBalance
        })

        companys.forEach((item) => {
          let statement = false
          let fee = 0
          let isLock = false
          let statementid = ''

          if (typeof statementsObj[item._id] !== 'undefined') {
            statement = true
            fee = statementsObj[item._id].thisMonthBalance
            feeSum += fee
            if (statementsObj[item._id].isLock) {
              isLock = true
            }
            statementid = statementsObj[item._id].id
          }
          list.push({
            _id: item._id,
            name: item.name,
            statement: statement,
            statementid: statementid,
            fee: fee / 100,
            isLock: isLock
          })
        })

        this.list = list
        this.feeSum = feeSum
      })
    }
  },
  data () {
    return {
      months: [],
      list: [],
      feeSum: 0
    }
  },
  computed: {
    monthoptions () {
      let start = moment('2015-05-01')
      let end = moment().startOf('month')
      let opts = []

      do {
        opts.push(start.format('YYYY-MM'))
        start = start.add(1, 'months')
      } while (start.isSameOrBefore(end))

      return opts
    }
  },
  // ready () {},
  // attached () {},
  watch: {
    months (val) {
      if (val[0] !== moment(this.$route.params.bpmonth).format('YYYY-MM')) {
        this.gotoMonth(val[0])
      }
    }
  },
  methods: {
    gotoMonth (month) {
      this.$router.go({
        name: 'billsitemisedlist',
        params: {
          bpmonth: month
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
