<template>
  <div>
    <div class="system-title">
      <Icon type="ios-settings-strong" size="24"></Icon>
      <span>资源入库报表</span>
    </div>
    <Row>
      <ResourceAdd></ResourceAdd>
    </Row>
    <Row class="mt20" type="flex" justify="space-between" style="margin-bottom: 20px;">
      <Col :span="12">
      <div class="col98">
        <ContentType></ContentType>
      </div>
      </Col>
      <Col :span="12">
      <ReportRatio></ReportRatio>
      </Col>
    </Row>
  </div>
</template>
<script>
import ResourceAdd from '@/components/statistic/ResourceReport/Resource/ResourceAdd.vue'
import ContentType from '@/components/statistic/ResourceReport/Resource/ContentType.vue'
// import ResourceReport from '@/components/statistic/ResourceReport/Resource/ResourceReport.vue'
import ReportRatio from '@/components/statistic/ResourceReport/Resource/ReportRatio.vue'


export default {
  data() {
    return {

    }
  },
  components: {
    ResourceAdd,
    ContentType,
    // ResourceReport,
    ReportRatio
  }
}

</script>
