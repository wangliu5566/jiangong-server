<template>
  <div class="statistic-main">
    <div class="system-title">
      <Icon type="ios-cart" size="24"></Icon>
      <span>交易报表</span>
    </div>
    <div class="pt10 pb10">
      <Row>
        <DealCount></DealCount>
      </Row>
      <Row class="mt20" type="flex" justify="space-between">
        <Col :span="12">
        <div class="col98">
          <DealRatio></DealRatio>
        </div>
        </Col>
        <Col :span="12">
        <SaleRatio></SaleRatio>
        </Col>
      </Row>
      <Row class="mt20">
        <SaleCount></SaleCount>
      </Row>
    </div>
  </div>
</template>
<script>
import DealCount from "@/components/statistic/DealStatistic/DealCount.vue"
import DealRatio from "@/components/statistic/DealStatistic/DealRatio.vue"
import SaleCount from "@/components/statistic/DealStatistic/SaleCount.vue"
import SaleRatio from "@/components/statistic/DealStatistic/SaleRatio.vue"


export default {
  data() {
    return {

    }
  },
  components: {
    DealCount,
    DealRatio,
    SaleCount,
    SaleRatio
  }
}

</script>
<style lang="less">


</style>
