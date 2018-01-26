<template>
	<div>
		<Row type="flex"justify="space-between">
        <Col :span="15">
        <div class="col98">
          <SchemeAdd></SchemeAdd>
        </div>
        </Col>
        <Col :span="9">
        	<SchemeType></SchemeType>
        </Col>
      </Row>
      <Row class="mt20"  type="flex"justify="space-between">
        <Col :span="15">
        <div class="col98">
          <SchemeReport></SchemeReport>
        </div>
        </Col>
        <Col :span="9">
        	<SchemeRatio></SchemeRatio>
        </Col>
      </Row>
	</div>
</template>

<script>
import SchemeAdd from '@/components/statistic/ResourceReport/Scheme/SchemeAdd.vue'
import SchemeType from '@/components/statistic/ResourceReport/Scheme/SchemeType.vue'
import SchemeReport from '@/components/statistic/ResourceReport/Scheme/SchemeReport.vue'
import SchemeRatio from '@/components/statistic/ResourceReport/Scheme/SchemeRatio.vue'


	export default {
		data(){
			return {

			}
		},
		components:{
			SchemeAdd,
			SchemeType,
			SchemeReport,
			SchemeRatio,
		}
	}
</script>

