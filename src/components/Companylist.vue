<template>
  <div id="companylist" class="container-fluid">
    <div class="row">
      <div class="col-sm-12 col-md-12">
        <h3>公司列表</h3>
      </div>
      <table class="table table-striped table-hover table-responsive">
        <thead>
          <tr>
            <th style="width: 60px;">序号</th>
            <th style="width: 60px;">城市</th>
            <th>公司名称</th>
            <th style="width: 80px;">公司类型</th>
            <th>银行账号</th>
            <th style="width: 80px;">服务费</th>
            <th style="width: 60px;">验证</th>
            <th style="width: 80px;">验证单价</th>
            <th style="width: 90px;">创建日期</th>
            <th>修改</th>
            <th>用户页</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of companys">
            <td>{{$index + 1}}</td>
            <td>{{item.city}}</td>
            <td>{{item.name}}</td>
            <td>{{item.category === 20 ? '地接社' : '服务商'}}</td>
            <td>{{item.bankCard}}</td>
            <td>{{item.feestemp}}</td>
            <td>{{item.isidcard ? '是' : '否'}}</td>
            <td>{{item.idcardfee ? item.idcardfee/1000 : ''}}</td>
            <td>{{item.meta.createAt | formatYYYYMMDD}}</td>
            <td><button class="btn btn-xs btn-primary">修改</button></td>
            <td><a class="btn btn-xs btn-info" v-link="{ name: 'userlist', params: { cid: item._id }}">进入用户页 >></a></td>
          </tr>
        </tbody>
      </table>
    </div>
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
      emitToServer('companylist', null, (results) => {
        console.log(results)
        this.companys = results.companys
      })
    }
  },
  data () {
    return {
      companys: []
    }
  }
}
</script>

<style scoped>

</style>
