<template>
  <div class="statistic-main">
    <div class="system-title">
      <Icon type="stats-bars" size="24"></Icon>
      <span>资源入库报表</span>
    </div>

    <ul class="header-nav">
      <!-- <li class="selected" @click="$router.push('/wrap/statisticMain/resourceReport/resource')">资源入库</li>
      <li @click="$router.push('/wrap/statisticMain/resourceReport/scheme')">组织方案入库</li> -->

    </ul>
    <div class="pt10 pb10">
      <router-view></router-view>
      
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {

    }
  },
}

</script>
<style lang="less">


</style>
