<template>
  <div id="getusers" class="container">
    <div class="row">
      <table class="table table-striped table-responsive">
        <thead>
          <tr>
            <th>sn</th>
            <th>city</th>
            <th>_id</th>
            <th>companyId</th>
            <th>socketId</th>
            <th>category</th>
            <th>role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of usersArr">
            <td>{{ $index + 1 }}</td>
            <td>{{ item.city }}</td>
            <td>{{ item._id }}</td>
            <td>{{ item.companyId }}</td>
            <td>{{ item.socketId }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.role }}</td>
          </tr>
        </tbody>
      </table>

      <div class="col-md-12">
        <p>{{ clientsLength }} 位 在线用户</p>
      </div>
    </div>
</template>

<script>
import { emitToServer, cloneObj } from '../util/auth'

export default {
  vuex: {
    getters: {
      authenticated: state => state.authenticated
    }
  },
  route: {
    data () {
      console.log(this.authenticated)
      if (this.authenticated) {
        emitToServer('getusers', null, (results) => {
          this.usersObj = results.cookieUsers
          this.clientsLength = results.clientsLength
        })
      }
    }
  },
  data: function () {
    return {
      usersObj: {},
      clientsLength: 0
    }
  },
  computed: {
    usersArr () {
      let obj = cloneObj(this.usersObj)
      let arr = []
      let key
      let o
      let k

      for (key in obj) {
        o = obj[key]
        for (k in o) {
          o[k].city = key
          arr.push(o[k])
        }
      }

      return arr
    }
  },
  ready: function () {},
  attached: function () {},
  methods: {},
  components: {}
}
</script>

<style scoped>

</style>
