<template>
  <div style="background:white">
    <div class="countClass">
     <span class="countTitle">成交量</span>
      <!-- <span class="countData">/总数量：
      <span class="countText">9999</span>
     </span> -->
      <div class="selectBox">
        <ul>
          <li v-for="(item, index) in items2" @click="clickFn1(item,index)">
            <span :class="item.isActive?'active':''">{{ item.text }}</span>
          </li>
        </ul>
        <strong @click="displayTime2"><Icon type="calendar"></Icon></strong>
         <div class="timePicker" v-show="flag2">
          <DatePicker 
          :value="value8"
          type="daterange" 
          format='yyyy/MM/dd'
          placement="bottom-end" 
          placeholder="选择日期" 
          style="width: 220px"
          class="pt5"
          @on-change="changeTime2">
          </DatePicker>
        </div>
      </div>
    </div>
    <div id="echart2" :style="{height:winHeight+'px'}"></div>
  </div>
</template>
<script>
import qs from 'qs'
   let echarts = require('echarts/lib/echarts');
   require('echarts/lib/chart/line');
   require('echarts/lib/component/tooltip')
   require('echarts/lib/component/title')
   export default {
     data(){
      return {
          flag2:false,
           items2: [
            {text: '最近七天', isActive: true},
            {text: '最近一月', isActive: false},
           ],
           items2: [
            {text: '最近七天', isActive: true},
            {text: '最近一月', isActive: false},
           ],
           value1:0,
           value8:'',
           
         winHeight:350,
         myChart2:null,
         echartOption:{
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
                data:['订单数量']
            },
            xAxis: 
                {
                    type: 'category',
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
            yAxis: 
                {
                    type: 'value',
                    data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                },
            series: [
                {
                    name:'',
                    type:'line',
                    smooth: true,
                    data: [5, 20, 36, 10, 10, 20]
                },
            ]
        }
      }
     },
     methods:{
      //改变时间
      changeTime2(){
            if(this.value8[0] != null){
                  this.items2.forEach((item,index)=>{
                       if(item.isActive == true){
                              item.isActive = false;
                       }
                  });
            }
      },
     
        clickFn1(item,index) {
            this.items2.forEach((item,index)=>{
                       item.isActive = false;
                    });
            item.isActive = true;
            this.value8 = []; 
            this.value1 = index;
            console.log(this.value1)
            var day = '';
            switch(this.value1){
                case 0:
                    day = 7;
                    break;
                case 1:
                    day = 30;
                    break;
                // default:
                //     break;
          }
          this.getTime(day);
        },
        getTime(day){
              var date = new Date();
              var newTime = date.getTime();
              var time = day*24*60*60*1000;
              var oldTime = newTime - time;

              this.startTime = date;//开始时间
              console.log(this.startTime);
              this.endTime = new Date(oldTime);//结束时间
              console.log(this.endTime);
        },
        getFirstTime(){
              var day = 7;
              var date = new Date();
              var newTime = date.getTime();
              var time = day*24*60*60*1000;
              var oldTime = newTime - time;

              this.startTime = date;//开始时间
              console.log(this.startTime);
              this.endTime = new Date(oldTime);//结束时间
              console.log(this.endTime);
        },
        drawLine() {
            //内容授权统计
            // 基于准备好的dom，初始化echarts实例
            this.myChart2 = echarts.init(document.getElementById('echart2'));
            // 绘制图表
            this.myChart2.setOption(this.echartOption);
          },
          //获取内容授权数据1
          getDateAuthorityView(){
                this.startTime=this.value8[1];
                this.endTime=this.value8[0];
               
              var paramsData = {};
                      paramsData ={
                        startTime:this.endTime,
                       endTime:this.startTime,
                }
                console.log(paramsData)
                this.axios.post('/Report/AuthorizeChartData',
                               combineData(paramsData)
                      )
                .then((res)=>{
                      console.log(res);
                      this.myChart2.setOption({
                         xAxis:{
                          data: res.data.DateTime.map(item=>item)
                         },
                         series:{
                          data:res.data.Vol.map(item=>item)
                         }
                      })
                })
        },
        getAuthorityView(){
          var paramsData = {};
          paramsData ={
            startTime:this.endTime,
            endTime:this.startTime,
          }
            console.log(paramsData)

            this.axios.post('/Report/AuthorizeChartData',
                           combineData(paramsData)
                  )
            .then((res)=>{
                  console.log(res);
                  this.myChart2.setOption({
                     xAxis:{
                      data: res.data.DateTime.map(item=>item)
                     },
                     series:{
                      data:res.data.Vol.map(item=>item)
                     }
                  })
            })

        },
          //显示隐藏日历
          displayTime2(){
                if(this.flag2){
                      this.flag2 = false;
                }else{
                      this.flag2 = true;
                }
          }, 
     },
     mounted(){
          // this.getFirstTime();
          // this.getAuthorityView();
          // this.getDealData();
          this.drawLine();
           var _this = this;
           window.addEventListener("resize", function () {
                   _this.myChart2.resize();
                   // _this.myChart2.resize();
            });
     },
     // watch:{
     //      value1:function(val,oldVal){
     //            this.getAuthorityView();
     //      },
     //      value2:function(val,oldVal){
     //           this.getDealData();
     //      },
         
     //      value8:function(val,oldVal){
     //          if(val != ''){
     //                 this.getDateAuthorityView();
     //          }else{
     //                this.getAuthorityView();
     //          }
     //      },
     //      value8:function(val,oldVal){
     //            if(val != ''){
     //                 this.getDateDealData();
     //            }else{
     //                  this.getDealData();
     //            }
     //      },
     // }
   }
</script>
<style lang="less" scoped>
.active{
  color: #20a0ff;
}
 .row-bg {
    margin-top: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .col{
      border: 1px solid #dfe6ec;
      border-radius: 5px;
      .countClass{
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: gray;
        .countData{
          font-size: 14px;
          margin-left: 5px;
          .countText{
            margin-left:0;
          }
        }
        .countTitle{
          font-size: 18px;
          font-weight: bold;
          margin: 20px 0 0 10px;
        }
        /* border-bottom: 1px solid #ddd; */
        .selectBox{
          float: right;
                position: relative;
            ul{
                 width: 206px;
                 /* height: 40px; */
                 margin: 5px 0 0 0;
                 li{
                  float: left;
                  font-size: 14px;
                  width: 80px;
                  cursor: pointer;
                  span{
                    margin: 0;
                  }
                 }
            }
            li:nth-child(2){
                margin-right:10px;
            }
            strong{
                   margin: 10px 10px 0 0;
                   cursor:pointer;
                 }
             .timePicker{
              float: right;
              position: absolute;
              top: 7px;
              right: 40px;
              .el-date-editor--daterange.el-input{
                width: 208px;
              }
            } 
        } 
      }
    }
  }

</style>
