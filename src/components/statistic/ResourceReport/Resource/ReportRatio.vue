<template>
  <div class="statistic-col">
    <Row type="flex" justify="space-between">
      <div class="countClass">
        <div class="spanText">
          <span class="countTitle">入库成功/异常统计</span>
        </div>
        <div class="sale-count-change">
          <ul class="quick-time">
            <li v-for="(item, index) in quickTimes" @click="clickFn1(item,index)">
              <span :class="item.isActive?'active':''">{{ item.text }}</span>
            </li>
          </ul>
          <div class="timePicker">
            <DatePicker style="width:190px;" format="yyyy/MM/dd" :options="options" :value="value" type="daterange" placement="bottom-end" placeholder="选择日期范围" @on-change="changeTime" >
            </DatePicker>
          </div>
        </div>
      </div>
    </Row>
    <div class="rel">
      <div ref="chartEl" style="height:500px;"></div>
      <div class="chart-no-data" v-show="showNoData">
        <span>暂无统计数据</span>
      </div>
    </div>
    
  </div>
</template>
<script>
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/component/legend');
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

      showNoData:false,

      echartOption: {
        // color: ['#5793f3'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              backgroundColor: '#6a7985',
              precision: 0,
            }
          }
        },
        legend: {
          data: ['机构订单金额', '个人订单金额'],
          x: 'center',
          y: 'top',
        },
        yAxis: {
          type: 'category',
          name: '类型',
          axisTick: {
            alignWithLabel: true
          },
          axisPointer: {
            label: {}
          },
          data: []
        },
        xAxis: {
          type: 'value',
          name: '数量',
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#d14a61'
            }
          },
        },
        series: [{
          type: 'bar',
          barWidth: '30%',
          smooth: true,
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
      let myChart = echarts.init(this.$refs.chartEl);
      // 绘制图表
      myChart.setOption(this.echartOption);
    },
    //获取内容授权数据
    getListData() {
      let myChart = echarts.getInstanceByDom(this.$refs.chartEl);
      myChart.showLoading();
      this.$http.get(this.ApiTransfer("/Report/ResourceExceptionStatisticsByDate"), {
          params:this.ApiTransfer("/Report/ResourceExceptionStatisticsByDate", {
            startTime: this.startTime,
            endTime: this.endTime
          })
        })
        .then((res) => {
          if (res.data.Success) {
            myChart.hideLoading();
            let renderDatas = [];

            myChart.setOption({
              series: {
                data: this.mapArrToArrByKey(res.data.Data,'Value').reverse()
              },
              yAxis:{
                data:this.mapArrToArrByKey(res.data.Data,'Key').reverse()
              }
            })

            if (res.data.Data.length!=0) {
              this.showNoData = false;
            }else{
              this.showNoData = true;
            }
          }

        })
    },
  },
  mounted() {
    this.drawLine();
    this.getListData();
    let myChart = echarts.getInstanceByDom(this.$refs.chartEl);

    window.addEventListener("resize", function() {
      myChart.resize();
    });
  },
}

</script>
<style lang="less">
</style>
