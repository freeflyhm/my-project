<template>
  <div id="billsitemised" class="container">
    <div class="col-sm-8 col-md-8">
      <h3><small><a v-link="{ name: 'billsnow' }">应收款</a> / <a v-link="{ name: 'billsitemisedlist', params: { bpmonth: month }}">( {{month}} ) 月账单列表</a> / {{company.name}} - 月账单明细</small></h3>
    </div>
    <div class="col-sm-4 col-md-4 text-right">
      <button v-if="!hasStatement" class="btn btn-primary" @click="statementadd">
        生成对账单&nbsp;
        <span class="glyphicon glyphicon-duplicate"></span>
      </button>
    </div>
    <table class="table table-bordered table-condensed table-responsive">
      <caption>团队单费用表</caption>
      <thead>
        <tr>
          <th>序号</th>
          <th>团号</th>
          <th>服务单号</th>
          <th>日期</th>
          <th>类型</th>
          <th>航班号</th>
          <th>人数</th>
          <th>验证</th>
          <th>代收</th>
          <th>代付</th>
          <th>服务费</th>
          <th>交通费</th>
          <th>保险</th>
          <th>现场</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of sms">
          <td>{{$index + 1}}</td>
          <td>{{item.team.teamNum}}</td>
          <td>{{item | getSmNum city}}</td>
          <td>{{item.flight.flightDate | formatYYYYMMDD}}</td>
          <td>{{item.team.teamType}}</td>
          <td>{{item.flight.flightNum}}</td>
          <td>{{item.smRealNumber}}</td>
          <td>{{item.idcardsmfees}}</td>
          <td>{{item.smAgencyFund_y / 100}}</td>
          <td>{{item.smPayment_y / 100}}</td>
          <td>{{(item.fees + item.addFees) / 100}}</td>
          <td>{{item.carFees / 100}}</td>
          <td>{{item.insurance}}</td>
          <td>{{item.serverMan}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6"><strong>合计</strong></td>
          <td><strong>{{smsSum.smRealNumber}}</strong></td>
          <td><strong>{{smsSum.idcardsmfees}}</strong></td>
          <td><strong>{{smsSum.smAgencyFund_y / 100}}</strong></td>
          <td><strong>{{smsSum.smPayment_y / 100}}</strong></td>
          <td><strong>{{smsSum.fees / 100}}</strong></td>
          <td><strong>{{smsSum.carFees / 100}}</strong></td>
          <td><strong>{{smsSum.insurance}}</strong></td>
          <td></td>
        </tr>
      </tfoot>
    </table>
    <table class="table table-bordered table-condensed table-responsive">
      <caption>往来账</caption>
      <thead>
        <tr>
          <th>序号</th>
          <th>备注</th>
          <th>日期</th>
          <th>借贷</th>
          <th>金额</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of bps">
          <td>{{$index + 1}}</td>
          <td>{{item.bpNote}}</td>
          <td>{{item.bpDate | formatYYYYMMDD}}</td>
          <td>{{item.bpTpye === 1 ? '借' : '贷'}}</td>
          <td>{{item.bpNum / 100}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4"><strong>合计</strong></td>
          <td><strong>{{bpNumSum / 100}}</strong></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
// import store from '../vuex/store'
import moment from 'moment'
import { emitToServer } from '../util/auth'

export default {
  // store,
  vuex: {
    getters: {
      city: state => state.city
    }
  },
  route: {
    data () {
      this.month = this.$route.params.bpmonth
      this.hasStatement = true

      emitToServer('getbillsitemised', this.$route.params, (result) => {
        console.log(result)
        let i
        let len
        let item
        let smArr = []
        let smssum = {
          smRealNumber: 0,
          idcardsmfees: 0,
          smAgencyFund_y: 0,
          smPayment_y: 0,
          fees: 0,
          carFees: 0,
          insurance: 0
        }
        let bpArr = []
        let bpnumsum = 0

        this.sms = result.sms
        this.bps = result.bps
        this.company = result.company
        this.hasStatement = result.hasStatement
        this.isLock = result.isLock
        this.lastMonthBalance = result.lastMonthBalance

        // sms 统计
        len = result.sms.length
        for (i = 0; i < len; i += 1) {
          item = result.sms[i]

          smArr.push({
            sn: i + 1,
            teamNum: item.team.teamNum,
            smDate: moment(item.flight.flightDate).format('YYYY-MM-DD'),
            operator: item.operator.substr(0, item.operator.length - 11),
            teamType: item.team.teamType,
            flightNum: item.flight.flightNum,
            smRealNumber: item.smRealNumber,
            idcardsmfees: item.idcardsmfees,
            smAgencyFund_y: item.smAgencyFund_y,
            smPayment_y: item.smPayment_y,
            fees: item.fees + item.addFees,
            carFees: item.carFees
          })

          smssum.smRealNumber += item.smRealNumber
          smssum.idcardsmfees += item.idcardsmfees
          smssum.smAgencyFund_y += item.smAgencyFund_y
          smssum.smPayment_y += item.smPayment_y
          smssum.fees += (item.fees + item.addFees)
          smssum.carFees += item.carFees
          smssum.insurance += item.insurance
        }
        this.smArr = smArr
        this.smsSum = smssum

        // bps 统计
        len = result.bps.length
        for (i = 0; i < len; i += 1) {
          item = result.bps[i]

          bpArr.push({
            sn: i + 1,
            bpNote: item.bpNote,
            bpDate: moment(item.bpDate).format('YYYY-MM-DD'),
            bpTypeHtml: item.bpTpye === 1 ? '借' : '贷',
            bpNum: item.bpNum
          })

          bpnumsum += item.bpNum
        }
        this.bpArr = bpArr
        this.bpNumSum = bpnumsum
      })
    }
  },
  data () {
    return {
      month: '',
      sms: [],
      bps: [],
      company: {
        _id: '',
        idcardfee: 1000,
        name: ''
      },
      hasStatement: true,
      isLock: false,
      lastMonthBalance: 0,
      smArr: [],
      smsSum: {
        smRealNumber: 0,
        idcardsmfees: 0,
        smAgencyFund_y: 0,
        smPayment_y: 0,
        fees: 0,
        carFees: 0,
        insurance: 0
      },
      bpArr: [],
      bpNumSum: 0
    }
  },
  // computed: {},
  // ready () {},
  // attached () {},
  methods: {
    statementadd () {
      var idcardsmfeesSum = this.smsSum.idcardsmfees
      var idcardsmfeesUnit = this.company.idcardfee || 1000
      var lastMonthBalance
      var idcardsmfees
      var thisMonthBalance

      if (typeof this.lastMonthBalance === 'undefined') {
        lastMonthBalance = window.prompt('没有找到上个月的对账单, 如果要生成对账单, 请填写上个月余额:', '')
        if (lastMonthBalance !== null) {
          lastMonthBalance = Number(lastMonthBalance) * 100
          if (isNaN(lastMonthBalance)) {
            return window.alert('请输入正确的金额')
          }
        } else {
          return
        }
      } else {
        lastMonthBalance = this.lastMonthBalance
      }

      if (!this.isLock) {
        return window.alert('上个月的对账单等待客户确认, 在客户确认前不能生成本月对账单')
      }

      idcardsmfees = idcardsmfeesSum * idcardsmfeesUnit / 1000

      thisMonthBalance = lastMonthBalance +
        this.smsSum.smAgencyFund_y +
        this.smsSum.smPayment_y +
        this.smsSum.fees +
        this.smsSum.carFees +
        (idcardsmfees * 100) +
        this.bpNumSum

      emitToServer('statementadd', {
        company: this.company._id,
        month: this.month,
        smArr: this.smArr,
        lastMonthBalance: lastMonthBalance,
        smAgencyFund_y_sum: this.smsSum.smAgencyFund_y,
        smPayment_y_sum: this.smsSum.smPayment_y,
        fees_sum: this.smsSum.fees,
        idcardsmfees_sum: idcardsmfeesSum,
        idcardsmfees_unit: idcardsmfeesUnit,
        carFees_sum: this.smsSum.carFees,
        bpArr: this.bpArr,
        bpNum_sum: this.bpNumSum,
        thisMonthBalance: thisMonthBalance
      }, (result) => {
        console.log(result)
        if (result.success === 1) {
          this.$router.go({
            name: 'billsitemisedlist',
            params: {
              bpmonth: this.month
            }
          })
        } else {
          window.alert('服务器错误, 生成对账单不成功!')
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
