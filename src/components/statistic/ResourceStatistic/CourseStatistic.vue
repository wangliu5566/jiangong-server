<template>
  <div>
    <div class="system-title">
      <Icon type="ios-timer" size="24"></Icon>
      <span>课程学习统计</span>
    </div>
    <Row>
			<CourseRead></CourseRead>
    </Row>
    <Row class="mt20">
      <CourseRanking></CourseRanking>
    </Row>
  </div>
</template>
<script>
import CourseRead from '@/components/statistic/ResourceStatistic/CourseStatistic/CourseRead.vue'
import CourseRanking from '@/components/statistic/ResourceStatistic/CourseStatistic/CourseRanking.vue'

export default {
  data() {
    return {

    }
  },
  components: {
    CourseRead,
    CourseRanking
  }
}

</script>
