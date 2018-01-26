<template>
  <div class="statistic-main">
    <div class="system-title">
      <Icon type="android-contacts" size="24"></Icon>
      <span>用户统计</span>
    </div>
    <div class="pt10 pb10">
      <UserCountPie></UserCountPie>
    </div>
    <div class="pt10 pb10">
      <UserRegFromPie></UserRegFromPie>
    </div>
    <div class="pt10 pb10">
      <UserCountChange></UserCountChange>
    </div>
  </div>
</template>
<script>
import UserCountChange from "@/components/statistic/UserStatisticCommon/UserCountChange.vue"
import UserCountPie from "@/components/statistic/UserStatisticCommon/UserCountPie.vue"
import UserRegFromPie from "@/components/statistic/UserStatisticCommon/UserRegFromPie.vue"


export default {
  data() {
    return {

    }
  },
  components: {
    UserCountChange,
    UserCountPie,
    UserRegFromPie,
  }
}

</script>
<style lang="less">


</style>
