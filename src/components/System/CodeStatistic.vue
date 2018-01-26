<template>
  <div class="statistic-main">
    <div class="system-title">
      <Icon type="stats-bars" size="24"></Icon>
      <span>机构统计</span>
    </div>
    <div class="pt10 pb10">
      <CodeCount></CodeCount>
    </div>
    <div class="pt10 pb10">
      <CodeRatio></CodeRatio>
    </div>
    <div class="pt10 pb10">
      <ResourceAdd></ResourceAdd>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  }
}

</script>
<script>
import CodeCount from "@/components/system/CodeCount.vue"
import CodeRatio from "@/components/system/CodeRatio.vue"
import ResourceAdd from "@/components/system/ResourceAdd.vue"

export default {
  data() {
    return {

    }
  },
  components: {
    CodeCount,
    CodeRatio,
    ResourceAdd
  }
}

</script>
<style lang="less">


</style>
