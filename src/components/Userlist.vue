<template>
  <div id="companylist" class="container">
    <div class="row">
      <div class="col-sm-8 col-md-8">
        <h3>
            <small v-if="company.category === 30 && user.role >= 30">
              <a v-link="{ name: 'companylist' }">公司列表</a> / </small>用户列表</h3>
      </div>
      <div class="col-sm-4 col-md-4 text-right">
        <button v-if="user.role < 99 && company._id === cid" class="btn btn-primary">添加用户</button>
      </div>
      <table class="table table-striped table-hover table-responsive">
        <thead>
          <tr>
            <th>序号</th>
            <th>用户名</th>
            <th>手机号</th>
            <th>用户权限</th>
            <th>姓名</th>
            <th>公司简称</th>
            <th>创建日期</th>
            <th>最后更新</th>
            <th>修改</th>
            <th>重置密码</th>
            <th v-if="company.category === 30 && user.role >= 30">审核通过</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of users">
            <td>{{$index + 1}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.phone}}</td>
            <td>{{item.role | formatRole}}</td>
            <td>{{item.name}}</td>
            <td>{{item.companyAbbr}}</td>
            <td>{{item.meta.createAt | formatYYYYMMDD}}</td>
            <td>{{item.meta.updateAt | formatYYYYMMDD}}</td>
            <td>
              <button
                v-if="user._id === item._id || company.category > item.company.category || user.role > item.role"
                class="btn btn-xs btn-primary">修改</button>
            </td>
            <td>
              <button
                v-if="company.category > item.company.category || user.role > item.role"
                class="btn btn-xs btn-danger">重置密码</button>
            </td>
            <td v-if="company.category === 30 && user.role >= 30">
              <input
                v-if="company.category > item.company.category || user.role > item.role"
                type="checkbox" v-model="item.status" @change="changeStatus($index, item)"></input>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { emitToServer } from '../util/auth'

export default {
  vuex: {
    getters: {
      company: state => state.company,
      user: state => state.user
    }
  },
  route: {
    data () {
      this.cid = this.$route.params.cid
      emitToServer('userlist', { cid: this.$route.params.cid }, (results) => {
        this.users = results
      })
    }
  },
  data () {
    return {
      cid: '',
      users: []
    }
  },
  computed: {},
  ready () {},
  attached () {},
  methods: {
    changeStatus (index, item) {
      console.log('changeStatus')
      console.log(item.status)

      setTimeout(() => {
        this.users[index].status = !item.status
      }, 3000)
    }
  },
  components: {}
}
</script>

<style scoped>
</style>
