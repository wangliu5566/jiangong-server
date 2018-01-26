<template>
  <div class="statistic-col">
    <Row type="flex" justify="space-between">
      <div class="countClass">
        <div class="spanText">
          <span class="countTitle">用户数统计<span class="count-sub-title">/总数量：{{total}}</span></span>
        </div>
        <div class="sale-count-change">
          <ul class="quick-time">
            <li v-for="(item, index) in quickTimes" @click="clickFn1(item,index)">
              <span :class="item.isActive?'active':''">{{ item.text }}</span>
            </li>
          </ul>
          <div class="timePicker">
            <DatePicker style="width: 190px;" format="yyyy/MM/dd" :options="options" :value="value" type="daterange" placement="bottom-end" placeholder="选择日期范围" @on-change="changeTime">
            </DatePicker>
          </div>
        </div>
      </div>
    </Row>
    <div class="rel">
      <div ref="echartEl" style="height:400px;"></div>
      <div class="chart-no-data" v-show="showNoData">
        <span>暂无统计数据</span>
      </div>
    </div>
    
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

      total:0,

      showNoData:false,

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
          data: ['活跃用户数', '新注册用户数'],
          top: 10,
        },
        xAxis: {
          type: 'category',
          name: '时间',
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
          name: '用户数量（个）'
        },
        series: [
          // {
          //   name: '机构个人用户',
          //   type: 'line',
          //   smooth: false,
          //   showAllSymbol: true,
          //   data: [],
          //   itemStyle: {
          //     normal: {
          //       color: '#5793f3'
          //     }
          //   }
          // }, {
          //   name: '独立个人用户',
          //   type: 'line',
          //   smooth: false,
          //   showAllSymbol: true,
          //   data: [],
          //   itemStyle: {
          //     normal: {
          //       color: '#ea7336'
          //     }
          //   }
          // },
          {
            name: '活跃用户数',
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
            name: '新注册用户数',
            type: 'line',
            smooth: false,
            showAllSymbol: true,
            data: [],
            itemStyle: {
              normal: {
                color: '#ea7336'
              }
            }
          }
        ]
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
      };
      myChart.showLoading();
      this.$http.get(this.ApiTransfer("/User/UserStatistic"), {
          params: this.ApiTransfer("/User/UserStatistic", paramsData)
        })
        .then((res) => {
          if (res.data.Success) {
            myChart.hideLoading();
            myChart.setOption({
              xAxis: {
                data: this.mapArrToArrByKey(res.data.Data, 'Key')
              },
              series: [
                {
                  name: '活跃用户数',
                  data: this.mapArrToArrByKey(res.data.Data, 'Value1')
                }, {
                  name: '新注册用户数',
                  data: this.mapArrToArrByKey(res.data.Data, 'Value2')
                }
              ]
            });

            if (res.data.Data.length!=0) {
              this.showNoData = false;
            }else{
              this.showNoData = true;
            }
            // this.total = res.data.Data.TotalAmount;
          }
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
}

</script>
<style lang="less">
.header-nav {
  overflow: hidden;
  >li {
    float: left;
    padding: 5px 10px;
    margin-right: 5px;
    font-size: 15px;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #edf1f5;
    &:hover {
      color: #2cabe3;
      border: 1px solid #2cabe3;
    }
  }
  .selected {
    border-color: #2cabe3;
  }
}

.statistic-col {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dddee1;
}

.active {
  color: #20a0ff;
}

.countClass {
  height: 50px;
  padding: 10px 10px 0;
  font-size: 16px;
  color: gray;
  width: 100%;
  border-bottom: 1px solid #dddee1;
}

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

</style>
