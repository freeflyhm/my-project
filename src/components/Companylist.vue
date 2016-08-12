<template>
  <div id="companylist" class="container">
    <div class="row">
      <div class="col-sm-12 col-md-12">
        <h3>公司列表</h3>
      </div>
      <table class="table table-striped table-hover table-responsive">
        <thead>
          <tr>
            <th>序号</th>
            <th>城市</th>
            <th>公司名称</th>
            <th>公司类型</th>
            <th>银行账号</th>
            <th>验证</th>
            <th>验证单价</th>
            <th>创建日期</th>
            <th>服务费</th>
            <th>修改</th>
            <th>用户页</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<script>
import vueStrap from 'vue-strap'

export default {
  components: {
    modal: vueStrap.modal
  }
}
</script>

<style scoped>

</style>
