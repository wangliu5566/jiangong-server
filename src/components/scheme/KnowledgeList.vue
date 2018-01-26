<template>
  <div class="bg-knowledge-list">
    <div class="system-title">
      <Icon type="ios-copy-outline" size="27"></Icon>
      <span @click="goIndex('/wrap/scheme/knowWarp')" style="cursor: pointer">知识体系管理 &gt;</span>
      <span class="other-color">知识元列表</span>
      <Button v-if="isShoWCallbackBtn" type="primary" style='float:right;margin-right:20px' @click="callbackLastPage">返回</Button>
    </div>
    <div class="btn-line">
      <Input v-model="value4" icon="ios-search" placeholder="请输入知识元名称" style="width: 300px;float: right" @on-click="getkeyWordList()" @on-enter="getkeyWordList()"></Input>
    </div>
    <div>
      <Table border :loading="loading" :columns="columns2" :data="knowledgeTypeList"></Table>
    </div>
    <div class="page">
      <Page :total="parseInt(totalCount)" :current="parseInt(page)" :page-size="pageSize" size="small" show-elevator  show-total show-sizer @on-page-size-change='changeSize' @on-change="change"></Page>
    </div>
    <!--    详情模态框    -->
    <Modal v-model="showDetailModal" :mask-closable="false" id="knowledgeModal" width="730" :styles="{top: '30px'}">
      <p slot="header" style="text-align:center;color:#333;">知识元简介</p>
      <Form :model="detailObj" :label-width="90">
        <FormItem label="知识名称:">
          <Input v-model="detailObj.Title" disabled></Input>
        </FormItem>
        <FormItem label="参考资料:">
          <Input v-model="detailObj.Source" disabled></Input>
        </FormItem>
        <Row>
          <Col span="24">
          <FormItem label="知识元简介:">
            <Input v-model="detailObj.Abstracts" disabled type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem label="知识地图:">
            <div id="main" ref="main" style="width: 600px;height:420px;"></div>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入饼图
require('echarts/lib/chart/graph')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/toolbox')
export default {
  data() {
    return {
      loading: false,
      value4: "",
      oldkeyWord:"",
      totalCount: 0,
      page: "1",
      pageSize: 10,
      showDetailModal: false,
      isShoWCallbackBtn:false,

      columns2: [{
        title: '编号',
        key: 'Id',
        width: 120,
      }, {
        title: '知识元名称',
        key: 'Title',
        ellipsis: true,
        render: (h, params) => {
          if (!!params.row.Title && params.row.Title.length > 13) {
            return h('div', [
              h("Tooltip", {
                props: {
                  trigger: "hover",
                  content: params.row.Title ? params.row.Title : "-",
                  placement: "top-start"
                },
                style: {
                  width: '100%',
                  textOverflow: 'ellipsis'
                }
              }, params.row.Title ? params.row.Title : "-")
            ])
          } else {
            return h('div', [
              h("span", params.row.Title ? params.row.Title : "-")
            ])
          }
        }
      }, {
        title: '参考资料',
        key: 'Source',
        width: 200,
        ellipsis: true,
        render: (h, params) => {
          if (!!params.row.Source && params.row.Source.length > 12) {
            return h('div', [
              h("Tooltip", {
                props: {
                  trigger: "hover",
                  content: params.row.Source ? params.row.Source : "-",
                  placement: "top-start"
                },
                style: {
                  width: '100%',
                  textOverflow: 'ellipsis'
                }
              }, params.row.Source ? params.row.Source : "-")
            ])
          } else {
            return h('div', [
              h("span", params.row.Source ? params.row.Source : "-")
            ])
          }
        }
      }, {
        title: '简介',
        key: 'Abstracts',
        ellipsis: true,
        render: (h, params) => {
          if (!!params.row.Abstracts && params.row.Abstracts.length > 15) {
            return h('div', [
              h("Tooltip", {
                props: {
                  trigger: "hover",
                  content: params.row.Abstracts ? params.row.Abstracts : "-",
                  placement: "top-start"
                },
                style: {
                  width: '100%',
                  textOverflow: 'ellipsis'
                }
              }, params.row.Abstracts ? params.row.Abstracts : "-")
            ])
          } else {
            return h('div', [
              h("span", params.row.Abstracts ? params.row.Abstracts : "-")
            ])
          }
        }
      }, {
        title: '操作',
        key: 'action',
        width: 110,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.showKnowledgeDetail(params.row.Id, params.index)
                }
              }
            }, '查看详情'),
          ]);
        }
      }],
      knowledgeTypeList: [],
      detailObj: {},
      //饼图力导向布局图
      optionPie: {
        title: {
          text: '',
          x: 'center'
        },
        tooltip: {
          show: true, //默认显示
          showContent: true, //是否显示提示框浮层
          trigger: 'item', //触发类型，默认数据项触发
          triggerOn: 'mousemove', //提示触发条件，mousemove鼠标移至触发，还有click点击触发
          confine: false, //是否将 tooltip 框限制在图表的区域内。
          transitionDuration: 0.4, //提示框浮层的移动动画过渡时间，
        },
        series: [{
          type: 'graph', //关系图
          name: '指示图',
          edgeSymbol: ['arrow'],
          edgeSymbolSize: 10,
          layout: 'force', //图的布局，类型为力导图，'circular' 采用环形布局，
          legendHoverLink: true, //是否启用图例 hover(悬停) 时的联动高亮。
          hoverAnimation: true, //是否开启鼠标悬停节点的显示动画
          force: { //力引导图基本配置
            repulsion: 100, //节点之间的斥力因子。
            gravity: 0.02, //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢
            edgeLength: 150, //边的两个节点之间的距离，
            layoutAnimation: true
            //因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死  
          },
          roam: true, //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          draggable: true, //节点是否可拖拽，只在使用力引导布局的时候有用。
          focusNodeAdjacency: false, //是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
          edgeSymbolSize: 15, //边两端的标记大小，可以是一个数组分别指定两端，也可以是单个统一指定。
          itemStyle: { //图形样式
            normal: { //默认样式
              label: {
                show: true
              },
              // color:'#2cabe3',
              borderType: 'solid', //图形描边类型，默认为实线， 
              opacity: 1,
              color: '#ff6a6a',
              borderColor: '#e82d2d',
              borderWidth: 4
            },
          },
          symbolSize: 80, //每个知识元大小
          lineStyle: { //==========关系边的公用线条样式。
            normal: {
              width: '2',
              type: 'solid', //线的类型 
              curveness: 0, //线条的曲线程度，从0到1
              opacity: 0.7,

            },
          },
          label: { //=============图形上的文本标签
            normal: {
              show: true, //是否显示标签。
              position: 'inside', //标签的位置。['50%', '50%'] [x,y]
              textStyle: { //标签的字体样式
                color: '#000', //字体颜色
                fontStyle: 'normal', //文字字体的风格 
                fontSize: 13, //字体大小
              },
              formatter: function(val) { //让series 中的文字进行换行 
                if (val.name.length != 0 && val.name.length > 5) {
                  if (val.name.length <= 10) {
                    return val.name.slice(0, 4) + '\n' + val.name.slice(5, val.name.length)
                  } else {
                    return val.name.slice(0, 4) + '\n' + val.name.slice(5, 9) + '...'
                  }
                } else {
                  return val.name;
                }
              },
            },
          },
          //name:影响图形标签显示,value:影响选中后值得显示,category:所在类目的index,symbol:类目节点标记图形,
          data: [],
          categories: [{
            symbol: 'circle',
          }], //symbol name：用于和 legend 对应以及格式化 tooltip 的内容。 label有效
          links: [] //edges是其别名代表节点间的关系数据。
        }],
      },

      //关系图样式列表
      echartStyleList: [{
        normal: { //0层样式
          label: {
            show: true
          },
          color: '#7ec7e3',
          borderColor: '#54a5c1',
          borderWidth: 4
        }
      }, {
        normal: { //1层样式
          label: {
            show: true
          },
          color: '#b5c7cf',
          borderColor: '#83a1ad',
          borderWidth: 4
        }
      }, {
        normal: { //3层样式
          label: {
            show: true
          },
          color: '#ca8622',
          borderColor: '#d48265',
          borderWidth: 4
        }
      }, {
        normal: { //2层样式
          label: {
            show: true
          },
          color: '#ff6a6a',
          borderColor: '#e82d2d',
          borderWidth: 4
        }
      }]
    }
  },
  mounted() {
    console.log(this.$route.query.categoryIds)
    if(!!this.$route.query.categoryIds){
      this.isShoWCallbackBtn = true;
    }
    this.getlist();
    this.initEchart();

  },
  methods: {
    callbackLastPage(){
      history.go(-1)
    },
    initEchart() {
      var myEcharts = echarts.init(this.$refs.main);
      myEcharts.setOption(this.optionPie);
    },
     /**
     * [getkeyWordList 搜索关键字]
     * @Author   赵雯欣
     * @DateTime 2017-12-13
     * @return   {[type]}   [description]
     */
    getkeyWordList() {
      if (this.oldkeyWord ==this.value4.trim()&&this.value4.trim() == '') {
        this.$Message.warning('请输入知识元名称')
        return false;
      }
      this.page=1;
      this.loading = true;
      this.$http.get(this.ApiTransfer("/ExplicitWord/Search"), {
          params: this.ApiTransfer("/ExplicitWord/Search", {
            keyWord: this.value4.trim(),
            cp: this.page,
            ps: this.pageSize,
            categoryIds:this.$route.query.categoryIds,
            sourceObjectId: this.$route.query.knowledgeId,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.knowledgeTypeList = res.data.Data.ItemList;
            this.totalCount = parseInt(res.data.Data.RecordCount);
            this.oldkeyWord = this.value4.trim()
            this.loading = false;
          }
        })
    },
    /**
     * [getlist 获取知识元详情列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   page     [description]
     * @param    {[type]}   pageSize [description]
     * @return   {[type]}            [description]
     */
    getlist() {
      this.loading = true;
      this.$http.get(this.ApiTransfer("/ExplicitWord/Search"), {
          params: this.ApiTransfer("/ExplicitWord/Search", {
            keyWord: this.oldkeyWord,
            cp: this.page,
            ps: this.pageSize,
            sourceObjectId: this.$route.query.knowledgeId,
            categoryIds:this.$route.query.categoryIds,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.knowledgeTypeList = res.data.Data.ItemList;
            this.totalCount = parseInt(res.data.Data.RecordCount);
            this.loading = false;
          }
        })
    },
    /**
     * [changeSize 切换每页条数]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   pageSize [description]
     * @return   {[type]}            [description]
     */
    changeSize(pageSize) {
      this.pageSize = pageSize
      this.page=1
      this.getlist()
    },
    /**
     * [change 分页切换当前页]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   page [description]
     * @return   {[type]}        [description]
     */
    change(page) {
      this.page = page;
      this.getlist()
    },
    /**
     * [goIndex 跳转页面]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   path [description]
     * @return   {[type]}        [description]
     */
    goIndex(path) {
      this.$router.push(path)
    },
    /**
     * [showKnowledgeDetail 打开详情模态框]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   id    [知识体系ID]
     * @param    {[type]}   index [页面的第几条，用于展示详情模态框]
     * @return   {[type]}         [description]
     */
    showKnowledgeDetail(id, index) {
      this.getKnowledgeMap(id, index)
      this.detailObj = this.knowledgeTypeList[index];
      this.showDetailModal = true;
    },
    /**
     * [getKnowledgeMap 请求知识元的关系图]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   id [description]
     * @return   {[type]}      [description]
     */
    getKnowledgeMap(id, index) {
      this.$http.get(this.ApiTransfer("/ExplicitWordRelation/Map"), {
          params: this.ApiTransfer("/ExplicitWordRelation/Map", {
            id: id,
            level: 1, //关联级别:child有多少层
            type: 1, //接口类型1知识地图2知识束
          })
        })
        .then((res) => {
          if (res.data.Success) {
            var allArr = res.data.Data;
            this.renderMap(allArr, id);
          }
        })
    },

    /**
     * [renderMap 根据知识地图组织数据]
     * @Author   罗文
     * @DateTime 2017-11-21
     * @param    {[Array]}   data [要绘制的数据]
     * @return   {[type]}        [description]
     */
    renderMap(data, parentId) {
      let newData = []; //处理成新的数组，满足echarts
      let links = [];
      let hash = []; //存放所有的知识元名称，不能重复

      data.forEach((item, index) => {

        if (hash.indexOf(item.FirstWordTitle) == -1) {
          hash.push(item.FirstWordTitle);
          newData.push({
            nodeData: item, //节点数据
            nodeId: item.FirstWordId, //节点知识元Id
            name: item.FirstWordTitle,
          })
        }

        if (hash.indexOf(item.SecondWordTitle) == -1) {
          hash.push(item.SecondWordTitle);
          newData.push({
            nodeData: item,
            nodeId: item.SecondWordId,
            name: item.SecondWordTitle,
          })
        }
      })

      newData = newData.map((item) => {
        //处理根节点颜色改变

        if (item.nodeId == parentId) {
          item.itemStyle = this.echartStyleList[0];

          newData.map((item1) => {
            let secondArr = [];
            if (item1.nodeId != parentId && (item1.nodeData.FirstWordId == parentId || item1.nodeData.SecondWordId == parentId)) {
              item1.itemStyle = this.echartStyleList[1];
              newData.map((item2) => {
                if (item2.nodeId != item1.nodeId && item2.nodeId != parentId && (item2.nodeData.FirstWordId == item1.nodeId || item2.nodeData.SecondWordId == item1.nodeId)) {
                  item2.itemStyle = this.echartStyleList[2];
                }
              })
            }
          })
        }

        return item;
      })


      //处理关系数组
      links = data.map((item) => {
        return {
          source: item.SecondWordTitle,
          target: item.FirstWordTitle
        }
      })

      this.reInitEchart(newData, links);
    },
    /**
     * [reInitEchart 重绘图表]
     * @Author   赵雯欣
     * @DateTime 2017-11-29
     * @param    {[type]}   time [description]
     * @param    {[type]}   val  [description]
     * @return   {[type]}        [description]
     */
    reInitEchart(newData, linkArr) {
      var myEcharts = echarts.getInstanceByDom(this.$refs.main);
      myEcharts.setOption({
        series: [{
          name: '指示图',
          data: newData,
          links: linkArr,
        }],
      })
    },
  },
}

</script>
<style lang="less">
.bg-knowledge-list {

  .btn-line {
    height: 50px;
    margin-top: 25px;
  }


  .page {
    height: 50px;
    padding-top: 15px;

    .ivu-page {
      float: right;
    }
  }
}

#knowledgeModal {
  .ivu-btn-text {
    display: none;
  }
  .ivu-modal-footer {
    text-align: center;
    margin-top: -30px;
  }
  .ivu-input[disabled],
  fieldset[disabled] .ivu-input {
    color: #666;
  }
  #main {
    border: 1px solid #ddd;
    width: 500px;
    height: 400px;
    padding: 10px;
  }
}

</style>
