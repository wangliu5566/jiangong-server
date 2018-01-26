<template>
  <div style="background:white">
    <div class="countClass">
      <span class="countTitle">用户数量统计</span>
      <div class="selectBox">
        <Select v-model="defaultStatus" @on-change="statusChange">
          <Option v-for="item in options" :label="item.label" :value="item.value" :key="item.value">
          </Option>
        </Select>
      </div>
    </div>
    <div id="echart20" :style="{height:winHeight+'px'}"></div>
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
      options: [{
        value: 30,
        label: '30天内'
      }, {
        value: 7,
        label: '7天内'
      }, {
        value: 1,
        label: '今天'
      }],
      defaultStatus: 30,

      winHeight: 350,
      myChart4: null,
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
          left: 'right',
          top: 'center',
          orient: 'vertical',
          data: ['机构用户总数', '独立用户总数']
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
          name: '数量（个）'
        },
        series: [{
          name: '机构用户总数',
          type: 'line',
          smooth: false,
          itemStyle: {
              normal: {
                color: '#0099ff',
              },
            },
          showAllSymbol: true,
          data: []
        }, {
          name: '独立用户总数',
          type: 'line',
          smooth: false,
          itemStyle: {
              normal: {
                color: '#ff0000',
              },
            },
          showAllSymbol: true,
          data: []
        }, ]
      }
    }
  },
  created() {
    this.initTime();
  },
  methods: {
    statusChange() {
      this.initTime();
      this.getListData();
    },
    initTime() {
      let dataRange = this.calculateDate(this.defaultStatus);
      this.startTime = dataRange[0];
      this.endTime = dataRange[1];
    },
    drawLine() {
      //内容授权统计
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('echart20'));
      // 绘制图表
      myChart.setOption(this.echartOption);
    },
    //获取内容授权数据
    getListData() {
      let myChart = echarts.getInstanceByDom(document.getElementById('echart20'));
      var paramsData = {};
      paramsData = {
        startTime: this.startTime,
        endTime: this.endTime,
      }
      myChart.showLoading();
      this.$http.get(this.ApiTransfer("/User/UserAndOrganizationStatistic"), {
          params: this.ApiTransfer("/User/UserAndOrganizationStatistic", paramsData)
        })
        .then((res) => {
          myChart.hideLoading();
          myChart.setOption({
            xAxis: {
              data: this.mapArrToArrByKey(res.data.Data, 'Key')
            },
            series: [{
              name:'机构用户数',
              data: this.mapArrToArrByKey(res.data.Data, 'Value1')
            },{
              name:'独立用户数',
              data: this.mapArrToArrByKey(res.data.Data, 'Value2')
            }]
          })
        })
    },
  },
  mounted() {
    this.drawLine();
    this.getListData();

    let myChart = echarts.getInstanceByDom(document.getElementById('echart20'));

    window.addEventListener("resize", function() {
      myChart.resize();
    });
  },
  watch: {
    value5: function(val, oldVal) {
      this.getListData();
    }
  }
}

</script>
<style lang="less" scoped>
.active {
  color: #20a0ff;
}

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
      /* border-bottom: 1px solid #ddd; */
      .selectBox {
        width: 120px;
        margin-right: 10px;
        float: right;
      }
    }
  }
}

</style>
