<template>
  <div id="setplacelist" class="container">
    <div class="row">
      <div class="col-sm-12 col-md-12">
        <h3>集合地点列表</h3>
      </div>
      <table class="table table-striped table-responsive">
        <thead>
          <tr>
            <th>序号</th>
            <th>城市</th>
            <th>航空公司</th>
            <th>代码</th>
            <th>候机楼</th>
            <th>值机岛</th>
            <th>值机柜台</th>
            <th>集合地点</th>
            <th>创建日期</th>
            <th>最后更新</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of setplaces">
            <td>{{$index + 1}}</td>
            <td>{{item.city}}</td>
            <td>{{item.airlineCompany}}</td>
            <td>{{item.airCode}}</td>
            <td>{{item.airTerminal}}</td>
            <td>{{item.checkInIsLand}}</td>
            <td>{{item.checkInCounter}}</td>
            <td>{{item.place}}</td>
            <td>{{item.meta.createAt | formatYYYYMMDD}}</td>
            <td>{{item.meta.updateAt | formatYYYYMMDD}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { emitToServer } from '../util/auth'

export default {
  route: {
    data () {
      emitToServer('setplacelist', null, (results) => {
        this.setplaces = results
      })
    }
  },
  data () {
    return {
      setplaces: []
    }
  }
}
</script>

<style scoped>

</style>
