<template>
  <div class="type-echart">
    <div class="system-title">
      <Icon type="ios-crop-strong" size="27"></Icon>
      <span>分类体系管理 &gt;</span>
      <span class="other-color">分类统计报表</span>
    </div>
    <div class="type-echat-content">
      <h3 class="title">统计报表</h3>
      <div style="padding: 10px;">
        <h3 style="line-height: 40px;">增加分类数量统计&nbsp;&nbsp;&nbsp;
          <span style="font-size: 16px;font-weight: 400">/ &nbsp;总数量：{{Count}}</span>
          <p class="p1-right">
            <span @click="changeTime(1)" :class="clickIndex==1?'show-blue':''">最近7天</span>&nbsp;
            <span @click="changeTime(2)" :class="clickIndex==2?'show-blue':''">最近一月</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <DatePicker :value="dataValue" 
            type="daterange" 
            placement="bottom-end" 
            placeholder="选择日期"
            confirm  
            @on-change="handleChange"
            :options="dateOptions"
            @on-ok="handleOk(1)"
            style="width: 240px">
          </DatePicker>
          </p>
        </h3>

        <div ref="main" style="width: 100%;height:480px;margin:0 auto"></div>
      </div>
      
    </div>
  </div>
</template>
<script>

  // 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入折线图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/toolbox')
export default {
  data() {
    return {
      startTime:"",
      endTime:"",
      dataValue: [],
      timeLong:"-6",
      Count:'999',
      dateOptions:{
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      },
      clickIndex:0,
      option:{  // 指定图表的配置项和数据
       tooltip: {
          trigger: 'axis',
        },
        legend: {
            data:['分类数量']
        },
        xAxis: {
          name:"日期",
          position:'bottom',
          boundaryGap: false,
          data: ["2017-08-23","2017-08-24","2017-08-25","2017-08-26","2017-08-27"],
          axisLabel:{
            name:"日期",
            // rotate:20, //刻度旋转45度角
            margin :15,
            // interval:7,
          },
          axisTick:{
            interval :0
          }
        },
        yAxis: {
           name:"数量",
        },
        series: [{
            name: '分类数量',
            type: 'line',
            data: [5, 20, 36, 10, 10]
        }]
      }

    }
  },
  mounted() {
    this.changeTime(1)
    this.initEchart();
    console.log(this.dataValue )
  },
  methods: {
    // 初始化表格
    initEchart(){
      var myEcharts = echarts.init(this.$refs.main);
      myEcharts.setOption(this.option);
    },
    getData() {
       this.$http.post("/Report/CategoryData", {
          startTime: this.startTime,
          endTime: this.endTime,
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
    //得到最近7天和最近一月的时间段
    changeTime(index){
      this.dataValue = [];
      this.clickIndex = index;
      if(index==1){
        this.timeLong = -6;
      }else if(index==2){
        //判断上月有多少天
        var d = new Date();
        var lastMonthDays = new Date(d.getFullYear(), (d.getMonth()), 0).getDate();
        this.timeLong = -(lastMonthDays-1);
      }

      this.endTime = new Date().toLocaleString().split(" ")[0].replace(/\//g,"-");
      this.startTime = this.addDate(this.endTime,this.timeLong)
      this.getData();
    },
    //得到最近7天和最近一月的起始时间
    addDate(date,days){ 
      var d=new Date(date); 
      d.setDate(d.getDate()+days); 
      var month=d.getMonth()+1; 
      var day = d.getDate(); 
      if(month<10){ 
        month = "0"+month; 
      } 
      if(day<10){ 
        day = "0"+day; 
      } 
      var val = d.getFullYear()+"-"+month+"-"+day; 
      return val; 
    },
    //得到日期
    handleChange(date) {
      this.dateValue = date;
    },
    handleOk(isimport){
      this.clickIndex = 0;
      this.startTime = this.dateValue[0];
      this.endTime = this.dateValue[1];
      this.getData();
    }
  }
}

</script>
<style lang="less">
.type-echart {
  width: 100%;
  min-height: 600px;

  .type-echat-content {
    margin-top: 25px;
    background-color: #ddd;
    border-radius: 5px;
    padding: 10px;
  }

  .show-blue{
    color:#5c9acf;
  }

  .title {
    line-height: 40px;
    border-bottom: 1px solid #999;
  }

  .p1-right{
    width: 400px;
    float: right;
    font-size: 16px;
    font-weight: 500;
    position: relative;

     span{
      cursor: pointer;
     }
   }

  .ivu-date-picker{
    position: absolute;
    top:3px;
    right:0;
    width: 22px;
    height: 24px;
  }

}

</style>
