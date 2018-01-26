<template>
  <div style="background:white">
    <div class="countClass">
      <span class="countTitle">资源总量</span>
      <div class="selectBox">
        <Select v-model="defaultStatus" @on-change="statusChange">
          <Option v-for="item in options" :label="item.label" :value="item.value" :key="item.value">
          </Option>
        </Select>
      </div>
    </div>
    <div id="echart18" :style="{height:winHeight+'px'}"></div>
  </div>
</template>
<script>
import qs from 'qs'
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/pie');
require('echarts/lib/component/legend');
require('echarts/lib/component/title')
export default {
  data() {
    return {
      options: [{
        value: -1,
        label: '全部'
      }, {
        value: 30,
        label: '30天内'
      }, {
        value: 7,
        label: '7天内'
      }, {
        value: 1,
        label: '今天'
      }],
      defaultStatus: -1,

      startTime: '',
      endTime: '',

      winHeight: 350,
      myChart7: null,
      echartOption: {
        backgroundColor: '#fff', //设置整体背景色
         tooltip : {
          formatter: "{b} <br/> {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'center',
          data: [],
          selectedMode:false,
        },
        series: [{
          type: 'pie',
          radius: [0, '70%'],
          selectedMode: 'single',
          data: [
          ],
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
      let myChart = echarts.init(document.getElementById('echart18'));
      // 绘制图表
      myChart.setOption(this.echartOption);
    },
    //获取内容授权数据
    getListData() {
      let myChart = echarts.getInstanceByDom(document.getElementById('echart18'));
      myChart.showLoading();
      this.$http.get(this.ApiTransfer("/Content/GetCountByObjectType"), {
          params: this.ApiTransfer("/Content/GetCountByObjectType", {
            startTime: this.startTime,
            endTime: this.endTime
          })
        })
        .then((res) => {
          if (res.data.Success) {
            myChart.hideLoading();
            let renderDatas = [];
            res.data.Data.forEach((item,index)=>{
              renderDatas.push({
                value:item.Value,
                name:item.Key,
                selected:true
              })
            });
            myChart.setOption({
              legend: {
                data: this.mapArrToArrByKey(renderDatas,'name')
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
    let myChart = echarts.getInstanceByDom(document.getElementById('echart18'));

    window.addEventListener("resize", function() {
      myChart.resize();
    });
  },
  watch: {}
}

</script>
<style lang="less" scoped>
.active {
  color: #20a0ff;
}

.row-bg {
  margin-top: 20px;
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
