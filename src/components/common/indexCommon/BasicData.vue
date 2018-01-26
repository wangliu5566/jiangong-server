<template>
  <div class="basic-data">
    <Row type="flex" justify="start">
      <Col span="7" style='margin-bottom: -1px;z-index: 10;'>
      <Radio-group type="button" class="pt5" v-model="defaultStatus" @on-change="statusChange" style="width:400px">
        <Radio v-for="(item,index) in quickTimes" :key="item.value" :label="item.value">
          {{item.text}}
        </Radio>
      </Radio-group>
      </Col>
    </Row>
    <Row type="flex" justify="start" class="row-two">
      <Col span="8">
      <div>
        <span>资源数量（个）</span>
        <span>{{ResourceTotalCount}}</span>
      </div>
      </Col>
      <Col span="8">
      <div>
        <span>销售额（元）</span>
        <span>{{formatPrice(DealTotalCount,2)}}</span>
      </div>
      </Col>
      <Col span="8">
      <div>
        <span>用户个数（个）</span>
        <span>{{UserTotalCount}}</span>
      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //搜索时间
      defaultStatus: -1,

      quickTimes: [
        { text: '全部', value: -1 },
        { text: '最近一月', value: 30 },
        { text: '最近七天', value: 7 },
        { text: '今日', value: 1 },
        
      ],

      startTime:'',
      endTime:'',

      //基本数据
      ResourceTotalCount: 0,
      DealTotalCount: 0,
      UserTotalCount: 0,
    }
  },
  created(){
    this.initTime();
  },
  methods: {
    /**
     * [时间改变]
     * @作者     王柳
     * @日期     2017-11-19
     */
    initTime() {
      let dataRange = this.calculateDate(this.defaultStatus);
      this.startTime = dataRange[0];
      this.endTime = dataRange[1];
    },

    /**
     * [获取用户个数基本数据]
     * @作者     王柳
     * @日期     2017-11-19
     */
    getListData() {
      this.$http.get(this.ApiTransfer("/Order/BasicStatistic"), {
          params: this.ApiTransfer("/Order/BasicStatistic",{
            startTime:this.startTime,
            endTime:this.endTime
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.ResourceTotalCount = res.data.Data.ResourceCount;
            this.DealTotalCount = res.data.Data.TotalAmount;
            this.UserTotalCount = res.data.Data.UserCount;
          }
        })
    },

    statusChange(){
      this.initTime();
      this.getListData();
    }
  },
  mounted() {
    this.getListData();
  },
}

</script>
<style lang="less" scoped>
.row-two {
  border: 1px solid #dddee1;
  background-color: white;
  div {
    text-align: center;
    margin: 6px 0;
    span {
      display: block;
    }
    span:nth-child(1) {
      margin-bottom: 10px;
    }
  }
}

</style>
