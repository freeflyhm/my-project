<template>
  <div id="wrapper">
    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
      <zx-navbar>
        <button class="navbar-toggle collapsed"
            type="button"
            data-toggle="collapse"
            data-target="#bs-navbar"
            aria-controls="bs-navbar"
            aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a tabindex="-1" class="navbar-brand" href="#/home">阳光服务</a>
        <div id="bs-navbar"
            class="navbar-collapse collapse"
            slot="dropdown-menu"
            v-if="authenticated">
          <ul class="nav navbar-nav">
            <li v-if="company.category === 20">
              <a tabindex="-1">团队单管理</a>
            </li>
            <li>
              <a tabindex="-1"
                  @click="goSmlist()">服务单管理</a>
            </li>
            <zx-dropdownmenu v-if="company.category === 20">
              <a class="dropdown-toggle" data-toggle="dropdown">
                系统管理
                <span class="caret"><span>
              </a>
              <ul slot="dropdown-menu" class="dropdown-menu">
                <li><a tabindex="-1" href="#">导游旗管理</a></li>
                <li><a tabindex="-1" href="#">地接人员管理</a></li>
                <li><a tabindex="-1" href="#">收客单位管理</a></li>
                <li><a tabindex="-1" href="#">团队操作人管理</a></li>
                <li class="divider"></li>
                <li><a tabindex="-1" href="#">服务费用标准</a></li>
                <li><a tabindex="-1" href="#">对账单列表</a></li>
                <li class="divider"></li>
                <li><a @click="pwdModal = true" role="button">修改密码</a></li>
                <li><a tabindex="-1" href="#">用户管理</a></li>
              </ul>
            </zx-dropdownmenu>
            <zx-dropdownmenu v-if="company.category === 30 && user.role < 99">
              <a class="dropdown-toggle" data-toggle="dropdown">
                系统管理10
                <span class="caret"><span>
              </a>
              <ul slot="dropdown-menu" class="dropdown-menu">
                <li><a @click="pwdModal = true" role="button">修改密码</a></li>
                <li class="divider"></li>
                <li><a tabindex="-1" href="#">排班表</a></li>
                <li><a tabindex="-1" href="#">保险卡</a></li>
                <li><a tabindex="-1" href="#">登机牌</a></li>
              </ul>
            </zx-dropdownmenu>
            <zx-dropdownmenu
                v-if="company.category === 30 && user.role > 10 && user.role < 99">
              <a class="dropdown-toggle" data-toggle="dropdown">
                系统管理20
                <span class="caret"><span>
              </a>
              <ul slot="dropdown-menu" class="dropdown-menu">
                <li><a tabindex="-1" v-link="{name: 'servermanlist'}">现场责任人</a></li>
                <li><a tabindex="-1" href="#">排班表管理</a></li>
                <li class="divider"></li>
                <li><a tabindex="-1" href="#">往来账管理</a></li>
                <li class="divider"></li>
                <li><a tabindex="-1" href="#">应收款</a></li>
                <li><a tabindex="-1" href="#">月账单列表</a></li>
                <li><a tabindex="-1" href="#">月账单汇总报表</a></li>
              </ul>
            </zx-dropdownmenu>
            <zx-dropdownmenu v-if="company.category === 30 && user.role === 30">
              <a class="dropdown-toggle" data-toggle="dropdown">
                系统管理30
                <span class="caret"><span>
              </a>
              <ul slot="dropdown-menu" class="dropdown-menu">
                <li><a tabindex="-1" v-link="{ name: 'setplacelist' }">集合地点管理</a></li>
                <li class="divider"></li>
                <li><a tabindex="-1" v-link="{ name: 'feestemplist' }">服务费模板管理</a></li>
                <li class="divider"></li>
                <li><a tabindex="-1" v-link="{ name: 'dengjipailist' }">登机牌用户管理</a></li>
                <li class="divider"></li>
                <li><a tabindex="-1" v-link="{ name: 'companylist' }">公司列表</a></li>
              </ul>
            </zx-dropdownmenu>
            <zx-dropdownmenu v-if="user.role === 99">
              <a class="dropdown-toggle" data-toggle="dropdown">
                系统管理99
                <span class="caret"><span>
              </a>
              <ul slot="dropdown-menu" class="dropdown-menu">
                <li><a @click="pwdModal = true" role="button">修改密码</a></li>
                <li class="divider"></li>
                <li><a tabindex="-1" v-link="{ name: 'companylist' }">公司列表</a></li>
                <li><a tabindex="-1" v-link="{ name: 'getusers' }">活动用户列表</a></li>
              </ul>
            </zx-dropdownmenu>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li style="padding-top: 6px;">
              Hi, {{ user.name }}
              <a style="display: inline;"
                  tabindex="-1"
                  @click="logOut()">退出{{city}}站</a>
            </li>
          </ul>
        </div>
      </zx-navbar>
    </div>

    <router-view
        class="view"
        keep-alive
        transition
        transition-mode="out-in">
    </router-view>

    <modal title="修改密码"
        ok-text="确定"
        cancel-text="取消"
        backdrop="false"
        effect="zoom"
        :show.sync="pwdModal" small>
      <div slot="modal-body" class="modal-body">
        ...
      </div>
    </modal>

    <modal
        backdrop="false"
        effect="zoom"
        :show.sync="wantonlineModal" small>
      <div slot="modal-header" class="modal-header">
        <h4>有人用您的账号请求上线</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="row">
          <div class="col-md-12">
            <p>您还有 <strong style="color: red;">{{ cancelTime }}</strong> 秒时间拒绝对方！</p>
            <p><em style="color: red;">否则您将自动下线 ！！！</em></p>
          </div>
        </div>
        <div class="row">
          <div class="modal-footer">
            <button class="btn btn-success" @click="onCancelOnline">拒绝 ( {{ cancelTime }} )</button>
          </div>
        </div>
      </div>
      <div slot="modal-footer" style="display: none;"></div>
    </modal>

    <modal
        backdrop="false"
        effect="zoom"
        :show.sync="isSomebody" small>
      <div slot="modal-header" class="modal-header">
        <h4>是否踢人</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <div class="row">
          <div class="col-md-12">
            <div v-if="showModalFooter">
              <p>已经有人使用此账号登录系统了!</p>
            </div>
            <div v-else>
              <p><em style="color: red;">已通知对方下线, 请不要离开此页！</em></p>
              <p>如果对方没有拒绝, 您将在 <strong style="color: red;">{{ waitTime }}</strong> 秒内自动上线</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div v-if="showModalFooter" class="modal-footer">
            <button class="btn btn-success" @click="onLine">踢他下线</button>
            <button class="btn btn-default" @click="onCancel">放他一马</button>
          </div>
        </div>
      </div>
      <div slot="modal-footer" style="display: none;"></div>
    </modal>
  </div>
</template>

<script>
import vueStrap from 'vue-strap'
import zxNavbar from './components/ZxNavbar'
import zxDropdownmenu from './components/ZxDropdownmenu'

import store from './vuex/store'

import { emitToServer, logout, setStoreSomebodyFalse, clearStoreSids } from './util/auth'

const TIME_SPAN = 5 // 秒
let id = null
let idWait = null

export default {
  store,
  vuex: {
    getters: {
      somebody: state => state.somebody,
      sids: state => state.sids,
      authenticated: state => state.authenticated,
      token: state => state.token,
      sio: state => state.sio,
      smlistDate: state => state.smlistDate,
      company: state => state.company,
      user: state => state.user,
      city: state => state.city
    }
  },
  components: {
    zxNavbar,
    zxDropdownmenu,
    modal: vueStrap.modal
  },
  data () {
    return {
      pwdModal: false,
      cancelMinus: false,
      cancelTime: TIME_SPAN,
      waitMinus: false,
      waitTime: TIME_SPAN * 2,
      showModalFooter: true
    }
  },
  computed: {
    wantonlineModal () {
      if (this.sids.length > 0) {
        if (!this.cancelMinus) {
          this.intervalTime()
          this.cancelMinus = true
        }
        return true
      }
      return false
    },
    isSomebody () {
      if (this.somebody) {
        this.waitMinus = false
        this.waitTime = TIME_SPAN * 2
        this.showModalFooter = true
        if (idWait) {
          window.clearInterval(idWait)
          idWait = null
        }
        return true
      }
      this.showModalFooter = false
      return false
    }
  },
  methods: {
    logOut () {
      logout()
    },
    goSmlist () {
      this.$router.go({
        name: 'smlist',
        query: {
          date: this.smlistDate
        }
      })
    },
    // 踢他下线
    onLine () {
      this.intervalTimeWait()
      emitToServer('somebodyWantOnline', null, null)
      this.showModalFooter = false
    },
    onCancel () {
      setStoreSomebodyFalse(true)
    },
    onCancelOnline () {
      window.clearInterval(id)
      this.cancelTime = TIME_SPAN
      this.cancelMinus = false
      clearStoreSids(false)
    },
    intervalTime () {
      let tip = () => {
        if (this.cancelTime > 0) {
          this.cancelTime--
        } else {
          window.clearInterval(id)
          this.cancelTime = TIME_SPAN
          this.cancelMinus = false
          clearStoreSids(true)
        }
      }

      id = window.setInterval(tip, 1000)
    },
    intervalTimeWait () {
      let tip = () => {
        if (this.waitTime > 0) {
          this.waitTime--
        } else {
          window.clearInterval(idWait)
          this.waitTime = TIME_SPAN * 2
          this.waitMinus = false
          setStoreSomebodyFalse(false)
          emitToServer('initConnect', null, null)
        }
      }

      idWait = window.setInterval(tip, 1000)
    }
  // },
  // ready () {
  //   console.log(this)
  //   console.log(this.$resource)
  //   console.log(this.$http)
  //   console.log(this.$router)
  //   console.log(this.$route)
  }
}
</script>

<style src="bootstrap/dist/css/bootstrap.css"></style>
<style scoped>
#wrapper {
  padding: 60px 15px 0;
}
</style>
