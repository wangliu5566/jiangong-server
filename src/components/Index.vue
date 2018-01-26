<template>
  <div class="bg-system-index">
    <div class="system-title">
      <Icon type="ios-home" size="24"></Icon>
      <span>首页</span>
    </div>
    <Row class="pt10" style="margin-top: -25px;">
      <div class="countClass" style="border:none;">
        <div class="spanText">
          <span class="countTitle">基本概况</span>
        </div>
        <div class="sale-count-change">
          <ul class="quick-time">
            <li v-for="(item, index) in quickTimes" @click="clickFn1(item,index)">
              <span :class="item.isActive?'active':''">{{ item.text }}</span>
            </li>
          </ul>
          <div class="timePicker">
            <DatePicker style="width:190px;" format='yyyy/MM/dd' :options="options" :value="value" type="daterange" placement="bottom-end" placeholder="选择日期范围" @on-change="changeTime">
            </DatePicker>
          </div>
        </div>
      </div>
      <Row type="flex" justify="space-between">
        <Col :xs="6" :sm="6" :md="6" :lg="6">
        <div class="dashboard-stat blue">
          <Row>
            <Col span="9">
            <Icon type="ios-browsers" size="80" color="#fff" style="opacity:0.6;"></Icon>
            </Col>
            <Col span="15">
            <p class="count-name">资源数量</p>
            <p class="count">{{contentCount}}</p>
            </Col>
          </Row>
        </div>
        </Col>
        <Col :xs="6" :sm="6" :md="6" :lg="6">
        <div class="dashboard-stat red1">
          <Row>
            <Col span="9">
            <Icon type="ios-paper" size="80" color="#fff" style="opacity:0.6;"></Icon>
            </Col>
            <Col span="15">
            <p class="count-name">订单总数</p>
            <p class="count">{{orderCount}}</p>
            </Col>
          </Row>
        </div>
        </Col>
        <Col :xs="6" :sm="6" :md="6" :lg="6">
        <div class="dashboard-stat green">
          <Row>
            <Col span="9">
            <Icon type="social-yen" size="80" color="#fff" style="opacity:0.6;"></Icon>
            </Col>
            <Col span="15">
            <p class="count-name">销售额({{isBig}}元)</p>
            <p class="count">{{formatPrice(dealCount,2)}}</p>
            </Col>
          </Row>
        </div>
        </Col>
        <Col :xs="6" :sm="6" :md="6" :lg="6">
        <div class="dashboard-stat blue1" style="width:100%">
          <Row>
            <Col span="9">
            <Icon type="android-people" size="80" color="#fff" style="opacity:0.6;"></Icon>
            </Col>
            <Col span="15">
            <p class="count-name">用户数量</p>
            <p class="count">{{userCount}}</p>
            </Col>
          </Row>
        </div>
        </Col>
      </Row>
    </Row>
    <div class="pt10 pb10">
      <SaleStatistic></SaleStatistic>
    </div>
    <div class="pt10 pb10">
      <UserStatistic></UserStatistic>
    </div>
    <div class="pt10 pb10">

      <ResourceStatistic></ResourceStatistic>
       
     
    </div>
    <div class="pt10 pb10">
       <ContentType></ContentType>
    </div>

  </div>
</template>
<script>
// import ResourceAdd from "@/components/statistic/ResourceAdd.vue"
import ContentType from "@/components/common/indexCommon/ContentType.vue"
import SaleStatistic from "@/components/common/indexCommon/SaleStatistic.vue"
import UserStatistic from "@/components/statistic/UserStatisticCommon/UserCountPie.vue"
import ResourceStatistic from "@/components/common/indexCommon/ResourceStatistic.vue"

export default {
  data() {
    return {
      propWidth: "",
      contentCount: 0,
      orderCount: 0,
      dealCount: 0,
      userCount: 0,

      isBig:'',

      quickTimes: [
        { text: '最近一月', isActive: false, value: 30 },
        { text: '最近7天', isActive: false, value: 7 },
        { text: '昨天', isActive: false, value: 0 },
        { text: '今天', isActive: false, value: 1 },
        { text: '全部', isActive: true, value: -1 },
      ],

      options: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },

      startTime: '',
      endTime: '',

      value: '',
    }
  },
  props: ['widthData'],
  components: {
    // ResourceAdd,
    ContentType,
    SaleStatistic,
    UserStatistic,
    ResourceStatistic
  },
  created() {
    this.initTime();

  },
  mounted() {
    this.getListData();
    this.propWidth = this.widthData
  },
  methods: {
    //改变时间
    changeTime(date) {
      this.value = date;

      if (this.checkDateIsClear(date)) {
        this.quickTimes.forEach((item, index) => {
          if (index == this.quickTimes.length - 1) {
            item.isActive = true;
          } else {
            item.isActive = false;
          }
        })
        this.initTime();
        this.getListData();
      } else {
        this.quickTimes.forEach((item, index) => {
          item.isActive = false;
        })
        this.startTime = this.value[0];
        this.endTime = this.value[1];
        this.getListData();
      }
    },

    clickFn1(item, index) {
      this.quickTimes.forEach((item, i) => {
        if (i == index) {
          item.isActive = true;
        } else {
          item.isActive = false;
        }
      });
      this.initTime();
      this.value = [];
      this.getListData();
    },
    /**
     * [时间改变]
     * @作者     王柳
     * @日期     2017-11-19
     */
    initTime() {

      this.quickTimes.forEach((item, index) => {
        if (item.isActive == true) {
          let dataRange = this.calculateDate(item.value);
          this.startTime = dataRange[0];
          this.endTime = dataRange[1];
        }
      })
    },

    getListData() {
      this.$http.get(this.ApiTransfer('/Report/AllBasicStatisticsByDate'), {
            params: this.ApiTransfer('/Report/AllBasicStatisticsByDate', {
              startTime: this.startTime,
              endTime: this.endTime,
              isAll: (!this.startTime && !this.endTime) ? true : false
            })
          }

        )
        .then((res) => {
          if (res.data.Success) {
            this.contentCount = this.mapArrToValueByKey(res.data.Data, '资源数量', 'Value');
            this.orderCount = this.mapArrToValueByKey(res.data.Data, '订单数量', 'Value');
            this.dealCount = this.mapArrToValueByKey(res.data.Data, '销售额数量', 'Value');
            if (parseInt(this.dealCount)>10000000) {
              this.dealCount = this.dealCount/10000;
              this.isBig = '万'
            }else{
              this.isBig = '';
            }
            this.userCount = this.mapArrToValueByKey(res.data.Data, '用户数量', 'Value');
          }
        })
    }
  },


}

</script>
<style lang="less" scoped>
.bg-system-index {
  .col98 {
    width: 98%;
  }
  .title {
    font-size: 20px;
    font-weight: normal;
    margin-bottom: 10px;
  }
  .dashboard-stat {
    display: block;
    padding: 10px 10px;
    border-radius: 4px;
    overflow: hidden;
    border: none;
    outline: none;
    width: 96%;
  }
  .blue {
    background-color: #3598dc;
  }
  .red1 {
    background-color: #e7505a;
  }
  .green {
    background-color: #32c5d2;
  }
  .blue1 {
    background-color: rgb(63, 78, 98);
  }

  .today-user {
    margin: 50px 0 15px 0;
    padding-bottom: 15px;
    font: normal 600 16px '微软雅黑';
    border-bottom: 1px solid #eee;
  }
  .count-name {
    margin-top: 10px;
    font: normal 900 20px '微软雅黑';
    color: white;
    text-align: right;
  }
  .count {
    margin-top: 20px;
    font: normal 900 18px '微软雅黑';
    color: white;
    text-align: right;
  }
}

</style>
