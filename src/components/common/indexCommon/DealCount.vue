<template>
  <div class="deal-count">
    <Row type="flex" class="row-bg" justify="space-between">
      <Col :span="24" class="col">
      <div class="countClass">
        <div class="spanText">
          <span class="countTitle">交易详情</span>
        </div>
      </div>
      <Row style="margin:0 10px">
        <div>
          <Row>
            <Spin fix v-show="loadingData">
              <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
              <div>数据加载中...</div>
            </Spin>
            <Row class="pt10 pb10" v-show="!loadingData">
              <Table :columns="accountColumns" :data="accountDatas" highlight-row :border="false">
              </Table>
            </Row>
          </Row>
          <Row class="tr pt5 pb10">
            <Page :total="tp" :current="cp" :page-size="ep" size="small" show-total show-sizer :page-size-opts='[10,20,30]' @on-change="currentPageChange" @on-page-size-change="eachPageChange"></Page>
          </Row>
        </div>
      </Row>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      winHeight: 340,
      //表格配置
      accountColumns: [{
        title: '资源名称',
        key: 'Title',
        ellipsis: true,
        render: (h, params) => {
          return h('span', {
            attrs:{
              title:params.row.Title ? params.row.Title : ''
            }
          },params.row.Title ? params.row.Title : '暂无数据')
        }
      }, {
        title: '资源类型',
        key: 'UserName',
        ellipsis: true,
        render: (h, params) => {
          return h('span', params.row.ObjectTypeDescription ? params.row.ObjectTypeDescription : '暂无数据')
        }
      }, {
        title: '价格（元）',
        align: 'center',
        ellipsis: true,
        render: (h, params) => {
          return h('span', {
            attrs:{
              title:params.row.ExtendData.Price ? params.row.ExtendData.Price : ''
            }
          },params.row.ExtendData.Price ? params.row.ExtendData.Price : '暂无数据')
        }
      }, {
        title: '购买用户',
        key: 'DeviceTypeName',
        align: 'center',
        ellipsis: true,
        render: (h, params) => {
          return h('span',{
            attrs:{
              title:params.row.ExtendData.BuyerName ? params.row.ExtendData.BuyerName : ''
            }
          }, params.row.ExtendData.BuyerName ? params.row.ExtendData.BuyerName : '暂无数据')
        }
      }, {
        title: '订单日期',
        key: 'DeviceName',
        align: 'center',
        ellipsis: true,
        render: (h, params) => {
          return h('span', {
            attrs:{
              title:params.row.ExtendData.CreateTime ? params.row.ExtendData.CreateTime : ''
            }
          },params.row.ExtendData.CreateTime ? params.row.ExtendData.CreateTime : '暂无数据')
        }
      }],

      //表格数据
      accountDatas: [],
      cp: 1,
      ep: 10,
      tp: 0,
      loadingData: false,
    }
  },
  methods: {
    /**
     * [获取操作列表]
     * @作者     王柳
     * @日期     2017-10-19
     */
    getListData() {
      var paramsData = {};
      paramsData = {
        cp: this.cp,
        ps: this.ep,
        startTime: this.startTime,
        endTime: this.endTime,
      }
      this.$http.get(this.ApiTransfer("/OrderDetail/OrderDetailList"), {
          params: this.ApiTransfer("/OrderDetail/OrderDetailList", paramsData)
        })
        .then((res) => {
          this.loadingData = false;
          this.tp = parseInt(res.data.Data.RecordCount);
          this.accountDatas = res.data.Data.ItemList;
        })
    },
    //分页
    currentPageChange(value) {
      this.cp = value;
      this.getListData();
    },
    eachPageChange(value) {
      this.ep = value;
      this.cp = 1;
      this.getListData();
    },
  },
  created() {
    this.getListData();
  },
}

</script>
<style lang="less" scoped>
.deal-count {
  background-color: white;
  .ivu-page-options-sizer {
    margin: 0;
  }
  .countTitle {
    font-size: 18px;
    font-weight: bold;
    margin: 20px 0 0 10px;
    color: gray;
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
        .spanText {
          float: left;
        }
      }
    }
  }
}

</style>
