<template>
  <div class="sale-statistic">
    <Row type="flex" class="row-bg" justify="space-between">
      <Col :span="24" class="col">
      <div class="count-class">
        <div class="spanText">
          <span class="countTitle">销售额统计 /<span class="sub-title">总金额：{{total}}元</span></span>
        </div>
        <div class="sale-count-change">
          <ul class="quick-time">
            <li v-for="(item, index) in quickTimes" @click="clickFn1(item,index)">
              <span :class="item.isActive?'active':''">{{ item.text }}</span>
            </li>
          </ul>
          <div class="timePicker">
            <DatePicker style="width:190px" format="yyyy/MM/dd" :options="options" :value="value" type="daterange" placement="bottom-end" placeholder="选择日期范围" @on-change="changeTime">
            </DatePicker>
          </div>
        </div>
      </div>
      <div class="rel">
        <div ref="echartEl" style="height:400px;"></div>
        <div class="chart-no-data" v-show="showNoData">
          <span>暂无统计数据</span>
        </div>
      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
import qs from 'qs'
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data() {
    return {
      //选择器
      options: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      quickTimes: [
        { text: '最近7天', isActive: true, value: 7 },
      ],

      startTime: '',
      endTime: '',

      value: '',

      total: 0,

      showNoData:false,

      winHeight: 350,
      myChart8: null,
      echartOption: {
        color: ['#5793f3'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
              precision: 0,
            }
          }
        },
        legend: {
          data: ['机构', '个人']
        },
        xAxis: {
          type: 'category',
          name: '日期',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#d14a61'
            }
          },
          axisPointer: {
            label: {}
          },
          data: []
        },
        yAxis: {
          type: 'value',
          name: '销售额（元）',
          data: []
        },
        series: [{
          name: '机构',
          type: 'line',
          smooth: false,
          showAllSymbol: true,
          data: [],
          itemStyle: {
            normal: {
              color: '#5793f3'
            }
          }
        }, {
          name: '个人',
          type: 'line',
          smooth: false,
          showAllSymbol: true,
          data: [],
          itemStyle: {
            normal: {
              color: '#ea7336'
            }
          }
        }, ]
      }
    }
  },
  created() {
    this.initTime();
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
    drawLine() {
      //内容授权统计
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.echartEl);
      // 绘制图表
      myChart.setOption(this.echartOption);
    },
    //获取内容授权数据
    getListData() {
      let myChart = echarts.getInstanceByDom(this.$refs.echartEl);
      var paramsData = {};
      paramsData = {
        startTime: this.startTime,
        endTime: this.endTime,
      }

      myChart.showLoading();
      this.$http.get(this.ApiTransfer("/Order/GetTotalAmountByDateRange"), {
          params: this.ApiTransfer("/Order/GetTotalAmountByDateRange", paramsData)
        })
        .then((res) => {
          myChart.hideLoading();
          myChart.setOption({
            xAxis: {
              data: this.mapArrToArrByKey(res.data.Data.ItemList, 'Key')
            },
            series: [{
              name: '机构',
              data: this.mapArrToArrByKey(res.data.Data.ItemList, 'Value1')
            }, {
              name: '个人',
              data: this.mapArrToArrByKey(res.data.Data.ItemList, 'Value2')
            }]
          });

          if (res.data.Data.ItemList.length != 0) {
            this.showNoData = false;
          } else {
            this.showNoData = true;
          }

          this.total = this.formatPrice(res.data.Data.Additional.TotalAmount, 2)
        })
    },
  },
  mounted() {

    this.drawLine();
    this.getListData();
    let myChart = echarts.getInstanceByDom(this.$refs.echartEl);
    window.addEventListener("resize", function() {
      myChart.resize();
    });
  },
  watch: {
    value5: function(val, oldVal) {
      this.getAuthorityView();
    }
  }
}

</script>
<style lang="less" scoped>
.sale-statistic {
  background-color: white;
  .row-bg {
    margin-top: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    .col {
      border: 1px solid #dfe6ec;
      border-radius: 5px;
      .countClass {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: gray;
        .countData {
          font-size: 14px;
          margin-left: 5px;
          .countText {
            margin-left: 0;
          }
        }
        .countTitle {
          font-size: 18px;
          font-weight: bold;
          margin: 20px 0 0 10px;
        }
        .spanText {
          float: left;
        }
        .sale-count-change {
          width: 120px;
          margin-right: 10px;
          float: right;
        }
      }
    }
  }
}

.active {
  color: #20a0ff;
}

.sub-title {
  font-size: 16px;
  font-weight: normal;
  padding-left: 10px;
  color: gray;
}

.count-class {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: gray;
  width: 100%;
  .spanText {
    float: left;
    height: 100%;
    line-height: 30px;
  }

  .col98 {
    width: 98%;
  }

  .condition-select {
    display: inline-block;
    height: 100%;
    float: right;
    font-size: 14px;
    margin-right: 20px;
  }


  .sale-count-change {
    display: inline-block;
    height: 100%;
    float: right;
    margin-right: 10px;
    .quick-time {
      float: left;
      margin: 5px 0 0 0;
      li {
        float: right;
        font-size: 14px;
        cursor: pointer;
        margin-right: 20px;
      }
    }
    .timePicker {
      float: right;
    }
  }

  .countData {
    font-size: 14px;
    margin-left: 5px;
    .countText {
      margin-left: 0;
    }
  }

  .countTitle {
    font-size: 18px;
    font-weight: bold;
    display: inline-block;
    float: left;
    margin: 10px 0 0 10px;
    .count-sub-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
    }
  }

  .selectBox {
    margin-right: 10px;
    float: right;
  }

  .no-border {
    border: none!important;
  }
}

</style>
