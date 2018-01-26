<template>
  <div class="statistic-main">
    <div class="system-title">
      <Icon type="android-list" size="24"></Icon>
      <span>机构码统计</span>
    </div>
    <div class="pt10 pb10">
      <Row type="flex"justify="space-between">
        <Col :span="15">
        <div class="col98">
          <CodeCount></CodeCount>
        </div>
        </Col>
        <Col :span="9">
        <CodeRatio></CodeRatio>
        </Col>
      </Row>
      
    </div>
  </div>
</template>
<script>
import CodeCount from "@/components/statistic/CodeStatistic/CodeCount.vue"
import CodeRatio from "@/components/statistic/CodeStatistic/CodeRatio.vue"


export default {
  data() {
    return {

    }
  },
  components: {
    CodeCount,
    CodeRatio,
  }
}

</script>
<style lang="less">


</style>
