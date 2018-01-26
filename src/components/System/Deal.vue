<template>
  <div>
    <div class="system-title">
      <Icon type="clipboard" size="24"></Icon>
      <span>机构订单查看</span>
    </div>
    <div>
      <Row>
        <Col :span="8" :offset="16">
        <Input v-model="searchKey" icon="ios-search-strong" placeholder="请输入订单编号查询" @on-click="searchInfo" @on-enter="searchInfo"></Input>
        </Col>
        </Col>
      </Row>
      <Row>
        <Row class="pt10 pb10">
          <Table :loading="loadingData" :columns="accountColumns" :data="accountDatas" highlight-row>
          </Table>
        </Row>
        <Row class="tr pt5 pb10">
          <Page :total="tp" :current="cp" :page-size="ep" size="small" show-total show-sizer :page-size-opts='[10,20,30]' @on-change="currentPageChange" @on-page-size-change="eachPageChange"></Page>
        </Row>
      </Row>
    </div>
    <!-- 查看详情 -->
    <Modal v-model="checkDetailsModal" class="check-details" :mask-closable="false" width="600" @on-cancel="handleReset('checkDetailsForm')">
      <p slot="header" style="text-align:center;color:#333;">机构订单详情</p>
      <Form ref="checkDetailsForm" :model="detailsDatas" :label-width="90">
        <FormItem label="订单编号:">
          <Input v-model="detailsDatas.Id" readonly></Input>
        </FormItem>
        <FormItem label="机构名称:">
          <Input v-model="detailsDatas.ExtendData.OrganizationTitle" readonly></Input>
        </FormItem>
        <FormItem label="联系人:">
          <Input v-model="detailsDatas.ExtendData.contactPerson" readonly></Input>
        </FormItem>
        <FormItem label="电话:">
          <Input v-model="detailsDatas.ExtendData.MobilePhone" readonly></Input>
        </FormItem>
        <FormItem label="订单状态:">
          <Input :value="detailsDatas.Status == 2 ? '已关闭' : detailsDatas.AuditState == 1 ? '已审核' : detailsDatas.AuditState == 2 ? '未审核' : '未通过'" readonly></Input>
        </FormItem>
        <FormItem label="下单时间:">
          <Input v-model="detailsDatas.CreateTime" readonly></Input>
        </FormItem>
        <FormItem label="审核时间:">
          <Input :value="detailsDatas.AuditTime?detailsDatas.AuditTime:'-'" readonly></Input>
        </FormItem>
        <FormItem label="销售员:">
          <Input v-model="detailsDatas.SaleMan" readonly></Input>
        </FormItem>
        <FormItem label="内容数量:">
          <span>
            {{detailsDatas.ExtendData.OrganitionContentCount}}
          </span>
          <span>
            <Button type="ghost" @click="checkDealResource(detailsDatas.Id)">查看详情</Button>
          </span>
        </FormItem>
        <FormItem>
          <div style="text-align: right;font-size: 15px;">
            总计（&yen;）：{{formatPrice(detailsDatas.TotalMoney?detailsDatas.TotalMoney:'0')}}
          </div>
        </FormItem>
      </Form>
      <div style="text-align: center;">
        <Button type="primary" @click="handleReset('checkDetailsForm')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('bg_user_info')),
      checkDetailsModal: false,
      detailsDatas: {
        Id: '',
        ExtendData: {
          OrganizationTitle: '',
          MobilePhone: '',
          IsPaid: '',
        },
        CreateTime: '',
        PayTime: '',
        SaleMan: '',

      },
      type: 0,
      typeList: [{
        value: 0,
        label: '全部',
      }, {
        value: 1,
        label: '已使用',
      }, {
        value: 2,
        label: '未使用',
      }],

      searchKey: '',
      oldKey: '',
      //表格配置
      accountColumns: [{
          title: '订单编号',
          key: 'Id',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.Id ? params.row.Id : ''
              }
            }, params.row.Id ? params.row.Id : '-')
          }
        },
        {
          title: '购买机构',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.ExtendData.OrganizationTitle ? params.row.ExtendData.OrganizationTitle : ''
              }
            }, params.row.ExtendData.OrganizationTitle ? params.row.ExtendData.OrganizationTitle : '-')
          }
        },
        {
          title: '订单总额（元）',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: this.formatPrice(params.row.TotalMoney ? params.row.TotalMoney : '0', 2)
              }
            }, this.formatPrice(params.row.TotalMoney ? params.row.TotalMoney : '0', 2))
          }
        }, {
          title: '销售员',
          key: 'Amount',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.SaleMan ? params.row.SaleMan : ''
              }
            }, params.row.SaleMan ? params.row.SaleMan : '-')
          }
        }, {
          title: '订单状态',
          key: 'DeviceTypeName',
          ellipsis: true,
          render: (h, params) => {
            return h("Tag", {
              props: {
                size: 'small',
                color: params.row.Status == 2 ? 'yellow' : params.row.AuditState == 1 ? 'green' : params.row.AuditState == 0 ? 'blue' : 'default',
                type:'border',
              },
              style: {
                cursor: 'default',
              }
            }, params.row.Status == 2 ? '已关闭' : params.row.AuditState == 1 ? '已审核' : params.row.AuditState == 2 ? '未审核' : '未通过')

          }
        }, {
          title: '授权有效期',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.IsForever ? '永久有效' : this.formatDate(params.row.StartTime) + ' 至 ' + this.formatDate(params.row.EndTime),

              }
            }, params.row.IsForever ? '永久有效' : this.formatDate(params.row.StartTime) + ' 至 ' + this.formatDate(params.row.EndTime))
          }
        }, {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.checkDetails(params.row, params.index)
                }
              }
            }, '订单详情')
          }
        }
      ],


      //表格数据
      accountDatas: [],
      cp: 1,
      ep: 10,
      tp: 0,
      loadingData: false,
    }
  },
  methods: {
    checkDealResource(id) {
      this.$router.push({
        path: '/system/deal/dealresource',
        query: {
          id: id
        }
      })
    },
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
        keyword: this.oldKey,
        organizationAdminId: this.userInfo.Id

      }
      this.loadingData = true;
      this.$http.get(this.ApiTransfer('/OrganizationOrder/List'), {
        params: this.ApiTransfer('/OrganizationOrder/List', paramsData)
      }).then((res) => {
        if (res.data.Success) {
          this.loadingData = false;
          this.accountDatas = res.data.Data.OrderList.ItemList;
          this.tp = parseInt(res.data.Data.OrderList.RecordCount);
        }

      })
    },

    searchInfo() {
      if (this.oldKey == this.searchKey.trim() && this.searchKey.trim() == '') {
        this.$Message.warning('请输入订单编号查询')
        return false;
      } else {
        var paramsData = {};
        this.cp = 1;
        paramsData = {
          cp: this.cp,
          ps: this.ep,
          keyword: this.searchKey.trim(),
          organizationAdminId: this.userInfo.Id
        }
        this.loadingData = true;
        this.$http.get(this.ApiTransfer('/OrganizationOrder/List'), {
          params: this.ApiTransfer('/OrganizationOrder/List', paramsData)
        }).then((res) => {
          if (res.data.Success) {
            this.loadingData = false;
            this.accountDatas = res.data.Data.OrderList.ItemList;
            this.tp = parseInt(res.data.Data.OrderList.RecordCount);
            this.oldKey = this.searchKey.trim()
          }

        })
      }
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

    checkDetails(row, index) {
      this.checkDetailsModal = true;
      this.detailsDatas = row;
    },

    handleReset(formName) {
      this.checkDetailsModal = false;
      this.$refs[formName].resetFields();
    }

  },
  mounted() {
    this.getListData();
  }
}

</script>
<style lang="less">
.ivu-modal-footer {
  display: none;
}

</style>
