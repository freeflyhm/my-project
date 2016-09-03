<template>
  <div id="getusers" class="container">
    <div class="row">
      <table class="table table-striped table-responsive">
        <thead>
          <tr>
            <th>sn</th>
            <th>city</th>
            <th>_id</th>
            <th>userName</th>
            <th>name</th>
            <th>status</th>
            <th>role</th>
            <th>companyId</th>
            <th>companyCity</th>
            <th>companyCategory</th>
            <th>socketId</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of usersObj">
            <td>{{ $index + 1 }}</td>
            <td>{{ item.dbName }}</td>
            <td>{{ item._id }}</td>
            <td>{{ item.userName }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.role }}</td>
            <td>{{ item.companyId }}</td>
            <td>{{ item.companyCity }}</td>
            <td>{{ item.companyCategory }}</td>
            <td>{{ item.socketId }}</td>
          </tr>
        </tbody>
      </table>

      <div class="col-md-12">
        <p>{{ clientsLength }} 位 在线用户</p>
      </div>
    </div>
</template>

<script>
import { emitToServer } from '../util/auth'

export default {
  route: {
    data () {
      emitToServer('getusers', null, (results) => {
        this.usersObj = results.cookieUsers
        this.clientsLength = results.clientsLength
      })
    }
  },
  data: function () {
    return {
      usersObj: {},
      clientsLength: 0
    }
  }
}
</script>

<style scoped>

</style>
