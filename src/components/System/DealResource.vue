<template>
  <div>
    <div class="system-title">
      <Icon type="filing" size="24"></Icon>
      <span><a @click.prevent="$router.push('/system/deal/check')">机构订单查看</a> > 机构资源查看</span>
    </div>
    <div>
      <Row>
        <Col :span="16">
        <span>
          类型：
        <Select v-model="type" style="width:200px" @on-change="typeChange">
          <Option v-for="item in typeList" :value="item.ObjectType" :key="item.ObjectType">{{ item.Description }}</Option>
        </Select>
        </span>
        <span>
          状态：
        <Select v-model="status" style="width:200px" @on-change="statusChange">
          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </span>
        </Col>
        <Col :span="8">
        <Input v-model="searchKey" icon="ios-search-strong" placeholder="请输入内容标题" @on-click="searchInfo" @on-enter="searchInfo"></Input>
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
      <p slot="header" style="text-align:center;color:#333;">资源详情</p>
      <Form ref="checkDetailsForm" :model="detailsData" :label-width="90">
        <FormItem label="封面图片:">
          <div class="cover-main">
            <img v-if="detailsData.CoverUrl!=''" :src="detailsData.CoverUrl" alt="封面图片">
            <img v-else src="" alt="暂无封面">
          </div>
        </FormItem>
        <FormItem label="内容标题:">
          <Input v-model="detailsData.Title" readonly></Input>
        </FormItem>
        <FormItem label="作者:">
          <Input v-model="detailsData.Author" readonly></Input>
        </FormItem>
        <FormItem label="出版社:">
          <Input v-model="detailsData.Publisher" readonly></Input>
        </FormItem>
        <FormItem label="内容简介:">
          <Input v-model="detailsData.Abstracts" type="textarea" :autosize='{maxRows:5,minRows:4}' readonly></Input>
        </FormItem>
        <FormItem label="定价（元）:">
          <Input v-model="detailsData.CurrentPrice" readonly></Input>
        </FormItem>
        <FormItem label="类型:">
          <Input v-model="detailsData.ObjectTypeDescription" readonly></Input>
        </FormItem>
        <FormItem style="text-align: center;margin-top: 20px;">
          <Button type="primary" @click="handleReset('checkDetailsForm')">确定</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkDetailsModal: false,
      detailsData: {
        CoverUrl: "",
        Title: '',
        Author: '',
        Publisher: '',
        Abstracts: '',
        CurrentPrice: '',
        ObjectTypeDescription: '',
      },
      type: '0',

      status: '0',

      typeList: [{
        ObjectType: '0',
        Description: '全部',
      },{
        ObjectType:'107',
        Description:'课程',
      },{
        ObjectType:'102',
        Description:'章节',
      },{
        ObjectType:'104',
        Description:'图书',
      },{
        ObjectType:'109',
        Description:'视频',
      },{
        ObjectType:'108',
        Description:'图片',
      }],

      statusList: [{
        value: '0',
        label: '全部',
      }, {
        value: '1',
        label: '已上架'
      }, {
        value: '2',
        label: '已下架'
      }],

      searchKey: '',
      oldKey: '',
      //表格配置
      accountColumns: [{
        title: '编号',
        key: 'Id',
        ellipsis: true,
        render: (h, params) => {
          return h('span', params.row.Id ? params.row.Id : '-')
        }
      }, {
        title: '内容标题',
        key: 'Title',
        ellipsis: true,
        render: (h, params) => {
          return h('span', {
            attrs: {
              title: params.row.Title ? params.row.Title : ''
            }
          }, params.row.Title ? params.row.Title : '-')
        }
      }, {
        title: '作者',
        key: 'Author',
        ellipsis: true,
        render: (h, params) => {
          return h('span', {
            attrs: {
              title: params.row.Author ? params.row.Author : ''
            }
          }, params.row.Author ? params.row.Author : '-')
        }
      }, {
        title: '出版社',
        key: 'Publisher',
        ellipsis: true,
        render: (h, params) => {
          return h('span', {
            attrs: {
              title: params.row.Publisher ? params.row.Publisher : ''
            }
          }, params.row.Publisher ? params.row.Publisher : '-')
        }
      }, {
        title: '定价（元）',
        key: 'MarketPrice',
        ellipsis: true,
        render: (h, params) => {
          return h('span', {
            attrs: {
              title: this.formatPrice(params.row.MarketPrice ? params.row.MarketPrice : '0', 2)
            }
          }, this.formatPrice(params.row.MarketPrice ? params.row.MarketPrice : '0', 2))
        }
      }, {
        title: '售价（元）',
        key: 'CurrentPrice',
        ellipsis: true,
        render: (h, params) => {
          return h('span', {
            attrs: {
              title: this.formatPrice(params.row.CurrentPrice ? params.row.CurrentPrice : '0', 2)
            }
          }, this.formatPrice(params.row.CurrentPrice ? params.row.CurrentPrice : '0', 2))
        }
      }, {
        title: '导入时间',
        key: 'CreateTime',
        ellipsis: true,
        render: (h, params) => {
          return h('span', {
            attrs: {
              title: params.row.CreateTime ? params.row.CreateTime : ''
            }
          }, params.row.CreateTime ? params.row.CreateTime : '-')
        }
      }, {
        title: '状态',
        key: 'IsPublished',
        ellipsis: true,
        render: (h, params) => {
          return h('Tag', {
            props: {
              color: params.row.IsPublished ? 'green' : 'red',
              type: 'border'
            }
          }, params.row.IsPublished ? '已上架' : '未上架')
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
          }, '查看详情')
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
    handleReset(name) {
      this.checkDetailsModal = false
      this.$refs[name].resetFields();
    },

    typeChange() {
      this.cp = 1;
      this.getListData();
    },

    statusChange() {
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
        cp: this.cp,
        ps: this.ep,
        keyword: this.oldKey,
        objectType: this.type,
        orderId:this.$route.query.id
      }

      if (this.status != 0) {
        paramsData = Object.assign({}, paramsData, {
          isOnShelf: this.status == 1 ? true : false
        })
      }
      this.loadingData = true;
      this.$http.get(this.ApiTransfer('/Organization/ContentList'), {
        params: this.ApiTransfer('/Organization/ContentList', paramsData)
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
        this.$Message.warning('请输入内容标题')
        return false;
      } else {
        this.cp = 1;
        var paramsData = {};
        paramsData = {
          cp: this.cp,
          ps: this.ep,
          keyword: this.searchKey.trim(),
          objectType: this.type,
          orderId:this.$route.query.id
        }

        if (this.status != 0) {
        paramsData = Object.assign({}, paramsData, {
          isOnShelf: this.status == 1 ? true : false
        })
      }
        this.loadingData = true;
        this.$http.get(this.ApiTransfer('/Organization/ContentList'), {
          params: this.ApiTransfer('/Organization/ContentList', paramsData)
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

    checkDetails(row, index) {
      this.checkDetailsModal = true;
      this.detailsData = Object.assign({},this.detailsData,{
        cover: row.CoverUrl,
        title: row.Title,
        anthor: row.Author,
        publish: row.Publisher,
        intro: row.Abstracts,
        price: this.formatPrice(row.CurrentPrice ? row.CurrentPrice : '0', 2),
        style: '',
        type: '',
      })
    },

    getTypeList() {
      this.$http.get(this.ApiTransfer('/Dictionary/ObjectTypes'), {
          params: this.ApiTransfer('/Dictionary/ObjectTypes', {
            params: {

            }
          })
        })
        .then((res) => {

          if (res.data.Success) {
            if (res.data.Data.length != 0) {
              res.data.Data.forEach((item, index) => {
                this.typeList.push(item)
              })
            }
          }
        })
    }
  },
  mounted() {
    this.getListData();
  },
  created() {
    // this.getTypeList();
  }
}

</script>
<style lang="less">
.cover-main {
  height: 200px;
  width: 400px;
  border: 1px solid #dddee1;
  border-radius: 4px;
}

.check-details {
  .ivu-form-item {
    margin-bottom: 15px;
  }
  .ivu-modal-body {
    padding-right: 32px;
  }
  .ivu-form-item-error-tip {
    padding: 2px;
  }
  .ivu-modal-footer {
    display: none;
  }

  .test label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
  }
}

</style>

