<template>
  <div class="statistic-col">
    <Row type="flex" justify="space-between">
      <div class="countClass ">
        <div class="spanText">
          <span class="countTitle">智书阅读排行统计<span class="count-sub-title">/总数量：999999</span></span>
        </div>
        <div class="sale-count-change">
          <ul class="quick-time">
            <li v-for="(item, index) in quickTimes" @click="clickFn1(item,index)">
              <span :class="item.isActive?'active':''">{{ item.text }}</span>
            </li>
          </ul>
          <div class="timePicker">
            <DatePicker :options="options" :value="value" type="daterange" placement="bottom-end" placeholder="选择日期范围" @on-change="changeTime" >
            </DatePicker>
          </div>
        </div>
      </div>
    </Row>
    <div id="echart005" style="height:400px;"></div>
  </div>
</template>
<script>
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
          data: [],
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
        series: [{
          type: 'line',
          smooth: false,
          showAllSymbol: true,
          data: [],
          itemStyle: {
            normal: {
              color: '#5793f3'
            }
          }
        }]
      }
    }
  },
  created() {
    // this.initTime();
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
      let myChart = echarts.init(document.getElementById('echart005'));
      // 绘制图表
      myChart.setOption(this.echartOption);
    },
    //获取内容授权数据
    getListData() {
      let myChart = echarts.getInstanceByDom(document.getElementById('echart005'));
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
              series: [{
                data: this.mapArrToArrByKey(res.data.Data, 'Value1')
              }]
            });
            this.totalMount = res.data.Data.TotalAmount;
          }
        })
    },
  },
  mounted() {
    this.drawLine();
    this.getListData();
    let myChart = echarts.getInstanceByDom(document.getElementById('echart005'));

    window.addEventListener("resize", function() {
      myChart.resize();
    });
  },
}

</script>
<style lang="less">
</style>
