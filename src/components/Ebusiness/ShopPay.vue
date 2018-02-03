<template>
  <div class="personal-pay">
    <div class="system-title">
      <Icon type="social-usd" size="27"></Icon><span>机构订单审核</span>
    </div>
    <div class="btn-line">
      <span>订单总额：¥{{formatPrice(TotalMoney,2)}} </span>
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入机构名称" style="width: 300px;float: right" @on-click="getkeyWordList()" @on-enter="getkeyWordList()"></Input>
    </div>
    <Table border :loading="loading" :columns="columnList" :data="dataList" ref="selection"></Table>
    <div class="page">
      <Page :total="parseInt(totalCount)" size="small" show-elevator :current="parseInt(page)" :page-size="pageSize" show-total show-sizer @on-page-size-change='changeSize' @on-change="change" style="height:170px;"></Page>
    </div>

      <!-- 审核订单 -->
    <Modal v-model="checkModal" :mask-closable="false" id="noFooter">
      <p slot="header" style="text-align:center;color:#333;">审核订单</p>
      <Form :model="checkObj" :label-width="100">
        <FormItem label="是否通过:" prop="type">
           <i-switch v-model="checkObj.type" @on-change="changeStatus"></i-switch>
           <span style="margin-left: 20px;">{{orderStatus?'订单通过':'订单不通过'}}</span>
        </FormItem>
       <!--  <FormItem label="备注:" prop="ContactPerson">
          <Input v-model="checkObj.ContactPerson" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem> -->
      </Form>
      <div style="text-align: center;">
        <Button type="primary" @click="checkFn()">确定</Button>
        <Button @click="checkModal=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keyWord: "", //搜索关键字
      oldkeyWord: '',
      loading: false,
      totalCount: 0,
      page: "1",
      pageSize: 10,
      dataList: [], //表格列表
      TotalMoney:0,

       // 审核
      checkModal: false,
      checkObj: {
        type:false,//0-审核不通过，1-审核通过
      },
      orderStatus:'',
      checkOrderId:'',

      columnList: [{
        title: '订单编号',
        key: 'Id',
        // width: 160,
         ellipsis:true,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Id ? params.row.Id : "-")
          ])
        }
      }, {
        title: '金额',
         ellipsis:true,
        render: (h, params) => {
          return h("span", {}, '¥' + this.formatPrice(params.row.TotalMoney ? params.row.TotalMoney : "0", 2))
        }
      }, {
        title: '所属机构',
         ellipsis:true,
        render: (h, params) => {
          return h("span", {}, params.row.ExtendData && params.row.ExtendData.OrganizationTitle ? params.row.ExtendData.OrganizationTitle : "-")
        }
      }, {
        title: '审核状态',
        width:100,
        key: 'AuditState',
        render: (h, params) => {
          return h('div', [
            h("Button", {
              props: {
                size: 'small',
                type: params.row.AuditState == 1 ? 'success' : params.row.AuditState == 0?'error':'ghost'
              },
              style: {
                color: params.row.AuditState == 1 ? '#19be6b' : params.row.AuditState == 0?'#ff7676':'',
                backgroundColor: "#fff",
                cursor: 'default',
                marginLeft:'6px'
              }
            }, params.row.AuditState == 1 ? '已审核' : params.row.AuditState == 2 ? '未审核' : '未通过')
          ])
        }
      }, {
        title: '审核时间',
        ellipsis:true,
        render: (h, params) => {
          return h("span", {}, params.row.AuditTime ? params.row.AuditTime : "-")
        }
      }, {
        title: '操作',
        key: 'action',
        width:100,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small',
                disabled:params.row.Status ==2?true:false, //0-异常订单 1-已完成 2-已取消 3-未发货 4-已发货
              },
              on: {
                click: () => {
                  if(params.row.Status!=2){
                    this.checkOrderId=params.row.Id
                    this.checkModal = true;
                  }
                }
              }
            }, '审核'),
          ]);
        }
      }],
    }
  },
  mounted() {
    this.getlist()
     this.getTotoalMoney()
  },
  methods: {
    /**
     * [getkeyWordList 搜索关键字]
     * @Author   王柳
     * @DateTime 2017-12-13
     * @return   {[type]}   [description]
     */
    getkeyWordList() {
      if (this.oldkeyWord == this.keyWord.trim() && this.keyWord.trim() == '') {
        this.$Message.warning('请输入机构名称')
        return false;
      }
      this.loading = true;
      this.page = 1
      this.$http.get(this.ApiTransfer("/OrganizationOrder/List"), {
          params: this.ApiTransfer("/OrganizationOrder/List", {
            keyword: this.keyWord.trim(),
            cp: this.page,
            ps: this.pageSize,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.dataList = res.data.Data.OrderList.ItemList
            this.totalCount = parseInt(res.data.Data.OrderList.RecordCount);
            this.oldkeyWord = this.keyWord.trim()
            this.loading = false;
          }
        })
    },
    getlist() {
      this.loading = true;
      this.$http.get(this.ApiTransfer("/OrganizationOrder/List"), {
          params: this.ApiTransfer("/OrganizationOrder/List", {
            keyword: this.oldkeyWord,
            cp: this.page,
            ps: this.pageSize,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.dataList = res.data.Data.OrderList.ItemList
            this.totalCount = parseInt(res.data.Data.OrderList.RecordCount);
            this.loading = false;
          }
        })
    },
    //分页切换当前页
    change(page) {
      this.page = page;
      this.getlist()
    },
    changeSize(page) {
      this.pageSize = page
      this.page = 1
      this.getlist()
    },
    /**
     * [changeStatus 切换状态]
     * @Author   王柳
     * @DateTime 2017-12-19
     * @param    {[type]}   status [description]
     * @return   {[type]}          [description]
     */
     changeStatus(status){
      this.orderStatus = status
    },
    /**
     * [checkFn 审核订单]
     * @Author   王柳
     * @DateTime 2017-12-16
     * @return   {[type]}   [description]
     */
    checkFn(){
      this.$http.post(this.ApiTransfer("/Order/SetAuditState"), this.ApiTransfer("/Order/SetAuditState", {
          id: this.checkOrderId,
          type:this.checkObj.type?1:0
        }))
        .then((res) => {
          if (res.data.Success) {
            this.$Message.success('审核订单操作成功')
            this.getlist()
            this.checkModal = false;
          }
        })
    },
     /**
     * [getTotoalMoney 订单金额]
     * @Author   王柳
     * @DateTime 2017-12-09
     * @return   {[type]}   [description]
     */
    getTotoalMoney() {
      this.$http.get(this.ApiTransfer("/OrganizationOrder/OrganizationOrderTotalMoney"), {
          params: this.ApiTransfer("/OrganizationOrder/OrganizationOrderTotalMoney", {
            // productId:0,
            // paidType:0
          })
        })
        .then((res) => {
          if (res.data.Success) {
                this.TotalMoney =res.data.Data
             }
        })
    },
  }
}

</script>
<style lang="less">
.personal-pay {
  overflow: hidden;
  min-height: 600px;

  .ivu-date-picker {
    position: relative;
  }

  .p1-right {
    span {
      cursor: pointer;
    }
  }

  .tables {
    margin-top: 20px;
  }

  .page {
    height: 50px;
    margin-top: 15px;

    .ivu-page {
      float: right;
    }
  }
}

</style>
