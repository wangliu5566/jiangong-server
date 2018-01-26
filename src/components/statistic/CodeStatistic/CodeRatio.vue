<template>
  <div class="statistic-col">
    <Row type="flex" justify="space-between">
      <div class="countClass">
        <div class="spanText">
          <span class="countTitle">机构验证码使用状态统计</span>
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
    <div id="echart0099" style="height:400px;"></div>
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
      let myChart = echarts.init(document.getElementById('echart0099'));
      // 绘制图表
      myChart.setOption(this.echartOption);
    },
    //获取内容授权数据
    getListData() {
      let myChart = echarts.getInstanceByDom(document.getElementById('echart0099'));
      myChart.showLoading();
      this.$http.get(this.ApiTransfer("/Content/GetCountByObjectType"), {
          params:this.ApiTransfer("/Content/GetCountByObjectType", {
            startTime: this.startTime,
            endTime: this.endTime
          })
        })
        .then((res) => {
          if (res.data.Success) {
            myChart.hideLoading();
            let renderDatas = [];
            res.data.Data.forEach((item, index) => {
              renderDatas.push(item.Value)
            });
            myChart.setOption({
              series: {
                data: renderDatas
              },
              yAxis:{
                data:['未使用','已使用']
              }
            })
          }

        })
    },
  },
  mounted() {
    this.drawLine();
    this.getListData();
    let myChart = echarts.getInstanceByDom(document.getElementById('echart0099'));

    window.addEventListener("resize", function() {
      myChart.resize();
    });
  },
}

</script>
<style lang="less">
</style>
