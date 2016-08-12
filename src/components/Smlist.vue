<template>
  <div id="smlist" class="container-fluid">
    <div class="row">
      <div class="col-sm-6 col-md-6">
        <h3>服务单列表</h3>
      </div>
      <div class="col-sm-6 col-md-6">
        <div class="input-group" style="max-width: 360px;">
          <span class="input-group-btn">
            <button class="btn btn-default">
              服务日期
              <span class="glyphicon glyphicon-chevron-left"></span>
            </button>
          </span>
          <zx-datepicker></zx-datepicker>
          <span class="input-group-btn">
            <button class="btn btn-default">
              <span class="glyphicon glyphicon-chevron-right"></span>
            </button>
          </span>
        </div>
      </div>
    </div>
    <table class="table table-striped table-hover table-responsive">
      <thead>
        <tr>
          <th>序号</th>
          <th>服务单号</th>
          <th>服务日期</th>
          <th>服务航班</th>
          <th>集合时间</th>
          <th>代收</th>
          <th>代付</th>
          <th>服务</th>
          <th>交通</th>
          <th>状态</th>
          <th>短信</th>
          <th>导出</th>
          <th>现场</th>
          <th>保险</th>
          <th>服务满意度</th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
import store from '../vuex/store'
import { emitSmlist } from '../util/auth'
import zxDatepicker from './ZxDatepicker'

export default {
  store,
  vuex: {
    getters: {
      city: state => state.city
    }
  },
  route: {
    data () {
      if (this.city) {
        console.info('Smlist.vue data 向服务器获取 smlist')
        emitSmlist()
      }
    }
  },
  components: {
    zxDatepicker
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*h1 {
  color: #42b983;
}*/
</style>
