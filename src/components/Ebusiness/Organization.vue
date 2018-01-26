<template>
  <div class="organization-order">
    <div class="system-title">
      <Icon type="cash" size="27"></Icon>
      <span>机构订单</span>
    </div>
    <div class="btn-line">
      <Button type="primary" icon="plus" @click="addFileListModal=true">新增订单文件导入</Button>
      <Button type="primary" icon="plus" @click='addListModal=true'>新增订单列表勾选导入</Button>
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入机构名称" style="width: 300px;float: right" @on-click="getkeyWordList()" @on-enter="getkeyWordList()"></Input>
    </div>
    <Table border :loading="loading" :columns="columnsList" :data="dataList"></Table>
    <div class="page">
      <Page :total="parseInt(totalCount)" size="small" show-elevator :current="parseInt(page)" :page-size="pageSize" show-total show-sizer @on-page-size-change='changeSize' @on-change="change"></Page>
    </div>
    <!-- 资源列表 -->
    <Modal v-model="resourceLIstModal" :mask-closable="false" width='700px' id="ResModal">
      <p slot="header" style="text-align:center;color:#333;">资源列表</p>
      <Select v-model="model1" style="width:200px;margin-bottom:10px" @on-change='selectType'>
        <Option v-for="item in allType" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <div style="line-height: 40px;">
      </div>
      <Table border :columns="columnSresourceList" :data="selectdataList"></Table>
      <div class="page tr pt10">
        <Page :total="parseInt(totalCount1)" :current="parseInt(page1)" size="small" show-elevator :page-size="pageSize1" show-total show-sizer @on-page-size-change='changeSize1' @on-change="change1"></Page>
      </div>
      <div slot="footer">
      </div>
    </Modal>
    <!--机构订单详情 -->
    <Modal v-model="organizationModal" :mask-closable="false">
      <p slot="header" style="text-align:center;color:#333;">机构订单详情</p>
      <Row class='textDetails' v-if="organizationModal">
        <p>订单编号：<span>{{details.Id ? details.Id : "-"}}</span></p>
        <p>购买机构：<span>{{details.ExtendData&&details.ExtendData.OrganizationTitle ? details.ExtendData.OrganizationTitle : "-"}}</span></p>
        <p>订单总额：<span>{{'¥'+formatPrice(details.TotalMoney ? details.TotalMoney : "0", 2)}}</span></p>
        <p>资源清单：<span>{{confirmType(details.ObjectTypeList)}}</span></p>
        <p>销售员：<span>{{details.SaleMan?details.SaleMan:'-'}}</span></p>
        <p>应用名称：<span>{{details.ExtendData&&details.ExtendData.PlatformProduct?details.ExtendData.PlatformProduct:'-'}}</span></p>
        <p>授权有效期：<span>{{details.EndTime?details.EndTime:'-'}}</span></p>
        <p>复制字数控制：<span>200</span></p>
      </Row>
      <div slot="footer">
      </div>
    </Modal>
    <!-- 新增订单文件导入 -->
    <Modal v-model="addFileListModal" :mask-closable="false" id="modal34">
      <orgForm v-if="addFileListModal" @childrenEmit="doListEmit"></orgForm>
     
    </Modal>
    <!-- 新增订单列表勾选导入 -->
    <Modal v-model="addListModal" :mask-closable="false" id="modal" width="700">
      <p slot="header" style="text-align:center;color:#333;">新增订单</p>
      <addOrgList v-if="addListModal" @childrenEmit="doListEmit"></addOrgList>
    </Modal>
  </div>
</template>
<script>
import addOrgList from "./addOrg.vue"
import orgForm from "./OrgForm.vue"
export default {
  components: {
    addOrgList,
    orgForm
  },
  data() {
    return {
      loading: false,
      TotalMoney: 0,
      PaidMoney: 0,
      details: {
        Organization: {
          Title: ''
        }
      },
      selectdataList: [],
      model1: 0,
      keyWord: "", //搜索关键字
      oldkeyWord: '',
      totalCount: 0,
      page: "1",
      pageSize: 10,

      totalCount1: 0,
      page1: '1',
      pageSize1: 10,

      openDate: false,
      dateValue: '',
      dataList: [], //表格列表
      resourceLIstModal: false, //资源列表订单
      organizationModal: false, //机构订单详情


      addListModal: false,
      addFileListModal: false, //新增订单文件导入

      columnSresourceList: [{
        title: '标题',
        key: 'Title',
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Content.Title ? params.row.Content.Title : "-")
          ])
        }
      }, {
        title: '作者',
        render: (h, params) => {
          return h('div', [
            h("Tooltip", {
              props: {
                trigger: "hover",
                content: params.row.Content.Author ? params.row.Content.Author : "-",
                placement: "top-start"
              },
              style: {
                width: '100%',
                textOverflow: 'ellipsis'
              }
            }, params.row.Content.Author ? params.row.Content.Author : "-")
          ])
        }
      }, {
        title: '出版社',
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Content.Publisher ? params.row.Content.Publisher : "-")
          ])
        }
      }],
      columnsList: [{
        title: '订单编号',
        key: 'Id',
        ellipsis:true,
        // width: 100,
      }, {
        title: '购买机构',
         ellipsis:true,
        render: (h, params) => {
          return h("span", {}, params.row.ExtendData && params.row.ExtendData.OrganizationTitle ? params.row.ExtendData.OrganizationTitle : "-")
        }
      }, {
        title: '订单总额',
         ellipsis:true,
        // width: 120,
        render: (h, params) => {
          return h("span", {}, '¥' + this.formatPrice(params.row.TotalMoney ? params.row.TotalMoney : "0", 2))
        }
      }, {
        title: '资源列表',
         ellipsis:true,
        // width: 98,
        key: 'Id',
        render: (h, params) => {
          return h('div', [
            h('a', {
              on: {
                //资源列表详情
                click: () => {
                  this.resourceLIst(params.row.Id)
                }
              }
            }, '查看'),
          ])
        }
      }, {
        title: '销售员',
         ellipsis:true,
        key: 'WordCount',
        // width: 100,
        render: (h, params) => {
          return h("span", {}, params.row.SaleMan ? params.row.SaleMan : "-")
        }
      }, {
        title: '应用名称',
         ellipsis:true,
        key: 'ProductId',
        // width: 95,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.ExtendData.PlatformProduct ? params.row.ExtendData.PlatformProduct : "-")
          ])
        }
      }, {
        title: '授权有效期',
        ellipsis:true,
        key: 'EndTime',
        // width: 115,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.EndTime ? params.row.EndTime.slice(0, 10) : "0")
          ])
        }
      }, {
        title: '订单状态',
        key: 'AuditState',
        width: 100,
        render: (h, params) => {
          return h('div', [
            h("Button", {
              props: {
                size: 'small',
                type: params.row.Status==2?'warning': params.row.AuditState == 1 ? 'success' : params.row.AuditState == 0 ? 'error' : 'ghost'
              },
              style: {
                color: params.row.Status==2?'#ffc36d':params.row.AuditState == 1 ? '#19be6b' : params.row.AuditState == 0 ? '#ff7676' : '',
                backgroundColor: "#fff",
                cursor: 'default',
                marginLeft:'6px'
              }
            }, params.row.Status==2?'已关闭': params.row.AuditState == 1 ? '已审核' : params.row.AuditState == 2 ? '未审核' : '未通过')
          ])
        }
      }, {
        title: '操作',
        key: 'action',
        width: 160,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              on: {
                //机构订单详情
                click: () => {
                  this.organizationDetails(params.row)
                }
              }
            }, '订单详情'),
            h('Dropdown', {
              props: {
                trigger: "click",
              },
              on: {
                "on-click": (name) => {
                  if (name == "close") {
                    if(params.row.AuditState == 1){
                      this.$Message.warning('订单已审核，不能关闭')
                    }else{
                       this.CloseOrder(params.row.Id)
                    }
                  } else if (name == 'leadingOut') {
                    this.leadingOut(params.row.Id)
                  }
                }
              }
            }, [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                },
              }, '更多'),
              h('DropdownMenu', {
                slot: 'list'
              }, [
                h('DropdownItem', {
                  props: {
                    name: 'close'
                  }
                }, '关闭订单'),
                h('DropdownItem', {
                  props: {
                    name: 'leadingOut'
                  }
                }, '导出')
              ])
            ])
          ]);
        }
      }],
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    /**
     * [getkeyWordList 搜索关键字]
     * @Author   赵雯欣
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
            fs:this.pageSize
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
    //资源列表详情框
    resourceLIst(id) {
      this.selectId = id
      this.model1 = 0
      this.pageSize1 = 10;
      this.resourceLIstchange()
    },
    selectType() {
      this.resourceLIstchange()
    },
    //资源列表详情种类改变
    resourceLIstchange() {
      this.$http.get(this.ApiTransfer("/OrganizationOrder/Detail"), {
          params: this.ApiTransfer("/OrganizationOrder/Detail", {
            id: this.selectId,
            ps: this.pageSize1,
            cp: this.page1,
            objectType: this.model1
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.selectdataList = res.data.Data.OrderDetails
            this.resourceLIstModal = true;
            this.totalCount1 = res.data.Data.ExtendData&&res.data.Data.ExtendData.ContentCount ? res.data.Data.ExtendData.ContentCount  : 0;
          }
        })
    },
    //机构订单详情
    organizationDetails(data) {
      this.details = data
      this.organizationModal = true
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
    change1(page) {
      this.page1 = page;
      this.resourceLIstchange();
    },
    changeSize1(page) {
      this.pageSize1 = page
      this.page1 = 1
      this.resourceLIstchange();
    },
    /**
     * [addList 新增订单文件导入]
     * @Author   赵雯欣
     * @DateTime 2017-12-16
     */
    addList() {
      this.addListModal = false;
    },
    /**
     * [leadingOut 导出单个订单]
     * @Author   赵雯欣
     * @DateTime 2017-12-16
     * @param    {[type]}   id [description]
     * @return   {[type]}      [description]
     */
    leadingOut(id) {
      this.$http.get(this.ApiTransfer("/Order/ExportDetail"), {
          params: this.ApiTransfer("/Order/ExportDetail", {
            id: id,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            window.location.href = res.data.Data;
            this.$Message.success('导出成功')
          } else {
            this.$Message.error(res.data.Description)
          }
        })
    },
    /**
     * [CloseOrder 关闭订单]
     * @Author   赵雯欣
     * @DateTime 2017-12-16
     */
    CloseOrder(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要关闭该订单么？</p>',
        onOk: () => {
          this.$http.post(this.ApiTransfer("/Order/SetOrderState"), this.ApiTransfer("/Order/SetOrderState", {
              id: id,
              isPaid: 1, //支付状态0未支付1已支付
              type: 2, //订单状态，0-异常订单，1-已完成，2-已取消 3-正在处理
            }))
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success('关闭成功')
                this.getlist()
              }
            })
        },
      });
    },

    /**
     * [doListEmit 处理子组件的请求]
     * @Author   赵雯欣
     * @DateTime 2017-12-16
     * @return   {[type]}   [description]
     */
    doListEmit(index) {
      this.addListModal = false
      if (index == 1) { //成功
        this.getlist()
      }
    }
  },
}

</script>
<style lang="less">
.organization-order {
  .btn-line {
    height: 30px;
  }
}

.textDetails>p {
  margin-top: 5px;
  font-size: 18px;
  padding-left: 30px
}

#ResModal{
   .ivu-select-dropdown{
    position: fixed!important;
  }
}

#modal34 {
  .ivu-modal-footer {
    display: none;
  }

  .ivu-row {
    font-size: 15px;
    line-height: 40px;
  }

  .ivu-modal{
    top:200px;
  }
}

#modal {
  .ivu-modal-footer {
    display: none;
  }

  .ivu-modal{
    top:30px;
  }
}

</style>
