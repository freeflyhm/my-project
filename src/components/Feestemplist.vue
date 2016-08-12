<template>
  <div id="feestemplist" class="container">
    <div class="row">
      <div class="col-sm-6 col-md-6">
        <h3>服务费模板列表</h3>
      </div>
      <div class="col-sm-6 col-md-6 text-right">
        <button class="btn btn-primary" @click="showModalAs(true)">服务费基础模板</button>
      </div>
      <table class="table table-striped table-hover table-responsive">
        <thead>
          <tr>
            <th>序号</th>
            <th>模板名称</th>
            <th>创建日期</th>
            <th>最后更新</th>
            <th>调整服务费</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of items">
            <td>{{ $index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.meta.createAt | formatYYYYMMDD }}</td>
            <td>{{ item.meta.updateAt | formatYYYYMMDD }}</td>
            <td><button class="btn btn-xs btn-primary" @click="showModalAs(false, item)">调整服务费</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <modal id="feestempModal"
    backdrop="false"
    effect="zoom"
    :show.sync="showUpdateModal" large>
      <div slot="modal-header" class="modal-header">
        <h4>{{updateModelTitle}}</h4>
      </div>
      <div slot="modal-body" class="modal-body" @keyup.13="onSubmit">
        <div class="row">
          <table v-if="activeItem" id="feestemp-table" class="table table-striped table-bordered table-condensed">
            <thead v-if="isBasic">
              <tr>
                <th id="sev" rowspan="2">服务分类</th>
                <th colspan="2">基本费用</th>
                <th colspan="3">加班费</th>
                <th colspan="2">人数补贴</th>
              </tr>
              <tr>
                <th>元／人</th>
                <th>不超过(元)</th>
                <th id="begin">开始时间</th>
                <th id="end">截止时间</th>
                <th>费用(元)</th>
                <th>人数下限(人)</th>
                <th>元／人</th>
              </tr>
            </thead>
            <thead v-else>
              <tr>
                <th id="sev" rowspan="2">服务分类</th>
                <th colspan="4">基本费用</th>
                <th colspan="4">加班费</th>
                <th colspan="4">人数补贴</th>
              </tr>
              <tr>
                <th style="width: 60px;">元／人</th>
                <th>+-</th>
                <th style="width: 80px;">不超过(元)</th>
                <th>+-</th>
                <th style="width: 70px;">开始时间</th>
                <th style="width: 70px;">截止时间</th>
                <th style="width: 70px;">费用(元)</th>
                <th>+-</th>
                <th style="width: 100px;">人数下限(人)</th>
                <th>+-</th>
                <th style="width: 60px;">元／人</th>
                <th>+-</th>
              </tr>
            </thead>
            <tbody v-if="isBasic">
              <tr v-for="name of names">
                <td>{{name}}</td>
                <td class="edit">
                  <input v-model="activeItemClone['t' + ($index + 1)].basStepPrice | currencyYuan">
                </td>
                <td class="edit">
                  <input v-model="activeItemClone['t' + ($index + 1)].basMaxPrice | currencyYuan">
                </td>
                <td class="edit">
                  <input class="time" v-model="activeItemClone['t' + ($index + 1)].addStartTime" @click="showTime($event, 'activeItemClone.t' + ($index + 1) + '.addStartTime')">
                </td>
                <td class="edit">
                  <input class="time" v-model="activeItemClone['t' + ($index + 1)].addEndTime" @click="showTime($event, 'activeItemClone.t' + ($index + 1) + '.addEndTime')">
                </td>
                <td class="edit">
                  <input v-model="activeItemClone['t' + ($index + 1)].addPrice | currencyYuan">
                </td>
                <td class="edit">
                  <input v-model="activeItemClone['t' + ($index + 1)].putPersonNum">
                </td>
                <td class="edit">
                  <input v-model="activeItemClone['t' + ($index + 1)].putPrice | currencyYuan">
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="name of names">
                <td>{{ name }}</td>
                <td>{{ basicFeestemp['t' + ($index + 1)].basStepPrice | currencyYuan }}</td>
                <td class="edit">
                  <input v-model="activeItemClone['t' + ($index + 1)].basStepPrice | currencyYuan">
                </td>
                <td>{{ basicFeestemp['t' + ($index + 1)].basMaxPrice | currencyYuan }}</td>
                <td class="edit">
                  <input v-model="activeItemClone['t' + ($index + 1)].basMaxPrice | currencyYuan">
                </td>
                <td>{{ activeItemClone['t' + ($index + 1)].addStartTime }}</td>
                <td>{{ activeItemClone['t' + ($index + 1)].addEndTime }}</td>
                <td>{{ basicFeestemp['t' + ($index + 1)].addPrice | currencyYuan }}</td>
                <td class="edit">
                  <input v-model="activeItemClone['t' + ($index + 1)].addPrice | currencyYuan">
                </td>
                <td>{{ basicFeestemp['t' + ($index + 1)].putPersonNum }}</td>
                <td class="edit">
                  <input v-model="activeItemClone['t' + ($index + 1)].putPersonNum">
                </td>
                <td>{{ basicFeestemp['t' + ($index + 1)].putPrice | currencyYuan }}</td>
                <td class="edit">
                  <input v-model="activeItemClone['t' + ($index + 1)].putPrice | currencyYuan">
                </td>
              </tr>
            </tbody>
          </table>

          <zx-timepicker v-ref:timepicker
          v-on:change-time="changeTime"></zx-timepicker>
          <div v-if="showUpdateModalFooter" class="modal-footer">
            <div v-if="!isBasic" class="input-group" style="max-width: 200px; float: left;">
              <input class="form-control" v-model="newTempName" placeholder="新模板名称">
              <span class="input-group-btn">
                <button class="btn btn-primary" @click="onAdd">复制新增</button>
              </span>
            </div>
            <button class="btn btn-success" @click="onSubmit">提交</button>
            <button class="btn btn-default" @click="onCancel">取消</button>
          </div>
        </div>
      </div>
      <div slot="modal-footer" style="display: none;"></div>
    </modal>
  </div>
</template>

<script>
import vueStrap from 'vue-strap'
import { emitToServer, cloneObj } from '../util/auth'
import zxTimepicker from './ZxTimepicker'

export default {
  components: {
    modal: vueStrap.modal,
    zxTimepicker
  },
  route: {
    data () {
      emitToServer('feestemplist', null, (results) => {
        this.results = results
      })
    }
  },
  data () {
    return {
      names: [
        '机场内送机 散拼', '机场内送机 包团',
        '机场内接机 散拼', '机场内接机 包团',
        '机场外送机 散拼', '机场外送机 包团',
        '机场外接机 散拼', '机场外接机 包团'
      ],
      results: [],
      basicFeestemp: null,
      showUpdateModal: false,
      showUpdateModalFooter: true,
      isBasic: true,
      updateModelTitle: '',
      activeItem: null,
      activeItemClone: null,
      newTempName: ''
    }
  },
  computed: {
    items () {
      return this.results.filter((item) => {
        var ret

        if (item.name === '基础') {
          this.basicFeestemp = item
          ret = false
        } else {
          ret = true
        }
        return ret
      })
    }
  },
  methods: {
    showModalAs (isBasic, item) {
      if (isBasic) {
        this.isBasic = true
        this.updateModelTitle = '修改 - 基础模板'
        this.activeItem = this.basicFeestemp
        this.activeItemClone = cloneObj(this.activeItem)
      } else {
        this.isBasic = false
        this.updateModelTitle = '调整 - ' + item.name + '模板'
        this.activeItem = item
        this.activeItemClone = cloneObj(this.activeItem)
      }
      this.showUpdateModal = true
    },
    showTime (event, fromTime) {
      let td = event.target.parentNode
      let offsetTop = td.offsetTop
      let offsetHeight = td.offsetHeight
      let offsetLeft = td.offsetLeft

      let top = offsetTop + offsetHeight
      let left = offsetLeft

      this.$refs.timepicker.show(fromTime, top, left)
    },
    changeTime (fromTime, computeTime) {
      this.$set(fromTime, computeTime)
    },
    onSubmit () {
      this.showUpdateModalFooter = false
      this.newTempName = ''
      emitToServer('feestempupdate', this.activeItemClone, (results) => {
        this.showUpdateModalFooter = true
        if (results.success === 1) {
          this.showUpdateModal = false
          let index = this.results.indexOf(this.activeItem)
          this.results.$set(index, results.res)
          this.activeItem = null
          this.activeItemClone = null
        } else {
          window.alert(results.errMsg)
        }
      })
    },
    onAdd () {
      if (this.newTempName) {
        this.showUpdateModalFooter = false
        var newItem = cloneObj(this.activeItemClone)
        newItem.name = this.newTempName
        delete newItem._id
        delete newItem.meta

        emitToServer('feestempadd', newItem, (results) => {
          this.showUpdateModalFooter = true
          if (results.success === 1) {
            this.showUpdateModal = false
            this.results.push(results.res)
            this.activeItem = null
            this.activeItemClone = null
            this.newTempName = ''
          } else {
            window.alert(results.errMsg)
          }
        })
      }
    },
    onCancel () {
      this.showUpdateModal = false
      this.newTempName = ''
    }
  }
}
</script>

<style scoped>
#feestempModal .modal-header {
  padding: 8px 15px;
}

#feestempModal .modal-body {
  padding-top: 0; padding-bottom: 0;
}

#feestemp-table {
  margin-bottom: 0;
}

#sev {
  width: 120px;
}

#begin, #end {
  width: 100px;
}

#feestemp-table td.edit {
  height: 25px;
  padding: 0;
}

#feestemp-table td.edit > input {
  background: #fcf8e3;
  width: 100%;
  min-height: 100%;
  height: 100%;
  border: none;
  padding: 0 6px;
}
</style>
