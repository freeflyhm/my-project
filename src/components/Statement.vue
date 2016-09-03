<template>
  <div id="statement" class="container">
    <div class="col-sm-8 col-md-8">
      <h3 v-if="company.category === 30"><small><a v-link="{ name: 'billsnow' }">应收款</a> / <a v-link="{ name: 'billsitemisedlist', params: { bpmonth: month }}">返回 ( {{month}} ) 月账单列表</a> / {{companyAt.name}} - 对账单</small></h3>
      <h3 v-else>{{companyAt.name}} - 对账单</h3>
    </div>
    <div class="col-sm-4 col-md-4 text-right">
      <div v-if="company.category === 30" style="display: inline;">
        <button v-show="!isLock" class="btn btn-sm btn-danger" @click="removeStatement">
          删除对账单&nbsp;
          <span class="glyphicon glyphicon-duplicate"></span>
        </button>
      </div>
      <button v-show="!isLock" class="btn btn-sm btn-success" @click="lockStatement">
        确认对账单&nbsp;
        <span class="glyphicon glyphicon-duplicate"></span>
      </button>
      <button class="btn btn-sm btn-default" @click="importStatement">
        导出对账单&nbsp;
        <span class="glyphicon glyphicon-duplicate"></span>
      </button>
    </div>
    <table class="table table-bordered table-condensed table-responsive">
      <caption>尊敬的客户您好, 贵公司{{month}}月产生的费用明细如下, 请核对:</caption>
      <thead>
        <tr>
          <th>序号</th>
          <th>团号</th>
          <th>日期</th>
          <th>操作人</th>
          <th>类型</th>
          <th>航班</th>
          <th>人数</th>
          <th>验证</th>
          <th>代收款</th>
          <th>代付款</th>
          <th>服务费</th>
          <th>交通费</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of sms">
          <td>{{item.sn}}</td>
          <td>{{item.teamNum}}</td>
          <td>{{item.smDate}}</td>
          <td>{{item.operator}}</td>
          <td>{{item.teamType}}</td>
          <td>{{item.flightNum}}</td>
          <td>{{item.smRealNumber}}</td>
          <td>{{item.idcardsmfees}}</td>
          <td>{{item.smAgencyFund_y / 100}}</td>
          <td>{{item.smPayment_y / 100}}</td>
          <td>{{item.fees / 100}}</td>
          <td>{{item.carFees / 100}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="7"><strong>合计</strong></td>
          <td><strong>{{smsSum.idcardsmfees}}</strong></td>
          <td><strong>{{smsSum.smAgencyFund_y}}</strong></td>
          <td><strong>{{smsSum.smPayment_y}}</strong></td>
          <td><strong>{{smsSum.fees}}</strong></td>
          <td><strong>{{smsSum.carFees}}</strong></td>
        </tr>
      </tfoot>
    </table>
    <table class="table table-bordered table-condensed table-responsive">
      <caption>{{month}}月我处与贵公司发生的往来账明细</caption>
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
          <td>{{item.sn}}</td>
          <td>{{item.bpNote}}</td>
          <td>{{item.bpDate}}</td>
          <td>{{item.bpTypeHtml}}</td>
          <td>{{item.bpNum / 100}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4"><strong>合计</strong></td>
          <td><strong>{{bpNumSum}}</strong></td>
        </tr>
      </tfoot>
    </table>
    <table style="width: 600px;" class="table table-bordered table-condensed table-responsive">
      <caption>{{month}}月汇总如下:</caption>
      <thead>
        <tr>
          <th>序号</th>
          <th>项目</th>
          <th>金额</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>上月余额</td>
          <td>{{total.lastMonthBalance}}</td>
        </tr>
        <tr>
          <td>2</td>
          <td>代收款合计</td>
          <td>{{smsSum.smAgencyFund_y}}</td>
        </tr>
        <tr>
          <td>3</td>
          <td>代付款合计</td>
          <td>{{smsSum.smPayment_y}}</td>
        </tr>
        <tr>
          <td>4</td>
          <td>服务费合计</td>
          <td>{{smsSum.fees}}</td>
        </tr>
        <tr>
          <td>5</td>
          <td>交通费合计</td>
          <td>{{smsSum.carFees}}</td>
        </tr>
        <tr>
          <td>6</td>
          <td>验证费合计 ({{smsSum.idcardsmfees}}次 x {{total.idcardsmfeesUnit}}元/次)</td>
          <td>{{total.idcardsmfees}}</td>
        </tr>
        <tr>
          <td>7</td>
          <td>往来合计</td>
          <td>{{bpNumSum}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"><strong>本月余额</strong></td>
          <td><strong>{{total.thisMonthBalance}}</strong></td>
        </tr>
      </tfoot>
    </table>
    <h4>贵公司的{{typename}}为{{total.thisMonthBalanceAbs}}元, 如账单有误请告知我们核实, 如无误请于每月10日前结清, 谢谢支持! 祝生意兴隆!</h4>
    <table style="width: 600px;" class="table table-bordered table-condensed table-responsive">
      <caption>银行账号:</caption>
      <thead>
        <tr>
          <th>开户行</th>
          <th>账号</th>
          <th>开户名</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>建设银行深圳分行笋岗支行</td>
          <td>6227007200510200126</td>
          <td>汪凌云</td>
        </tr>
        <tr>
          <td>招商银行深圳分行</td>
          <td>6226097806243813</td>
          <td>汪凌云</td>
        </tr>
      </tbody>
    </table>

    <modal backdrop="false"
      effect="zoom"
      :show.sync="showDelModal" small>
      <div slot="modal-header" class="modal-header" style="padding: 8px 15px;">
        <h4>删除对账单</h4>
      </div>
      <div slot="modal-body" class="modal-body" style="padding-bottom: 0;">
        <div class="alert alert-danger">
          <p>确定要删除吗 ?</p>
        </div>
        <div v-if="showDelModalFooter" class="modal-footer">
          <button class="btn btn-danger" @click="onDelSubmit">删除</button>
          <button class="btn btn-default" @click="showDelModal = false">取消</button>
        </div>
      </div>
      <div slot="modal-footer" style="display: none;"></div>
    </modal>
  </div>
</template>

<script>
import vueStrap from 'vue-strap'
import moment from 'moment'
import Docxtemplater from 'docxtemplater'
import { saveAs } from 'filesaver.js'
// import store from '../vuex/store'
import { emitToServer, loadFile } from '../util/auth'

export default {
  // store,
  vuex: {
    getters: {
      company: state => state.company
    }
  },
  components: {
    modal: vueStrap.modal
  },
  route: {
    data () {
      this.isLock = true
      this.typename = '应付款'

      emitToServer('getstatement', this.$route.params, (result) => {
        let setDataTitleUn = ''
        let setData = {}
        let sSmArr = []
        let sBpArr = []
        let i
        let len
        let item
        let idcardsmfeesSumSpan
        let idcardsmfeesUnitSpan

        if (result.statement) {
          idcardsmfeesSumSpan = result.statement.idcardsmfees_sum || 0
          idcardsmfeesUnitSpan = result.statement.idcardsmfees_unit || 1000

          this.id = result.statement._id
          this.month = moment(result.statement.month).format('YYYY-MM')
          this.companyAt = result.company
          this.isLock = result.statement.isLock
          this.sms = result.statement.smArr
          this.bps = result.statement.bpArr

          this.smsSum = {
            idcardsmfees: idcardsmfeesSumSpan,
            smAgencyFund_y: result.statement.smAgencyFund_y_sum / 100,
            smPayment_y: result.statement.smPayment_y_sum / 100,
            fees: result.statement.fees_sum / 100,
            carFees: result.statement.carFees_sum / 100
          }

          setData.idcardsmfees_sum = this.smsSum.idcardsmfees || 0
          setData.smAgencyFund_y_sum = this.smsSum.smAgencyFund_y
          setData.smPayment_y_sum = this.smsSum.smPayment_y
          setData.fees_sum = this.smsSum.fees
          setData.carFees_sum = this.smsSum.carFees

          this.bpNumSum = result.statement.bpNum_sum / 100
          setData.bpNum_sum = this.bpNumSum

          this.total = {
            lastMonthBalance: result.statement.lastMonthBalance / 100,
            // smAgencyFund_y: result.statement.smAgencyFund_y_sum / 100,
            // smPayment_y: result.statement.smPayment_y_sum / 100,
            // fees: result.statement.fees_sum / 100,
            // carFees: result.statement.carFees_sum / 100,
            // idcardsmfeesSum: idcardsmfeesSumSpan,
            idcardsmfeesUnit: idcardsmfeesUnitSpan / 1000,
            idcardsmfees: idcardsmfeesSumSpan * idcardsmfeesUnitSpan / 1000,
            // bpNum: result.statement.bpNum_sum / 100,
            thisMonthBalance: result.statement.thisMonthBalance / 100,
            thisMonthBalanceAbs: Math.abs(result.statement.thisMonthBalance / 100)
          }
          this.typename =
              (result.statement.thisMonthBalance < 0) ? '预付款余额' : '应付款'

          setData.lastMonthBalance = this.total.lastMonthBalance
          setData.idcardsmfees_unit_span_text = this.total.idcardsmfeesUnit
          setData.idcardsmfees_sum_td_text = this.total.idcardsmfees
          setData.thisMonthBalance = this.total.thisMonthBalance
          setData.thisMonthBalance_abs = this.total.thisMonthBalanceAbs
          setData.typename = this.typename

          if (!this.isLock) {
            setDataTitleUn = '(未确认)'
          }

          setData.y_m = this.month.replace('-', '年') + '月'
          setData.title = this.companyAt.name + setData.y_m + '对账单' + setDataTitleUn

          len = this.sms.length
          for (i = 0; i < len; i += 1) {
            item = this.sms[i]
            sSmArr.push({
              sn: item.sn,
              teamNum: item.teamNum,
              smDate: item.smDate,
              operator: item.operator,
              teamType: item.teamType,
              flightNum: item.flightNum,
              smRealNumber: item.smRealNumber,
              idcardsmfees: item.idcardsmfees || 0,
              smAgencyFund_y: item.smAgencyFund_y / 100,
              smPayment_y: item.smPayment_y / 100,
              fees: item.fees / 100,
              carFees: item.carFees / 100
            })
          }
          setData.s_smArr = sSmArr

          len = this.bps.length
          for (i = 0; i < len; i += 1) {
            item = this.bps[i]
            sBpArr.push({
              sn: item.sn,
              bpNote: item.bpNote,
              bpDate: item.bpDate,
              bpTypeHtml: item.bpTypeHtml,
              bpNum: item.bpNum / 100
            })
          }
          setData.s_bpArr = sBpArr

          this.setData = setData
        }
      })
    }
  },
  data () {
    return {
      month: '',
      companyAt: {
        _id: '',
        name: ''
      },
      isLock: false,
      id: '',
      sms: [],
      bps: [],
      smsSum: {
        idcardsmfees: 0,
        smAgencyFund_y: 0,
        smPayment_y: 0,
        fees: 0,
        carFees: 0
      },
      bpNumSum: 0,
      total: {
        lastMonthBalance: 0,
        // smAgencyFund_y: 0,
        // smPayment_y: 0,
        // fees: 0,
        // carFees: 0,
        // idcardsmfeesSum: 0,
        idcardsmfeesUnit: 0,
        idcardsmfees: 0,
        // bpNum: 0,
        thisMonthBalance: 0,
        thisMonthBalanceAbs: 0
      },
      typename: '应付款',
      showDelModal: false,
      showDelModalFooter: true,
      setData: {}
    }
  },
  // computed: {},
  // ready () {},
  // attached () {},
  methods: {
    removeStatement () {
      this.showDelModal = true
    },
    onDelSubmit () {
      this.showUpdateModalFooter = false
      emitToServer('statementremove', { id: this.id }, (result) => {
        this.showUpdateModalFooter = true
        if (result.success === 1) {
          this.showDelModal = false
          this.$router.go({
            name: 'billsitemisedlist',
            params: {
              bpmonth: this.month
            }
          })
        } else {
          window.alert('服务器错误, 删除对账单不成功!')
        }
      })
    },
    lockStatement () {
      emitToServer('statementlock', { id: this.id }, (result) => {
        if (result.success === 1) {
          this.$router.go({
            name: 'billsitemisedlist',
            params: {
              bpmonth: this.month
            }
          })
        } else {
          window.alert('服务器错误, 确认对账单不成功!')
        }
      })
    },
    importStatement () {
      let docx
      let out

      loadFile('statementTable.docx', (err, content) => {
        if (err) { throw err }

        docx = new Docxtemplater(content)
        docx.setData(this.setData)
        docx.render()
        out = docx.getZip().generate({ type: 'blob' })

        saveAs(out, this.setData.title + '.docx')
      })
    }
  }
}
</script>

<style scoped>
</style>
