<template>
  <div class="bg-system-index">
    <div class="system-title">
      <Icon type="ios-home" size="24"></Icon>
      <span>首页</span>
    </div>
     <Row style="margin-top: -5px;">
      <h2 style='font-size: 18px;font-weight: bold;color:gray;'>基本概况</h2>
      <Row type="flex" justify="space-between">
        <Col :xs="12" :sm="12" :md="12" :lg="12">
        <div class="dashboard-stat blue">
          <Row>
            <Col span="9">
            <Icon type="ios-browsers" size="80" color="#fff" style="opacity:0.6;"></Icon>
            </Col>
            <Col span="12">
            <p class="count-name">内容数量</p>
            <p class="count">{{contentCount}}</p>
            </Col>
          </Row>
        </div>
        </Col>
        <Col :xs="12" :sm="12" :md="12" :lg="12">
        <div class="dashboard-stat red1" style="width:100%;">
          <Row>
            <Col span="9">
            <Icon type="ios-paper" size="80" color="#fff" style="opacity:0.6;"></Icon>
            </Col>
            <Col span="12">
            <p class="count-name">订单总数</p>
            <p class="count">{{orderCount}}</p>
            </Col>
          </Row>
        </div>
        </Col>
        <!-- <Col :xs="6" :sm="6" :md="6" :lg="6">
        <div class="dashboard-stat green">
          <Row>
            <Col span="9">
            <Icon type="social-yen" size="120" color="#fff" style="opacity:0.6;"></Icon>
            </Col>
            <Col span="12">
            <p class="count-name">销售额数量</p>
            <p class="count">{{dealCount}}</p>
            </Col>
          </Row>
        </div>
        </Col>
        <Col :xs="6" :sm="6" :md="6" :lg="6">
        <div class="dashboard-stat blue1">
          <Row>
            <Col span="9">
            <Icon type="android-people" size="120" color="#fff" style="opacity:0.6;"></Icon>
            </Col>
            <Col span="12">
            <p class="count-name">用户数量</p>
            <p class="count">{{userCount}}</p>
            </Col>
          </Row>
        </div>
        </Col> -->
      </Row>
    </Row>

    <div class="pt10 pb10">
      <CodeRatio></CodeRatio>
    </div>
  </div>
</template>
<script>

import CodeRatio from "@/components/system/CodeRatio"

export default {
  data() {
    return {
      propWidth: "",
      contentCount: 0,
      orderCount: 0,
      dealCount: 0,
      userCount: 0,
    }
  },
  props: ['widthData'],
  components: {
    CodeRatio

  },
  mounted() {
    this.propWidth = this.widthData
  },
  methods: {
    getIndexDatas(){
      this.$http.get(this.ApiTransfer('/Organization/Index'),{
        params:this.ApiTransfer('/Organization/Index',{})
      })
      .then((res)=>{
        if (res.data.Success) {
          let data = res.data.Data;
          this.contentCount = data.Content;
          this.orderCount = data.Order;
          // if (data.SaleMoney >= 1000000) {
          //   this.dealCount = data.SaleMoney/10000;
          //   this.isW = '万元'
          // }else{
          //   this.dealCount = data.SaleMoney;
          //   this.isW = '元'
          // }
          
          // this.userCount = data.User;
        }
      })
    }

  },
  created(){
    this.getIndexDatas();
  }


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
    padding: 20px 10px;
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
    margin-top: 20px;
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
