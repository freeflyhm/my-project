<template>
  <div id="billstotal" class="container">
    <div class="row">
      <div class="col-sm-6 col-md-6">
        <h3>( {{months[0]}} ) 月账单汇总</h3>
      </div>
      <div class="col-sm-6 col-md-6 text-right">
        <v-select placeholder="请选择月份" :value.sync="months">
          <v-option v-for="item of monthoptions" :value="item">{{item}}</v-option>
        </v-select>
      </div>
      <!--  filed="sum" :order="-1" -->
      <zx-billstotal-table
        caption="按公司贡献总额降序排列"
        title="公司名称"
        :arr="smArr"
        :sum="smArrSum"
      ></zx-billstotal-table>
      <div id="companyChart" style="height: 400px;"></div>
       <!-- filed="key" :order="1" -->
      <zx-billstotal-table
        caption="按日期统计"
        title="日期"
        :arr="smDateArr" :format="true"
        :sum="smArrSum"
      ></zx-billstotal-table>
      <div id="dateChart" style="height: 400px;"></div>
       <!-- filed="sum" :order="-1" -->
      <zx-billstotal-table
        caption="按现场负责人贡献总额降序"
        title="现场"
        :arr="smSevArr"
        :sum="smArrSum"
      ></zx-billstotal-table>
      <div id="sevChart" style="height: 400px;"></div>
    </div>
  </div>
</template>

<script>
import store from '../vuex/store'
import vueStrap from 'vue-strap'
import moment from 'moment'
import { emitToServer } from '../util/auth'

import echarts from 'echarts'

export default {
  store,
  vuex: {
    getters: {
      city: state => state.city
    }
  },
  components: {
    vSelect: vueStrap.select,
    vOption: vueStrap.option,
    zxBillstotalTable: {
      props: [
        'caption',
        'title',
        // 'arr', 'filed', 'order', 'format',
        'arr', 'format',
        'sum'
      ],
      template: '<table class="table table-bordered table-condensed table-responsive">' +
          '<caption>{{caption}}</caption>' +
          '<thead>' +
            '<tr>' +
              '<th rowspan="2">序号</th>' +
              '<th rowspan="2" style="min-width: 230px;">{{title}}</th>' +
              '<th colspan="7">送机-散客</th>' +
              '<th class="text-primary" colspan="7">送机-包团</th>' +
              '<th colspan="3">接机</th>' +
              '<th rowspan="2">贡献合计</th>' +
            '</tr>' +
            '<tr>' +
              '<th>团数</th>' +
              '<th>人数</th>' +
              '<th>验证</th>' +
              '<th>服务费</th>' +
              '<th class="success">保险数</th>' +
              '<th>保险费</th>' +
              '<th>购买率</th>' +
              '<th class="text-primary">团数</th>' +
              '<th class="text-primary">人数</th>' +
              '<th class="text-primary">验证</th>' +
              '<th class="text-primary">服务费</th>' +
              '<th class="text-primary success">保险数</th>' +
              '<th class="text-primary">保险费</th>' +
              '<th class="text-primary">购买率</th>' +
              '<th>团数</th>' +
              '<th>人数</th>' +
              '<th>服务费</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            // '<tr v-for="item of arr | orderBy filed order">' +
            '<tr v-for="item of arr">' +
              '<td>{{$index + 1}}</td>' +
              '<td v-if="format">{{item.key | formatYYYYMMDD}}</td>' +
              '<td v-else>{{item.key}}</td>' +
              '<td>{{item.teamNum1 ? item.teamNum1 : \'\'}}</td>' +
              '<td>{{item.teamNum1 ? item.peopleNum1 : \'\'}}</td>' +
              '<td>{{item.teamNum1 ? item.idcardsmfees1 : \'\'}}</td>' +
              '<td>{{item.teamNum1 ? item.fees1 : \'\'}}</td>' +
              '<td class="success">{{item.teamNum1 ? item.insurance1 : \'\'}}</td>' +
              '<td>{{item.teamNum1 ? item.insuranceFee1 : \'\'}}</td>' +
              '<td>{{item.peopleNum1 ? Math.ceil(item.insurance1 * 100 / item.peopleNum1) + \'%\' : \'\'}}</td>' +
              '<td class="text-primary">{{item.teamNum2 ? item.teamNum2 : \'\'}}</td>' +
              '<td class="text-primary">{{item.teamNum2 ? item.peopleNum2 : \'\'}}</td>' +
              '<td class="text-primary">{{item.teamNum2 ? item.idcardsmfees2 : \'\'}}</td>' +
              '<td class="text-primary">{{item.teamNum2 ? item.fees2 : \'\'}}</td>' +
              '<td class="text-primary success">{{item.teamNum2 ? item.insurance2 : \'\'}}</td>' +
              '<td class="text-primary">{{item.teamNum2 ? item.insuranceFee2 : \'\'}}</td>' +
              '<td class="text-primary">{{item.peopleNum2 ? Math.ceil(item.insurance2 * 100 / item.peopleNum2) + \'%\' : \'\'}}</td>' +
              '<td>{{item.teamNum3 ? item.teamNum3 : \'\'}}</td>' +
              '<td>{{item.teamNum3 ? item.peopleNum3 : \'\'}}</td>' +
              '<td>{{item.teamNum3 ? item.fees3 : \'\'}}</td>' +
              '<td>{{item.sum}}</td>' +
            '</tr>' +
          '</tbody>' +
          '<tfoot>' +
            '<tr>' +
              '<td colspan="2"><strong>合计</strong></td>' +
              '<td><strong>{{sum.teamNum1}}</strong></td>' +
              '<td><strong>{{sum.peopleNum1}}</strong></td>' +
              '<td><strong>{{sum.idcardsmfees1}}</strong></td>' +
              '<td><strong>{{sum.fees1}}</strong></td>' +
              '<td class="success"><strong>{{sum.insurance1}}</strong></td>' +
              '<td><strong>{{sum.insuranceFee1}}</strong></td>' +
              '<td><strong>{{Math.ceil(sum.insurance1 * 100 / sum.peopleNum1) ? (Math.ceil(sum.insurance1 * 100 / sum.peopleNum1) + \'%\') : \'\'}}</strong></td>' +
              '<td class="text-primary"><strong>{{sum.teamNum2}}</strong></td>' +
              '<td class="text-primary"><strong>{{sum.peopleNum2}}</strong></td>' +
              '<td class="text-primary"><strong>{{sum.idcardsmfees2}}</strong></td>' +
              '<td class="text-primary"><strong>{{sum.fees2}}</strong></td>' +
              '<td class="text-primary success"><strong>{{sum.insurance2}}</strong></td>' +
              '<td class="text-primary"><strong>{{sum.insuranceFee2}}</strong></td>' +
              '<td class="text-primary"><strong>{{Math.ceil(sum.insurance2 * 100 / sum.peopleNum2) ? (Math.ceil(sum.insurance2 * 100 / sum.peopleNum2) + \'%\') : \'\'}}</strong></td>' +
              '<td><strong>{{sum.teamNum3}}</strong></td>' +
              '<td><strong>{{sum.peopleNum3}}</strong></td>' +
              '<td><strong>{{sum.fees3}}</strong></td>' +
              '<td><strong>{{sum.sum}}</strong></td>' +
            '</tr>' +
          '</tfoot>' +
        '</table>'
    }
  },
  route: {
    data () {
      this.months = [ this.$route.params.bpmonth ]

      emitToServer('getbillstotal', this.$route.params, (result) => {
        const BAO_XIAN_FEI = 30
        const CITY = this.city
        let sms = result.sms
        let smObj = {}
        let smArr = []
        let smArrKey = []
        let smArrTotal = []
        let smArrTeam = []
        let smArrPeople = []
        let smArrInsurance = []
        let smArrIdcardsmfees = []

        let smArrSum = {
          teamNum1: 0,
          peopleNum1: 0,
          fees1: 0,
          idcardsmfees1: 0,
          insurance1: 0,
          insuranceFee1: 0,
          teamNum2: 0,
          peopleNum2: 0,
          fees2: 0,
          idcardsmfees2: 0,
          insurance2: 0,
          insuranceFee2: 0,
          teamNum3: 0,
          peopleNum3: 0,
          fees3: 0,
          sum: 0
        }
        let smDateObj = {}
        let smDateArr = []
        let smDateArrKey = []
        let smDateArrTotal = []
        let smDateArrTeam = []
        let smDateArrPeople = []
        let smDateArrInsurance = []
        let smDateArrIdcardsmfees = []

        let smSevObj = {}
        let smSevArr = []
        let smSevArrKey = []
        let smSevArrTotal = []
        let smSevArrTeam = []
        let smSevArrPeople = []
        let smSevArrInsurance = []
        // let smSevArrIdcardsmfees = []

        let key
        let fees1
        let idcardsmfees1
        let insurance1
        let insuranceFee1
        let fees2
        let idcardsmfees2
        let insurance2
        let insuranceFee2
        let fees3
        let item

        let companyChart
        let dateChart
        let sevChart
        let i
        let len

        const setSmObj = (smObj, name, objType, obj) => {
          name = name || '待定'

          if (smObj[name]) {
            smObj[name][objType]['teamNum'] += 1
            smObj[name][objType]['peopleNum'] += obj.peopleNum
            smObj[name][objType]['fees'] += obj.fees
            if (objType !== 'meet') {
              smObj[name][objType]['idcardsmfees'] += obj.idcardsmfees
              smObj[name][objType]['insurance'] += obj.insurance
            }
          } else {
            // 初始化
            smObj[name] = {
              san: {
                teamNum: 0,
                peopleNum: 0,
                fees: 0,
                idcardsmfees: 0,
                insurance: 0
              },
              bao: {
                teamNum: 0,
                peopleNum: 0,
                fees: 0,
                idcardsmfees: 0,
                insurance: 0
              },
              meet: {
                teamNum: 0,
                peopleNum: 0,
                fees: 0
              }
            }

            // 赋值
            smObj[name][objType]['teamNum'] = 1
            smObj[name][objType]['peopleNum'] = obj.peopleNum
            smObj[name][objType]['fees'] = obj.fees
            if (objType !== 'meet') {
              smObj[name][objType]['idcardsmfees'] = obj.idcardsmfees
              smObj[name][objType]['insurance'] = obj.insurance
            }
          }
        }

        // get smObj | smDateObj | smSevObj
        sms.forEach((sm) => {
          let objSend
          let objMeet

          // 判断是送机还是接机
          if (sm.flight.flightStartCity === CITY) {
            // 送机
            objSend = {
              teamNum: 1,
              peopleNum: sm.smRealNumber,
              fees: sm.fees + sm.addFees,
              idcardsmfees: sm.idcardsmfees,
              insurance: sm.insurance
            }
            // 判断是散客还是包团
            if (sm.team.teamType === '包团') {
              setSmObj(smObj, sm.company.name, 'bao', objSend)
              setSmObj(smDateObj, sm.flight.flightDate, 'bao', objSend)
              setSmObj(smSevObj, sm.serverMan, 'bao', objSend)
            } else {
              setSmObj(smObj, sm.company.name, 'san', objSend)
              setSmObj(smDateObj, sm.flight.flightDate, 'san', objSend)
              setSmObj(smSevObj, sm.serverMan, 'san', objSend)
            }
          } else {
            // 接机
            objMeet = {
              teamNum: 1,
              peopleNum: sm.smRealNumber,
              fees: sm.fees + sm.addFees
            }
            setSmObj(smObj, sm.company.name, 'meet', objMeet)
            setSmObj(smDateObj, sm.flight.flightDate, 'meet', objMeet)
            setSmObj(smSevObj, sm.serverMan, 'meet', objMeet)
          }
        })

        // smObj => smArr
        for (key in smObj) {
          if (smObj.hasOwnProperty(key)) {
            fees1 = smObj[key]['san'].fees / 100
            idcardsmfees1 = smObj[key]['san'].idcardsmfees
            insurance1 = smObj[key]['san'].insurance
            insuranceFee1 = insurance1 * BAO_XIAN_FEI

            fees2 = smObj[key]['bao'].fees / 100
            idcardsmfees2 = smObj[key]['bao'].idcardsmfees
            insurance2 = smObj[key]['bao'].insurance
            insuranceFee2 = insurance2 * BAO_XIAN_FEI

            fees3 = smObj[key]['meet'].fees / 100

            item = {
              key: key,

              teamNum1: smObj[key]['san'].teamNum,
              peopleNum1: smObj[key]['san'].peopleNum,
              fees1: fees1,
              idcardsmfees1: idcardsmfees1,
              insurance1: insurance1,
              insuranceFee1: insuranceFee1,

              teamNum2: smObj[key]['bao'].teamNum,
              peopleNum2: smObj[key]['bao'].peopleNum,
              fees2: fees2,
              idcardsmfees2: idcardsmfees2,
              insurance2: insurance2,
              insuranceFee2: insuranceFee2,

              teamNum3: smObj[key]['meet'].teamNum,
              peopleNum3: smObj[key]['meet'].peopleNum,
              fees3: fees3,
              sum: fees1 + insuranceFee1 + fees2 + insuranceFee2 + fees3
            }

            smArr.push(item)

            smArrSum.teamNum1 += item.teamNum1
            smArrSum.peopleNum1 += item.peopleNum1
            smArrSum.fees1 += item.fees1
            smArrSum.idcardsmfees1 += item.idcardsmfees1
            smArrSum.insurance1 += item.insurance1
            smArrSum.insuranceFee1 += item.insuranceFee1
            smArrSum.teamNum2 += item.teamNum2
            smArrSum.peopleNum2 += item.peopleNum2
            smArrSum.fees2 += item.fees2
            smArrSum.idcardsmfees2 += item.idcardsmfees2
            smArrSum.insurance2 += item.insurance2
            smArrSum.insuranceFee2 += item.insuranceFee2
            smArrSum.teamNum3 += item.teamNum3
            smArrSum.peopleNum3 += item.peopleNum3
            smArrSum.fees3 += item.fees3
            smArrSum.sum += item.sum
          }
        }

        smArr.sort(function (a, b) {
          return b.sum - a.sum
        })

        // smDateObj => smDateArr
        for (key in smDateObj) {
          if (smDateObj.hasOwnProperty(key)) {
            fees1 = smDateObj[key]['san'].fees / 100
            idcardsmfees1 = smDateObj[key]['san'].idcardsmfees
            insurance1 = smDateObj[key]['san'].insurance
            insuranceFee1 = insurance1 * BAO_XIAN_FEI

            fees2 = smDateObj[key]['bao'].fees / 100
            idcardsmfees2 = smDateObj[key]['bao'].idcardsmfees
            insurance2 = smDateObj[key]['bao'].insurance
            insuranceFee2 = insurance2 * BAO_XIAN_FEI

            fees3 = smDateObj[key]['meet'].fees / 100

            item = {
              key: key,

              teamNum1: smDateObj[key]['san'].teamNum,
              peopleNum1: smDateObj[key]['san'].peopleNum,
              fees1: fees1,
              idcardsmfees1: idcardsmfees1,
              insurance1: insurance1,
              insuranceFee1: insuranceFee1,

              teamNum2: smDateObj[key]['bao'].teamNum,
              peopleNum2: smDateObj[key]['bao'].peopleNum,
              fees2: fees2,
              idcardsmfees2: idcardsmfees2,
              insurance2: insurance2,
              insuranceFee2: insuranceFee2,

              teamNum3: smDateObj[key]['meet'].teamNum,
              peopleNum3: smDateObj[key]['meet'].peopleNum,
              fees3: fees3,
              sum: fees1 + insuranceFee1 + fees2 + insuranceFee2 + fees3
            }

            smDateArr.push(item)
          }
        }

        smDateArr.sort(function (a, b) {
          return moment(a.key).valueOf() - moment(b.key).valueOf()
        })

        // smSevObj => smSevArr
        for (key in smSevObj) {
          if (smSevObj.hasOwnProperty(key)) {
            fees1 = smSevObj[key]['san'].fees / 100
            idcardsmfees1 = smSevObj[key]['san'].idcardsmfees
            insurance1 = smSevObj[key]['san'].insurance
            insuranceFee1 = insurance1 * BAO_XIAN_FEI

            fees2 = smSevObj[key]['bao'].fees / 100
            idcardsmfees2 = smSevObj[key]['bao'].idcardsmfees
            insurance2 = smSevObj[key]['bao'].insurance
            insuranceFee2 = insurance2 * BAO_XIAN_FEI

            fees3 = smSevObj[key]['meet'].fees / 100

            item = {
              key: key,

              teamNum1: smSevObj[key]['san'].teamNum,
              peopleNum1: smSevObj[key]['san'].peopleNum,
              fees1: fees1,
              idcardsmfees1: idcardsmfees1,
              insurance1: insurance1,
              insuranceFee1: insuranceFee1,

              teamNum2: smSevObj[key]['bao'].teamNum,
              peopleNum2: smSevObj[key]['bao'].peopleNum,
              fees2: fees2,
              idcardsmfees2: idcardsmfees2,
              insurance2: insurance2,
              insuranceFee2: insuranceFee2,

              teamNum3: smSevObj[key]['meet'].teamNum,
              peopleNum3: smSevObj[key]['meet'].peopleNum,
              fees3: fees3,
              sum: fees1 + insuranceFee1 + fees2 + insuranceFee2 + fees3
            }

            smSevArr.push(item)
          }
        }

        smSevArr.sort(function (a, b) {
          return b.sum - a.sum
        })

        this.smArr = smArr
        this.smArrSum = smArrSum
        this.smDateArr = smDateArr
        this.smSevArr = smSevArr

        companyChart = echarts.init(document.getElementById('companyChart'))
        len = smArr.length
        for (i = 0; i < len; i += 1) {
          item = smArr[i]

          smArrKey.push(item.key)
          smArrTotal.push(item.sum)
          smArrTeam.push(item.teamNum1 + item.teamNum2 + item.teamNum3)
          smArrPeople.push(item.peopleNum1 + item.peopleNum2 + item.peopleNum3)
          smArrInsurance.push(item.insurance1 + item.insurance2)
          smArrIdcardsmfees.push(item.idcardsmfees1 + item.idcardsmfees2)
        }
        // 绘制图表
        companyChart.setOption({
          title: { text: '公司' },
          tooltip: {},
          legend: {
            data: ['贡献', '团数', '人数', '保险', '验证'],
            selected: {
              '贡献': true,
              '团数': false,
              '人数': false,
              '保险': false,
              '验证': false
            },
            selectedMode: 'single'
          },
          xAxis: {
            data: smArrKey
          },
          yAxis: {},
          series: [{
            name: '贡献',
            type: 'bar',
            data: smArrTotal
          }, {
            name: '团数',
            type: 'bar',
            data: smArrTeam
          }, {
            name: '人数',
            type: 'bar',
            data: smArrPeople
          }, {
            name: '保险',
            type: 'bar',
            data: smArrInsurance
          }, {
            name: '验证',
            type: 'bar',
            data: smArrIdcardsmfees
          }]
        })

        dateChart = echarts.init(document.getElementById('dateChart'))
        len = smDateArr.length
        for (i = 0; i < len; i += 1) {
          item = smDateArr[i]

          smDateArrKey.push(moment(item.key).format('D'))
          smDateArrTotal.push(item.sum)
          smDateArrTeam.push(item.teamNum1 + item.teamNum2 + item.teamNum3)
          smDateArrPeople.push(item.peopleNum1 + item.peopleNum2 + item.peopleNum3)
          smDateArrInsurance.push(item.insurance1 + item.insurance2)
          smDateArrIdcardsmfees.push(item.idcardsmfees1 + item.idcardsmfees2)
        }
        // 绘制图表
        dateChart.setOption({
          title: { text: '日期' },
          tooltip: {},
          legend: {
            data: ['贡献', '团数', '人数', '保险', '验证'],
            selected: {
              '贡献': true,
              '团数': false,
              '人数': false,
              '保险': false,
              '验证': false
            },
            selectedMode: 'single'
          },
          xAxis: {
            data: smDateArrKey
          },
          yAxis: {},
          series: [{
            name: '贡献',
            type: 'line',
            data: smDateArrTotal
          }, {
            name: '团数',
            type: 'line',
            data: smDateArrTeam
          }, {
            name: '人数',
            type: 'line',
            data: smDateArrPeople
          }, {
            name: '保险',
            type: 'line',
            data: smDateArrInsurance
          }, {
            name: '验证',
            type: 'line',
            data: smDateArrIdcardsmfees
          }]
        })

        sevChart = echarts.init(document.getElementById('sevChart'))
        len = smSevArr.length
        for (i = 0; i < len; i += 1) {
          item = smSevArr[i]

          smSevArrKey.push(item.key)
          smSevArrTotal.push(item.sum)
          smSevArrTeam.push(item.teamNum1 + item.teamNum2 + item.teamNum3)
          smSevArrPeople.push(item.peopleNum1 + item.peopleNum2 + item.peopleNum3)
          smSevArrInsurance.push(item.insurance1 + item.insurance2)
          // smSevArrIdcardsmfees.push(item.idcardsmfees1 + item.idcardsmfees2)
        }
        // 绘制图表
        sevChart.setOption({
          title: { text: '现场' },
          tooltip: {},
          legend: {
            data: ['贡献', '团数', '人数', '保险'],
            selected: {
              '贡献': true,
              '团数': false,
              '人数': false,
              '保险': false
            },
            selectedMode: 'single'
          },
          xAxis: {
            data: smSevArrKey
          },
          yAxis: {},
          series: [{
            name: '贡献',
            type: 'bar',
            data: smSevArrTotal
          }, {
            name: '团数',
            type: 'bar',
            data: smSevArrTeam
          }, {
            name: '人数',
            type: 'bar',
            data: smSevArrPeople
          }, {
            name: '保险',
            type: 'bar',
            data: smSevArrInsurance
          }]
        })
      })
    }
  },
  data () {
    return {
      months: [],
      smArr: [],
      smArrSum: {},
      smDateArr: [],
      smSevArr: []
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
        name: 'billstotal',
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
