<template>
  <div class="statistic-col">
    <Row type="flex" justify="space-between">
      <div class="countClass">
        <div class="spanText">
          <span class="countTitle">组织类型统计</span>
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
    <div id="echart002" style="height:400px;"></div>
  </div>
</template>
<script>
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/pie');
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
        backgroundColor: '#fff', //设置整体背景色
        tooltip: {
          formatter: "{b} <br/> {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'center',
          data: [],
          selectedMode: false,
        },
        series: [{
          type: 'pie',
          radius: [0, '50%'],
          selectedMode: 'single',
          data: [],
          // roseType: 'angle',
          label: {
            normal: {
              // position: 'inner'
            }
          }, //设置说明文字位置
          labelLine: {
            normal: {
              // show: false,
            }
          }, //设置是否显示说明文字指示线 
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{d}%'
              },
            }
          },
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
      let myChart = echarts.init(document.getElementById('echart002'));
      // 绘制图表
      myChart.setOption(this.echartOption);
    },
    //获取内容授权数据
    getListData() {
      let myChart = echarts.getInstanceByDom(document.getElementById('echart002'));
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
              renderDatas.push({
                value: item.Value,
                name: item.Key,
                selected: true
              })
            });
            myChart.setOption({
              legend: {
                data: this.mapArrToArrByKey(renderDatas, 'name')
              },
              series: {
                data: renderDatas
              }
            })
          }

        })
    },
  },
  mounted() {
    this.drawLine();
    this.getListData();
    let myChart = echarts.getInstanceByDom(document.getElementById('echart002'));

    window.addEventListener("resize", function() {
      myChart.resize();
    });
  },
}

</script>
<style lang="less">
</style>
