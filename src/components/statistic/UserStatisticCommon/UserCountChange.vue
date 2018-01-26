<template>
  <div class="statistic-col">
    <Row type="flex" justify="space-between">
      <div class="countClass">
        <div class="spanText">
          <span class="countTitle">用户画像分析</span>
        </div>
        <div class="sale-count-change">
          <ul class="quick-time">
            <li v-for="(item, index) in quickTimes" @click="clickFn1(item,index)">
              <span :class="item.isActive?'active':''">{{ item.text }}</span>
            </li>
          </ul>
          <div class="timePicker">
            <DatePicker style="width:190px;" format="yyyy/MM/dd" :options="options" :value="value" type="daterange" placement="bottom-end" placeholder="选择日期范围" @on-change="changeTime">
            </DatePicker>
          </div>
        </div>
        <div class="condition-select">
          <span>
            类型：
          </span>
          <span>
            <Select v-model="type" style="width:80px" @on-change='typeChange'>
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </span>
        </div>
      </div>
    </Row>
    <div class="rel">
      <div ref="chartEl" style="height:400px;"></div>
      <div class="chart-no-data" v-show="showNoData">
        <span>暂无统计数据</span>
      </div>
    </div>
    
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
      type: '1',

      quickTimes: [
        { text: '最近7天', isActive: true, value: 7 },
      ],

      showNoData:false,

      typeList: [{
        value: '1',
        label: '年龄',
      }, {
        value: '2',
        label: '职业',
      }, {
        value: '3',
        label: '学历',
      }, {
        value: '4',
        label: '兴趣',
      }, {
        value: '5',
        label: '领域',
      }],

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
          data: []
        },
        xAxis: {
          type: 'category',
          name: '',
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
          name: '时长(小时)'
        },
        series: [{
          type: 'line',
          name:'时长',
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

    this.initTime();

  },
  methods: {
    initTime() {
      this.quickTimes.forEach((item, index) => {
        if (item.isActive == true) {
          let dataRange = this.calculateDate(item.value);
          this.startTime = dataRange[0];
          this.endTime = dataRange[1];
        }
      })

    },

    //产品变化
    productChange(value) {
      this.getAuthorityView();
    },

    typeChange() {
      this.getAuthorityView();
    },

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
        this.getAuthorityView();
      } else {
        this.quickTimes.forEach((item, index) => {
          item.isActive = false;
        })
        this.getDateAuthorityView();
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
      this.getAuthorityView();
    },

    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = echarts.init(this.$refs.chartEl);
      // 绘制图表
      myChart1.setOption(this.echartOption);
    },
    //获取内容授权数据1
    getDateAuthorityView() {
      this.startTime = this.value[0];
      this.endTime = this.value[1];
      this.getAuthorityView();
    },
    getAuthorityView() {
      let myChart = echarts.getInstanceByDom(this.$refs.chartEl);
      var paramsData = {};
      paramsData = {
        startTime: this.startTime,
        endTime: this.endTime,
        type: this.type
      };
      myChart.showLoading();
      this.$http.get(this.ApiTransfer("/User/UserPortraitAnalysisStatistic"), {
          params: this.ApiTransfer("/User/UserPortraitAnalysisStatistic", paramsData)
        })
        .then((res) => {
          if (res.data.Success) {
            myChart.hideLoading();
            let typeList = ['年龄', '职业', '学历', '兴趣', '领域'];
              myChart.setOption({
                xAxis: {
                  name: typeList[this.type-1],
                  data: this.mapArrToArrByKey(res.data.Data, 'Key')
                },
                series: [{
                  data: this.mapArrToArrByKey(res.data.Data, 'Value')
                }]
              });
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

    this.getAuthorityView();

    let myChart = echarts.getInstanceByDom(this.$refs.chartEl);

    window.addEventListener("resize", function() {
      myChart.resize();
    });
  },

}

</script>
<style lang="less">


</style>
