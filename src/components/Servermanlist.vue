<template>
  <div id="setplacelist" class="container">
    <div class="row">
      <div class="col-sm-6 col-md-6">
        <h3>现场责任人列表</h3>
      </div>
      <div class="col-sm-6 col-md-6 text-right">
        <button class="btn btn-primary" @click="showModalAs(true)">添加现场责任人</button>
      </div>
      <table class="table table-striped table-hover table-responsive">
        <thead>
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>创建日期</th>
            <th>最后更新</th>
            <th>修改</th>
            <th>删除</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of items">
            <td>{{$index + 1}}</td>
            <td>{{item.name}}</td>
            <td>{{item.meta.createAt | formatYYYYMMDD}}</td>
            <td>{{item.meta.updateAt | formatYYYYMMDD}}</td>
            <td><button class="btn btn-xs btn-primary" @click="showModalAs(false, item)">修改</button></td>
            <td><button class="btn btn-xs btn-danger" @click="removeItem(item)">删除</button></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <modal backdrop="false"
    effect="zoom"
    :show.sync="showUpdateModal" small>
      <div slot="modal-header" class="modal-header" style="padding: 8px 15px;">
        <h4>{{updateModelTitle}}</h4>
      </div>
      <div slot="modal-body" class="modal-body" style="padding-bottom: 0;" @keyup.13="onSubmit">
        <validator name="updateValidation">
          <div class="row">
            <div class="form-group" :class="[$updateValidation.name.valid ? 'has-success' : 'has-error']">
              <label for="name" class="col-sm-3 control-label" style="padding-top: 8px;">* 姓名</label>
              <div class="col-sm-9">
                <input
                v-model="name"
                v-validate:name="{
                  minlength: {rule: 2, message: '姓名 - 太短！' },
                  chinese: {rule: true, message: '姓名 - 必须为中文！' },
                  maxlength: {rule: 4, message: '姓名 - 太长！' }
                }"
                class="form-control"
                placeholder="2 ~ 4 个中文字符">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-group errors">
              <validator-errors partial="errorTemplate" :validation="$updateValidation"></validator-errors>
            </div>
            <div v-if="showUpdateModalFooter" class="modal-footer">
              <button :disabled="!$updateValidation.valid" class="btn btn-success" @click="onSubmit">提交</button>
              <button class="btn btn-default" @click="showUpdateModal = false">取消</button>
            </div>
          </div>
        </validator>
      </div>
      <div slot="modal-footer" style="display: none;"></div>
    </modal>

    <modal backdrop="false"
      effect="zoom"
      :show.sync="showDelModal" small>
      <div slot="modal-header" class="modal-header" style="padding: 8px 15px;">
        <h4>删除现场责任人</h4>
      </div>
      <div slot="modal-body" class="modal-body" style="padding-bottom: 0;">
        <div class="alert alert-danger">
          <p>确定要删除 {{name}} 吗 ?</p>
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
import { emitToServer } from '../util/auth'

export default {
  components: {
    modal: vueStrap.modal
  },
  route: {
    data () {
      emitToServer('servermanlist', null, (results) => {
        this.items = results
      })
    }
  },
  data () {
    return {
      items: [],
      showUpdateModal: false,
      showUpdateModalFooter: true,
      isAdd: true,
      updateModelTitle: '',
      activeItem: null,
      name: '',
      showDelModal: false,
      showDelModalFooter: true
    }
  },
  methods: {
    showModalAs (isAdd, item) {
      if (isAdd) {
        this.isAdd = true
        this.updateModelTitle = '添加现场责任人'
        this.activeItem = null
        this.name = ''
      } else {
        this.isAdd = false
        this.updateModelTitle = '修改现场责任人'
        this.activeItem = item
        this.name = item.name
      }
      this.showUpdateModal = true
    },
    onSubmit () {
      if (this.$updateValidation.valid) {
        this.showUpdateModalFooter = false
        if (this.isAdd) {
          emitToServer('servermanadd', { name: this.name }, (results) => {
            this.showUpdateModalFooter = true
            if (results.success === 1) {
              this.showUpdateModal = false
              this.items.push(results.res)
            } else {
              this.$setValidationErrors([
                { field: results.field, message: results.errMsg }
              ])
            }
          })
        } else {
          if (this.activeItem.name !== this.name) {
            emitToServer('servermanupdate', {id: this.activeItem._id, name: this.name}, (results) => {
              this.showUpdateModalFooter = true
              if (results.success === 1) {
                this.showUpdateModal = false
                this.activeItem.name = results.res.name
                this.activeItem.meta.updateAt = results.res.meta.updateAt
              } else {
                this.$setValidationErrors([
                  { field: results.field, message: results.errMsg }
                ])
              }
            })
          } else {
            this.showUpdateModalFooter = true
            this.showUpdateModal = false
          }
        }
      }
    },
    removeItem (item) {
      this.activeItem = item
      this.name = item.name
      this.showDelModal = true
    },
    onDelSubmit () {
      this.showUpdateModalFooter = false
      emitToServer('servermanremove', { id: this.activeItem._id }, (results) => {
        this.showUpdateModalFooter = true
        if (results.success === 1) {
          this.showDelModal = false
          this.items.$remove(this.activeItem)
        } else {
          window.alert(results.errMsg)
        }
      })
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
