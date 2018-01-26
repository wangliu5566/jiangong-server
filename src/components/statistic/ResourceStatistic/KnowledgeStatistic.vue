<template>
  <div>
    <div class="system-title">
      <Icon type="ios-pricetag" size="24"></Icon>
      <span>知识元阅读统计</span>
    </div>
    <Row>
			<KnowledgeRead></KnowledgeRead>
    </Row>
    <Row class="mt20">
      <KnowledgeRanking></KnowledgeRanking>
    </Row>
  </div>
</template>
<script>
import KnowledgeRead from '@/components/statistic/ResourceStatistic/KnowledgeStatistic/KnowledgeRead.vue'
import KnowledgeRanking from '@/components/statistic/ResourceStatistic/KnowledgeStatistic/KnowledgeRanking.vue'

export default {
  data() {
    return {

    }
  },
  components: {
    KnowledgeRead,
    KnowledgeRanking
  }
}

</script>
