<template>
  <div class="content-statistics">
    <h3>内容导入统计 <span style="font-size: 15px;margin-left: 7px;">/总数量：{{Count}}</span>
      <p class="p1-right">
        <span @click="changeTime(1)">最近7天</span>&nbsp;
        <span @click="changeTime(2)">最近一月</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <DatePicker
          :open="openDate"
          :value="dateValue"
          confirm
          placement="bottom-end"
          type="daterange"
          format='yyyy/MM/dd'
          :options="dateOptions"
          @on-change="handleChange"
          @on-clear="openDate = false"
          @on-ok="handleOk">
          <a href="javascript:void(0)" @click="openDate=!openDate">
              <Icon style="font-size: 24px;color:#333;" type="ios-calendar-outline"></Icon>
              <!-- <template v-if="dateValue === ''">选择日期</template> -->
              <!-- <template v-else>{{ dateValue }}</template> -->
          </a>
      </DatePicker>
      </p>
    </h3>
    <div id="main" ref="main" style="width: 480px;height:434px;"></div>
  </div>
</template>
<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入折线图
require('echarts/lib/chart/line')
require('echarts/lib/chart/lines')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/toolbox')
export default {
  data() {
    return {
      startTime: "",
      endTime: "",
      openDate: false,
      dateValue: '',
      timeLong: "-6",
      Count: '999',
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      option: { // 指定图表的配置项和数据
        tooltip: {},
        legend: {
          data: ['内容导入数量']
        },
        xAxis: {
          // name:"日期",
          position: 'bottom',
          nameRotate: 60,
          data: ["2017-08-23", "2017-08-24", "2017-08-25", "2017-08-26", "2017-08-27"],
          axisLabel: {
            name: "日期",
            rotate: 20, //刻度旋转45度角
            margin: 15,
            // interval:7,
          },
          axisTick: {
            interval: 0
          }
        },
        yAxis: {
          name: "数量",
        },
        series: [{
          name: '导入数量',
          type: 'line',
          data: [5, 20, 36, 10, 10]
        }]
      }
    }
  },
  props: ['propWidth'],
  mounted() {
    this.initEchart();
    this.changeTime(1)
  },
  methods: {
    //请求数据
    getData() {
      this.$http.post("/Report/ContentImportData", {
          startTime: this.startTime,
          endTime: this.endTime
        })
        .then((res) => {
          if (res.status == 200) {
            this.option.xAxis.data = res.data.DateTime
            this.option.series[0].data = res.data.Vol
            this.Count = res.data.Count
            this.initEchart()
          }
        })
    },
    // 初始化表格
    initEchart() {
      var myEcharts = echarts.init(this.$refs.main);
      myEcharts.setOption(this.option);
    },
    goPath(path) {
      this.$router.push(path);
    },
    //得到最近7天和最近一月的时间段
    changeTime(index) {
      if (index == 1) {
        this.timeLong = -6;
      } else if (index == 2) {
        //判断上月有多少天
        var d = new Date();
        var lastMonthDays = new Date(d.getFullYear(), (d.getMonth()), 0).getDate();
        this.timeLong = -(lastMonthDays - 1);
      }

      this.endTime = new Date().toLocaleString().split(" ")[0].replace(/\//g, "-");
      this.startTime = this.addDate(this.endTime, this.timeLong)

      this.getData();
    },
    //得到最近7天和最近一月的起始时间
    addDate(date, days) {
      var d = new Date(date);
      d.setDate(d.getDate() + days);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var val = d.getFullYear() + "-" + month + "-" + day;
      return val;
    },
    handleChange(date) {
      this.dateValue = date;
    },
    handleOk() {
      this.openDate = false;
      this.startTime = this.dateValue[0];
      this.endTime = this.dateValue[1];
      this.getData();
    }
  },
  watch: {
    propWidth(val) {
      this.$refs.main.style.width = (val - 55) + 'px'
      this.initEchart();
    }
  }
}

</script>
<style lang="less">
.content-statistics {
  h3 {
    padding-bottom: 8px;
    border-bottom: 1px solid #999;
    font-size: 18px;
  }

  .p1-right {
    height: 36px;
    line-height: 30px;
    float: right;
    font-size: 16px;
    font-weight: 500;
    overflow: hidden;
    position: relative;

    span {
      cursor: pointer;
    }
  }
  .ivu-date-picker {
    position: absolute;
    top: 3px;
    right: 0;
    width: 22px;
    height: 24px;
  }
  .ivu-icon-ios-calendar-outline {}

  .ivu-table-wrapper {
    border: none;
    margin-top: 10px;
  }

  #main {
    border: none;
    margin-left: 0;
    padding: 0;
  }
}

</style>
