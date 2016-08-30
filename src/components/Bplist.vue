<template>
  <div id="bplist" class="container-fuilt">
    <div class="row">
      <div class="col-sm-2 col-md-2">
        <h3>往来账</h3>
      </div>
      <div class="col-sm-4 col-md-4">
        <typeahead v-ref:typeahead placeholder="公司名称" :data="companyNames"></typeahead>
      </div>
      <div class="col-sm-3 col-md-3">
        <v-select placeholder="请选择月份" :value.sync="months">
          <v-option value="请选择月份">--不选--</v-option>
          <v-option v-for="item of monthoptions" :value="item">{{item}}</v-option>
        </v-select>
        <button class="btn btn-default" @click="searchBps">查询</button>
      </div>
      <div class="col-sm-3 col-md-3 text-right">
        <button class="btn btn-primary" @click="showModalAs(true)">
          添加借贷项目&nbsp;
          <span class="glyphicon glyphicon-plus"></span>
        </button>
      </div>
      <table class="table table-striped table-hover table-responsive">
        <thead>
          <tr>
            <th>序号</th>
            <th>公司</th>
            <th>项目</th>
            <th>金额</th>
            <th>备注</th>
            <th>日期</th>
            <th>创建日期</th>
            <th>最后更新</th>
            <th>修改</th>
            <th>删除</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of items">
            <td>{{$index + 1}}</td>
            <td>{{item.company | getCompanyName companyIdObj}}</td>
            <td>
              <span v-bind:class="['label', item.bpType === 1 ? 'label-success' : 'label-danger']"
                  style="margin-right: 5px;">{{item.bpType === 1 ? '借' : '贷'}}
              </span>
            </td>
            <td>{{item.bpNum / 100}}</td>
            <td>{{item.bpNote}}</td>
            <td>{{item.bpDate | formatYYYYMMDD}}</td>
            <td>{{item.meta.createAt | formatYYYYMMDD}}</td>
            <td>{{item.meta.updateAt | formatYYYYMMDD}}</td>
            <td><button class="btn btn-xs btn-primary">修改</button></td>
            <td><button class="btn btn-xs btn-danger">删除</button></td>
          </tr>
        </tbody>
      </table>
      <nav v-if="totalPage > 1" aria-label="Page navigation">
        <ul class="pagination pagination-sm">
          <template v-if="startPage > 1">
            <li><a v-link="{ name: 'bplist', params: { bpmonth: this.bpmonth, bpcompany: this.bpcompany, n: 0 }}">1</a></li>
            <li><span style="border: 0; background-color: transparent; padding: 5px;">...</span></li>
            <li><a v-link="{ name: 'bplist', params: { bpmonth: this.bpmonth, bpcompany: this.bpcompany, n: (startPage - 2) }}">{{startPage - 1}}</a></li>
          </template>
          <li v-for="item in pages" v-bind:class="item === n + 1 ? 'active' : ''">
            <a v-link="{ name: 'bplist', params: { bpmonth: this.bpmonth, bpcompany: this.bpcompany, n: (item - 1) }}">{{item}}</a>
          </li>
          <template v-if="endPage < totalPage">
            <li><span style="border: 0; background-color: transparent; padding: 5px;">...</span></li>
            <li><a v-link="{ name: 'bplist', params: { bpmonth: this.bpmonth, bpcompany: this.bpcompany, n: (totalPage - 1) }}">{{totalPage}}</a></li>
          </template>
        </ul>
      </nav>
    </div>

    <modal backdrop="false"
    effect="zoom"
    :show.sync="showUpdateModal">
      <div slot="modal-header" class="modal-header" style="padding: 8px 15px;">
        <h4>{{updateModelTitle}}</h4>
      </div>
      <div slot="modal-body" class="modal-body" style="padding-bottom: 0;">
        <validator name="updateValidation">
          <form class="form-horizontal" novalidate @submit.prevent="onSubmit">

            <div class="form-group">
              <label class="col-sm-3 control-label">* 项目</label>
              <div class="col-sm-9">
                <v-select :value.sync="item.bpTypes">
                  <v-option value="借">借</v-option>
                  <v-option value="贷">贷</v-option>
                </v-select>
              </div>
            </div>
            <div class="form-group" :class="[$updateValidation.bpnum.valid ? 'has-success' : 'has-error']">
              <label class="col-sm-3 control-label" style="padding-top: 8px;">* 金额</label>
              <div class="col-sm-4">
                <input
                v-model="item.bpNum"
                v-validate:bpnum="{
                  required: { rule: true, message: '金额必填!' }
                }"
                class="form-control"
                placeholder="保留两位小数">
              </div>
            </div>
            <div class="form-group" :class="[$updateValidation.bpnote.valid ? 'has-success' : 'has-error']">
              <label class="col-sm-3 control-label" style="padding-top: 8px;">* 备注</label>
              <div class="col-sm-9">
                <input
                v-model="item.bpNote"
                v-validate:bpnote="{
                  required: { rule: true, message: '备注必填!' }
                }"
                class="form-control">
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 errors">
                <validator-errors partial="errorTemplate" :validation="$updateValidation"></validator-errors>
              </div>
            </div>

            <div class="row">
              <div v-if="showUpdateModalFooter" class="modal-footer">
                <button
                    type="submit"
                    :disabled="!$updateValidation.valid"
                    class="btn btn-success">提交</button>
                <button type="button" class="btn btn-default" @click="showUpdateModal = false">取消</button>
              </div>
            </div>
          </form>
        </validator>
      </div>
      <div slot="modal-footer" style="display: none;"></div>
    </modal>

    <modal backdrop="false"
      effect="zoom"
      :show.sync="showDelModal" small>
      <div slot="modal-header" class="modal-header" style="padding: 8px 15px;">
        <h4>删除借贷</h4>
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
import moment from 'moment'
import vueStrap from 'vue-strap'
import { emitToServer } from '../util/auth'

export default {
  components: {
    typeahead: vueStrap.typeahead,
    vSelect: vueStrap.select,
    vOption: vueStrap.option,
    modal: vueStrap.modal
  },
  route: {
    data () {
      console.log(this.$route.params)
      this.bpmonth = this.$route.params.bpmonth
      this.bpcompany = this.$route.params.bpcompany
      this.n = Number(this.$route.params.n)

      this.totalPage = 1
      this.startPage = 1
      this.endPage = 0

      // 设置月份选择框
      if (this.bpmonth === 'all') {
        this.months = []
      } else {
        this.months = [ this.bpmonth ]
      }

      emitToServer('getbplist', this.$route.params, (result) => {
        console.log(result)
        const PAGE_SPLIT = 8
        let companys = result.companys
        let companyNames = []
        let companyIdObj = {}
        let companyNameObj = {}
        let pages = []
        let totalPage
        let endPage
        let i

        companys.forEach(function (item) {
          companyNames.push(item.name)
          companyIdObj[item._id] = item.name
          companyNameObj[item.name] = item._id
        })

        // 设置公司搜索框 value
        if (this.bpcompany !== 'all' && companyIdObj[this.bpcompany]) {
          this.$refs.typeahead.$data.query = companyIdObj[this.bpcompany]
        } else {
          this.$refs.typeahead.$data.query = ''
        }
        // 设置公司搜索框下拉选项单
        this.companyNames = companyNames

        this.companyIdObj = companyIdObj
        this.companyNameObj = companyNameObj

        // table
        this.items = result.bps

        // 分页
        totalPage = result.totalPage
        if (totalPage > 1) {
          this.totalPage = totalPage
          this.startPage = Math.floor(this.n / PAGE_SPLIT) * PAGE_SPLIT + 1
          endPage = this.startPage + PAGE_SPLIT
          this.endPage = endPage < totalPage ? endPage : totalPage

          for (i = this.startPage; i <= this.endPage; i += 1) {
            pages.push(i)
          }

          this.pages = pages
        }
      })
    }
  },
  data () {
    return {
      bpmonth: 'all',
      bpcompany: 'all',
      n: 0,
      companyNames: [],
      companyIdObj: {},
      companyNameObj: {},
      months: [],
      companyName: '',
      items: [],
      totalPage: 1,
      startPage: 1,
      endPage: 0,
      pages: [],
      showUpdateModal: false,
      showUpdateModalFooter: true,
      isAdd: true,
      updateModelTitle: '',
      activeItem: null,
      item: {
        bpTypes: ['借'],
        bpNum: '',
        bpNote: ''
      },
      showDelModal: false,
      showDelModalFooter: true
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
  methods: {
    searchBps () {
      let bpmonth = 'all'
      let bpcompany = 'all'

      let query = this.$refs.typeahead.$data.query
      let months0 = this.months[0]

      if (query) {
        if (this.companyNameObj[query]) {
          bpcompany = this.companyNameObj[query]
        } else {
          window.alert('公司不存在')
          return
        }
      }

      if (months0 && months0 !== '请选择月份') {
        bpmonth = months0
      }

      if (this.bpmonth === bpmonth && this.bpcompany === bpcompany) {
        return
      }

      this.$router.go({
        name: 'bplist',
        params: {
          bpmonth: bpmonth,
          bpcompany: bpcompany,
          n: 0
        }
      })
    },
    showModalAs (isAdd, item) {
      if (isAdd) {
        this.isAdd = true
        this.updateModelTitle = '添加借贷项目'
        this.activeItem = null
        this.name = ''
      }

      this.showUpdateModal = true
    },
    onSubmit () {
      console.log('sub')
    },
    onDelSubmit () {
      console.log('del')
    }
  }
}
</script>

<style scoped>
.errors {
  border-left: 5px solid #a94442;
  padding-left: 18px;
  color: #a94442;
}
</style>
