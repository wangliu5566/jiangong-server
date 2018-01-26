<template>
  <div class="statistic-main">
    <div class="system-title">
      <Icon type="stats-bars" size="24"></Icon>
      <span>资源分析</span>
    </div>

    <ul class="header-nav">
      <li class="selected" @click="$router.push('/wrap/statisticMain/resourceStatistic/content')">内容统计</li>
      <!-- <li @click="$router.push('/wrap/statisticMain/resourceStatistic/smartbook')">知书阅读统计</li> -->
      <li @click="$router.push('/wrap/statisticMain/resourceStatistic/knowledge')">知识元阅读统计</li>
      <li @click="$router.push('/wrap/statisticMain/resourceStatistic/course')">课程学习统计</li>

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
