<template>
  <div id="login" class="container">
    <div class="row">
      <div class="col-md-4 col-md-offset-4">
        <div class="row">
          <div class="col-md-6 col-sm-6 col-xs-6">
            <h3>登录</h3>
          </div>
          <div class="signup col-md-6 col-sm-6 col-xs-6">
            <a tabindex="-1" @click="showSignupModal = true">注册</a>
          </div>
        </div>

        <validator name="loginValidation">
          <form class="form-horizontal" novalidate @submit.prevent="onLogin">
            <div class="form-group" :class="[$loginValidation.lusername.valid ? 'has-success' : 'has-error']">
              <div class="col-md-12">
                <input
                  v-model="lusername"
                  v-validate:lusername="{
                    minlength: {rule: 2, message: '用户名 - 太短！' },
                    letterNum: {rule: true, message: '用户名 - 必须为字母或数字！' },
                    maxlength: {rule: 15, message: '用户名 - 太长！' }
                  }"
                  class="form-control"
                  placeholder="用户名">
              </div>
            </div>

            <div class="form-group" :class="[$loginValidation.lpassword.valid ? 'has-success' : 'has-error']">
              <div class="col-md-12">
                <input
                  type="password"
                  v-model="lpassword"
                  v-validate:lpassword="{
                    minlength: {rule: 6, message: '密码 - 太短！'},
                    maxlength: {rule: 20, message: '密码 - 太长！' }
                  }"
                  class="form-control"
                  placeholder="密码">
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 errors">
                <validator-errors partial="errorTemplate" :validation="$loginValidation"></validator-errors>
              </div>
            </div>

            <div v-if="showLoginBtn">
              <button
                  type="submit"
                  :disabled="!$loginValidation.valid"
                  class="btn btn-primary btn-block">登录</button>
            </div>
          </form>
        </validator>
      </div>
    </div>

    <modal backdrop="false"
      effect="zoom"
      :show.sync="showSignupModal" large>
      <div slot="modal-header" class="modal-header" style="padding: 8px 15px;">
        <h4>请注册<small> （ 带 * 号项为必填项 ）</small></h4>
      </div>
      <div slot="modal-body" class="modal-body" style="padding-bottom: 0;">
        <validator name="signupValidation">
          <form class="form-horizontal" novalidate @submit.prevent="onSignup">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="col-md-4 control-label">* 省份</label>
                  <div class="col-md-8">
                    <v-select placeholder="请选择省份" :value.sync="provinces">
                      <v-option v-for="item of provinceoptions" :value="item">{{item}}</v-option>
                    </v-select>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label class="col-md-4 control-label">* 城市</label>
                  <div class="col-md-8">
                    <v-select placeholder="请选择城市" :value.sync="cities">
                      <v-option v-for="item of cityoptions" :value="item">{{item}}</v-option>
                    </v-select>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group" :class="[$signupValidation.cname.valid ? 'has-success' : 'has-error']">
              <label class="col-md-2 control-label">* 公司</label>
              <div class="col-md-10">
                <input
                  v-model="cname"
                  v-validate:cname="{
                    minlength: {rule: 2, message: '公司 - 太短！' },
                    maxlength: {rule: 15, message: '公司 - 太长！' }
                  }"
                  class="form-control"
                  placeholder="2 ~ 15 个字符">
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group" :class="[$signupValidation.uusername.valid ? 'has-success' : 'has-error']">
                  <label class="col-md-4 control-label">* 用户名</label>
                  <div class="col-md-8">
                    <input
                      v-model="uusername"
                      v-validate:uusername="{
                        minlength: {rule: 2, message: '用户名 - 太短！' },
                        letterNum: {rule: true, message: '用户名 - 必须为字母或数字！' },
                        maxlength: {rule: 15, message: '用户名 - 太长！' }
                      }"
                      class="form-control"
                      placeholder="2 ~ 15 个字母或数字">
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group" :class="[$signupValidation.uname.valid ? 'has-success' : 'has-error']">
                  <label class="col-md-4 control-label">* 姓名</label>
                  <div class="col-md-8">
                    <input
                      v-model="uname"
                      v-validate:uname="{
                        minlength: {rule: 2, message: '姓名 - 太短！' },
                        chinese: {rule: true, message: '姓名 - 必须为中文！' },
                        maxlength: {rule: 4, message: '姓名 - 太长！' }
                      }"
                      class="form-control"
                      placeholder="2 ~ 4 个中文">
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group" :class="[$signupValidation.upassword.valid ? 'has-success' : 'has-error']">
                  <label class="col-md-4 control-label">* 密码</label>
                  <div class="col-md-8">
                    <input
                      type="password"
                      v-model="upassword"
                      v-validate:upassword="{
                        minlength: {rule: 6, message: '密码 - 太短！'},
                        match: {rule: matchUserName, message: '密码 - 不能等于用户名！'},
                        maxlength: {rule: 20, message: '密码 - 太长！' }
                      }"
                      class="form-control"
                      placeholder="长度 6 ~ 20 位">
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group" :class="[$signupValidation.urepassword.valid ? 'has-success' : 'has-error']">
                  <label class="col-md-4 control-label">* 确认密码</label>
                  <div class="col-md-8">
                    <input
                      type="password"
                      v-model="urepassword"
                      v-validate:urepassword="{
                        match: {rule: matchPassword, message: '确认密码 - 必须与密码一致！'}
                      }"
                      class="form-control"
                      placeholder="同密码">
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group" :class="[$signupValidation.uphone.valid ? 'has-success' : 'has-error']">
                  <label class="col-md-4 control-label">* 手机</label>
                  <div class="col-md-8">
                    <input
                      v-model="uphone"
                      v-validate:uphone="{
                        phone: {rule: true, message: '手机 - 11 位有效号码！'}
                      }"
                      class="form-control"
                      placeholder="11 位有效号码">
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group" :class="[$signupValidation.ucompanyabbr.valid ? 'has-success' : 'has-error']">
                  <label class="col-md-4 control-label">* 公司简称</label>
                  <div class="col-md-8">
                    <input
                      v-model="ucompanyabbr"
                      v-validate:ucompanyabbr="{
                        minlength: {rule: 2, message: '公司简称 - 太短！' },
                        maxlength: {rule: 8, message: '公司简称 - 太长！' }
                      }"
                      class="form-control"
                      placeholder="2 ~ 8 个字符">
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group" :class="[$signupValidation.ctel.valid ? 'has-success' : 'has-error']">
                  <label class="col-md-4 control-label">联系</label>
                  <div class="col-md-8">
                    <div class="input-group">
                      <div class="input-group-addon">电话</div>
                      <input
                        v-model="ctel"
                        v-validate:ctel="{
                          tel: {rule: true, message: '电话 - 格式不对！'}
                        }"
                        class="form-control"
                        placeholder="0000-00000000-000">
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-3">
                <div class="form-group" :class="[$signupValidation.cfax.valid ? 'has-success' : 'has-error']">
                  <div class="col-md-12">
                    <div class="input-group">
                      <div class="input-group-addon">传真</div>
                      <input
                        v-model="cfax"
                        v-validate:cfax="{
                          fax: {rule: true, message: '传真 - 格式不对！'}
                        }"
                        class="form-control"
                        placeholder="0000-00000000">
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-3">
                <div class="form-group" :class="[$signupValidation.uqq.valid ? 'has-success' : 'has-error']">
                  <div class="col-md-12">
                    <div class="input-group">
                      <div class="input-group-addon">QQ</div>
                      <input
                        v-model="uqq"
                        v-validate:uqq="{
                          qq: {rule: true, message: 'QQ - 格式不对！'}
                        }"
                        class="form-control"
                        placeholder="纯数字">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group" :class="[$signupValidation.caddress.valid ? 'has-success' : 'has-error']">
              <label class="col-md-2 control-label">地址</label>
              <div class="col-md-10">
                <input
                  v-model="caddress"
                  v-validate:caddress="{
                    maxlength: {rule: 50, message: '地址 - 太长！' }
                  }"
                  class="form-control"
                  placeholder="请填写详细地址">
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 errors">
                <validator-errors partial="errorTemplate" :validation="$signupValidation"></validator-errors>
              </div>
            </div>

            <div class="row">
              <div v-if="showSignupModalFooter" class="modal-footer">
                <button type="submit"
                    :disabled="!$signupValidation.valid"
                    class="btn btn-success">注册</button>
                <button type="button" class="btn btn-default" @click="showSignupModal = false">取消</button>
              </div>
            </div>

          </form>
        </validator>
      </div>
      <div slot="modal-footer" style="display: none;"></div>
    </modal>
  </div>
</template>

<script>
// import store from '../vuex/store'
import { login, signup } from '../util/auth'
import vueStrap from 'vue-strap'
import Errmsg from '../util/errmsg'

export default {
  // store,
  vuex: {
    getters: {
      provincecityobj: state => state.provincecityobj
    }
  },
  components: {
    vSelect: vueStrap.select,
    vOption: vueStrap.option,
    modal: vueStrap.modal
  },

  data () {
    return {
      lusername: '',
      lpassword: '',
      showLoginBtn: true,
      provinces: [],
      cities: [],
      cname: '',
      ctel: '',
      cfax: '',
      caddress: '',
      uusername: '',
      uname: '',
      upassword: '',
      urepassword: '',
      uphone: '',
      uqq: '',
      ucompanyabbr: '',
      showSignupModal: false,
      showSignupModalFooter: true
    }
  },

  computed: {
    provinceoptions () {
      var ps = Object.keys(this.provincecityobj)

      if (ps.length) {
        this.provinces = [ps[0]]
      }
      return ps
    },
    cityoptions () {
      var cs = []
      if (this.provinces[0]) {
        cs = Object.keys(this.provincecityobj[this.provinces[0]])
        this.cities = [cs[0]]
      }
      return cs
    },
    matchUserName () {
      return this.upassword !== this.uusername
    },
    matchPassword () {
      return this.urepassword === this.upassword
    }
  },

  methods: {
    onLogin () {
      if (this.$loginValidation.valid) {
        this.showLoginBtn = false
        let user = {
          userName: this.lusername,
          password: this.lpassword
        }

        login(this, user, (results) => {
          console.log(results)
          this.showLoginBtn = true
          if (results.success === 1) {
            window.localStorage.setItem('token', results.token)
            window.localStorage.setItem('dbName', results.dbName)
            this.$router.go('/home')
          } else {
            this.$setValidationErrors([
              { field: Errmsg[results.success].field, message: Errmsg[results.success].errMsg }
            ])
          }
        })
      }
    },

    onSignup () {
      if (this.$signupValidation.valid) {
        this.showSignupModalFooter = false
        let obj = {
          province: this.provinces[0],
          city: this.cities[0],
          cname: this.cname,
          ctel: this.ctel,
          cfax: this.cfax,
          caddress: this.caddress,
          uusername: this.uusername,
          upassword: this.upassword,
          uname: this.uname,
          uphone: this.uphone,
          uqq: this.uqq,
          ucompanyabbr: this.ucompanyabbr
        }

        signup(this, obj, (results) => {
          console.log(results)
          this.showSignupModalFooter = true
          if (results.success === 1) {
            this.showSignupModal = false
          } else {
            this.$setValidationErrors([
              { field: results.field, message: results.errMsg }
            ])
          }
        })
      }
    }
  }
  // ready () {
  //   provincecity(this, (results) => {
  //     if (results && Object.keys(results).length) {
  //       this.provincecityobj = results
  //     }
  //   })
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.signup {
  text-align: right;
}

.signup a {
  display: block;
  margin-top: 20px;
}

.errors {
  border-left: 5px solid #a94442;
  padding-left: 18px;
  color: #a94442;
}
</style>
