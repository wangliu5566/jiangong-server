<template>
  <div>
    <div class="system-title">
      <Icon type="navicon-round" size="24"></Icon>
      <span>内容统计</span>
    </div>
    <Row class="mt20">
    	<ContentChange></ContentChange>
    </Row>
    <Row class="mt20">
    	<ContentSale></ContentSale>
    </Row>
    <Row class="mt20">
      <ContentRanking></ContentRanking>
    </Row>
  </div>
</template>
<script>
import ContentChange from '@/components/statistic/ResourceStatistic/ContentStatistic/ContentChange.vue'
import ContentSale from '@/components/statistic/ResourceStatistic/ContentStatistic/ContentSale.vue'
import ContentRanking from '@/components/statistic/ResourceStatistic/ContentStatistic/ContentRanking.vue'

export default {
  data() {
    return {

    }
  },
  components: {
    ContentChange,
    ContentSale,
    ContentRanking
  }
}

</script>
