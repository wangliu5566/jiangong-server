<template>
  <div>
    <div class="system-title">
      <Icon type="ios-search-strong" size="24"></Icon>
      <span>机构验证码管理</span>
    </div>
    <div>
      <Row>
        <Col :span="16"> 状态：
        <Select v-model="type" style="width:200px" @on-change="typeChange">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </Col>
        <Col :span="8">
        <Input v-model="searchKey" icon="ios-search-strong" placeholder="请输入机构验证码" @on-click="searchInfo" @on-enter="searchInfo"></Input>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: 3,
      typeList: [{
        value: 3,
        label: '全部',
      }, {
        value: 1,
        label: '已绑定',
      }, {
        value: 0,
        label: '未绑定',
      }, {
        value: 2,
        label: '已注销',
      }, ],


      searchKey: '',
      oldKey: '',
      //表格配置
      accountColumns: [{
          title: '机构验证码',
          key: 'Code',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.Code ? params.row.Code : ''
              }
            }, params.row.Code ? params.row.Code : '-')
          }
        }, {
          title: '验证码状态',
          align: 'center',
          width: '160',
          render: (h, params) => {
            
            return h('Tag', {
              props: {
                color: params.row.State == 0 ? 'green' : params.row.State == 1 ? 'yellow' : 'default',
                type: "border"
              }
            }, params.row.State == 0 ? '未绑定' : params.row.State == 1 ? '已绑定' : '已注销');
          }
        },
        {
          title: '用户名',
          key: 'Account',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.ExtendData.NickName ? params.row.ExtendData.NickName : ''
              }
            }, params.row.ExtendData.NickName ? params.row.ExtendData.NickName : '-')
          }
        },
        {
          title: '绑定电话/邮箱',
          key: 'Account',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.ExtendData.MobilePhone ? params.row.ExtendData.MobilePhone : params.row.ExtendData.Email ? params.row.ExtendData.Email : ''
              }
            }, params.row.ExtendData.MobilePhone ? params.row.ExtendData.MobilePhone : params.row.ExtendData.Email ? params.row.ExtendData.Email : '-')
          }
        },
        {
          title: '验证码时效',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: this.formatDate(params.row.StartTime) + ' 至 ' + this.formatDate(params.row.EndTime)
              }
            }, this.formatDate(params.row.StartTime) + ' 至 ' + this.formatDate(params.row.EndTime))
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
          render: (h, params) => {
            if (params.row.State == 1) {
              return h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.removeCode(params.row, params.index)
                  }
                }
              }, '移除')
            } else {
              return '';
            }

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
    removeCode(row, index) {
      this.$Modal.confirm({
        title: '操作确认',
        content: '该操作将移除该验证码并生成新的验证码，请确认',
        onOk: () => {
          this.$http.post(this.ApiTransfer('/ValidateCode/Remove'),
              this.ApiTransfer('/ValidateCode/Remove', {
                validateCodeId: row.Id
              })
            )
            .then((res) => {
              if (res.data.Success) {
                this.getListData();
                this.$Message.success('操作成功')
              }
            })
        },
      });
    },
    typeChange() {
      this.cp = 1;
      this.getListData();
    },
    /**
     * [获取操作列表]
     * @作者     王柳
     * @日期     2017-10-19
     */
    getListData() {
      var paramsData = {};
      paramsData = {
        type: this.type,
        cp: this.cp,
        ps: this.ep,
        keyword: this.oldKey,
      }
      this.loadingData = true;
      this.$http.get(this.ApiTransfer('/Organization/OrganizationCodeList'), {
        params: this.ApiTransfer('/Organization/OrganizationCodeList', paramsData)
      }).then((res) => {
        if (res.data.Success) {
          this.loadingData = false;
          this.accountDatas = res.data.Data.ItemList;
          this.tp = parseInt(res.data.Data.RecordCount);
        }

      })
    },

    searchInfo() {
      if (this.oldKey == this.searchKey.trim() && this.searchKey.trim() == '') {
        this.$Message.warning('请输入机构验证码')
        return false;
      } else {
        var paramsData = {};
        this.cp = 1;
        paramsData = {
          type: this.type,
          cp: this.cp,
          ps: this.ep,
          keyword: this.searchKey.trim(),

        }
        this.loadingData = true;
        this.$http.get(this.ApiTransfer('/Organization/OrganizationCodeList'), {
          params: this.ApiTransfer('/Organization/OrganizationCodeList', paramsData)
        }).then((res) => {
          if (res.data.Success) {
            this.loadingData = false;
            this.accountDatas = res.data.Data.ItemList;
            this.tp = parseInt(res.data.Data.RecordCount);
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

  },
  mounted() {
    this.getListData();
  }
}

</script>
<style lang="less">
.ivu-tag {
  cursor: default;
}

</style>
