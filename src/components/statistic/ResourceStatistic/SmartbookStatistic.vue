<template>
  <div>
    <Row>
			<SmartbookRead></SmartbookRead>
    </Row>
    <Row class="mt20">
      <SmartbookRanking></SmartbookRanking>
    </Row>
  </div>
</template>
<script>
import SmartbookRead from '@/components/statistic/ResourceStatistic/SmartbookStatistic/SmartbookRead.vue'
import SmartbookRanking from '@/components/statistic/ResourceStatistic/SmartbookStatistic/SmartbookRanking.vue'

export default {
  data() {
    return {

    }
  },
  components: {
    SmartbookRead,
    SmartbookRanking
  }
}

</script>
