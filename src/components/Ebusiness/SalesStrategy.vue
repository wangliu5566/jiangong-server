<template>
  <div class="sales-strategy">
    <div class="system-title">
      <Icon type="social-buffer" size="27"></Icon><span>销售策略管理</span>
    </div>
    <div class="btn-line">
      <Button type="primary" icon="plus-round" @click="openModal(1)">新增策略</Button>
    </div>
    
    <Table border :loading="loading" :columns="columnsList" :data="dataList" ref="selection"></Table>
    
    <div class="page">
      <Page :total="parseInt(totalCount)" :current="parseInt(page)" size="small" show-elevator :page-size="pageSize" show-total show-sizer @on-page-size-change='changeSize' @on-change="change"></Page>
    </div>
    <!-- 新增修改模态框 -->
    <Modal v-model="addActiveModal" id='noFooter' :mask-closable="false" width="630">
      <addActive v-if="addActiveContent" @returnListPage="closeModal" :addUpdate="addUpdate" :activeObj="activeObj"></addActive>
    </Modal>
    <!-- 设置资源 -->
    <Modal v-model="setResourceModal" :mask-closable="false" id="noFooter"  width="600" :closable="false">
      <p slot="header" style="text-align:center;color:#333;">设置资源</p>
      <span style="line-height: 37px;font-size: 15px;">设置资源：</span>
      <Cascader :data="productList" @on-change='selectChange' change-on-select style="width:490px;float: right;" :load-data="loadData" v-model="categoryId"></Cascader>
      <div style="text-align: center;margin-top: 160px;">
        <Button type="primary" @click="setSourceFn()">确定</Button>
        <Button type="ghost" @click="setResourceModal=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import addActive from "./AddActive.vue"
export default {
  components: {
    addActive
  },
  data() {
    return {
      loading: false,
      totalCount: 0,
      page: "1",
      pageSize: 10,
      dataList: [], //表格列表
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      addActiveModal: false,
      addActiveContent: false,
      addUpdate: 1, //新增是1，修改为2
      activeObj: {},
      setResourceModal: false,
      categoryId: [],
      productList: [],
      columnsList: [{
        title: '策略名称',
        key: 'Title',
        ellipsis: true,
        render: (h, params) => {
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
        }
      }, {
        title: '所用策略类型',
         ellipsis:true,
        // width: 150,
        key: 'StrategryName',
        render: (h, params) => {
          return h('div', [
            h("span", params.row.StrategryName ? params.row.StrategryName : "-")
          ])
        }
      }, {
        title: '策略描述',
        key: 'Description',
         ellipsis:true,
        // ellipsis: true,
        render: (h, params) => {
          if (!!params.row.Description && params.row.Description.length > 9) {
            return h('div', [
              h("Tooltip", {
                props: {
                  trigger: "hover",
                  content: params.row.Description ? params.row.Description : "-",
                  placement: "top-start"
                },
                style: {
                  width: '100%',
                  textOverflow: 'ellipsis'
                }
              }, params.row.Description ? params.row.Description : "-")
            ])
          } else {
            return h('div', [
              h("span", params.row.Description ? params.row.Description : "-")
            ])
          }
        }
      }, {
        title: '策略时间',
        key: 'StartTime',
         ellipsis:true,
        // width: 210,
        render: (h, params) => {
          return h("span", {}, params.row.StartTime && params.row.StartTime ? params.row.StartTime.slice(0, 10) + ' - ' + params.row.EndTime.slice(0, 10) : "-")
        }
      }, {
        title: '操作',
        key: 'action',
        width: 200,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                size: "small",
                type: "primary"
              },
              on: {
                click: () => {
                  this.openModal(2, params.index)
                }
              }
            }, '修改'),
            h('Button', {
              props: {
                size: "small",
                type: 'primary'
              },
              style: {
                marginLeft: "6px"
              },
              on: {
                click: () => {
                  this.saleStrategyId = params.row.Id;
                  this.setResourceModal = true
                  this.productId = ""
                }
              }
            }, '设置资源'),
            h('Button', {
              props: {
                size: "small",
                type: 'error'
              },
              on: {
                click: () => {
                  this.delStrategy(params.row.Id)
                }
              }
            }, '删除')
          ]);
        }
      }],
    }
  },
  mounted() {
    this.getlist()
    this.getSystemlist()
  },
  methods: {
    loadData(data, callback) {
      data.loading = true;
      if (data.__label.indexOf('/') > 0) { //第三级
        this.$http.get(this.ApiTransfer("/Hierarchy/GetCategoryList"), {
            params: this.ApiTransfer("/Hierarchy/GetCategoryList", {
              id: data.value,
            })
          })
          .then((res) => {
            if (res.data.Success) {
              res.data.Data.map((item) => {
                data.children.push({
                  value: item.Id,
                  label: item.Category.Title,
                })
              })
              data.loading = false;
              callback();
            }
          })
      } else { //第二级
        this.$http.get(this.ApiTransfer("/Hierarchy/List"), {
            params: this.ApiTransfer("/Hierarchy/List", {
              productId: data.value,
              type: 1, //1分类体系2知识元体系
              isUsed: true
            })
          })
          .then((res) => {
            if (res.data.Success) {
              res.data.Data.ItemList.map((item) => {
                if (item.Count > 0) {
                  data.children.push({
                    value: item.Id,
                    label: item.Title,
                    children: [],
                    loading: false
                  })
                } else {
                  data.children.push({
                    value: item.Id,
                    label: item.Title,
                  })
                }
              })
              data.loading = false;
              callback();
            }
          })
      }

    },
    selectChange(value, selectedData) {
      this.select = value[value.length - 1]
    },
    /**
     * [getlist 获取列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    getlist() {
      this.loading = true;
      this.$http.get(this.ApiTransfer("/SaleStrategy/List"), {
          params: this.ApiTransfer("/SaleStrategy/List", {
            keyword: this.keyWord,
            cp: this.page,
            ps: this.pageSize,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.dataList = res.data.Data.ItemList
            this.totalCount = parseInt(res.data.Data.RecordCount);
            this.loading = false;
          }
        })
    },
    /**
     * [openModal 打开新增活动模态框]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    openModal(type, index) { //type:1是新增，2是修改
      this.addUpdate = type
      if (type == 2) {
        this.activeObj = this.dataList[index]
      } else {
        this.activeObj = {}
      }
      this.addActiveModal = true;
    },
    /**
     * [closeModal 子组件通知父组件关闭模态框，请求数据]
     * @Author   赵雯欣
     * @DateTime 2017-12-04
     * @return   {[type]}        [description]
     */
    closeModal() {
      this.getlist()
      this.addActiveModal = false;
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
      this.page = 1
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
     * [getSystemlist 获取系统列表]
     * @Author   赵雯欣
     * @DateTime 2017-12-04
     * @return   {[type]}   [description]
     */
    getSystemlist() {
      this.$http.get(this.ApiTransfer('/Product/List'), {
        params: this.ApiTransfer('/Product/List', {
          keyword: '',
          ps: 999999999,
        })
      }).then((res) => {
        if (res.data.Success) {
          for (let i = 0; i < res.data.Data.ItemList.length; i++) {
            this.productList.push({
              value: res.data.Data.ItemList[i].Id,
              label: res.data.Data.ItemList[i].Title,
              children: [],
              loading: false
            })
          }
        }
      })
    },
    //删除
    delStrategy(id) {
      this.$Modal.confirm({
        title: '您确定要删除该策略么？',
        content: '<p>一旦删除，无法恢复</p>',
        onOk: () => {
          this.$http.post(this.ApiTransfer("/SaleStrategy/Delete"), this.ApiTransfer("/SaleStrategy/Delete", {
              id
            }))
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success('删除成功');
                this.getlist(this.page, this.pageSize)
              }
            })
        }
      });
    },
    /**
     * [setSourceFn 设置资源]
     * @Author   赵雯欣
     * @DateTime 2017-12-15
     */
    setSourceFn() {
      if (!this.categoryId || this.categoryId.pop() == '') {
        this.$Message.warning('请选择分类资源')
      } else {
        this.$http.post(this.ApiTransfer("/ObjectSaleStrategy/CreateContentSaleStrategy"),
            this.ApiTransfer("/ObjectSaleStrategy/CreateContentSaleStrategy", {
              categoryId: this.categoryId.pop(),
              saleStrategyId: this.saleStrategyId
            }))
          .then((res) => {
            if (res.data.Success) {
              this.$Message.success('设置成功')
              this.setResourceModal = false;
            }
          })
      }
    }
  },
  watch: {
    'addActiveModal': function(val) {
      if (!val) {
        setTimeout(() => {
          this.addActiveContent = val
        }, 300)
      } else {
        this.addActiveContent = val
      }
    },
  }
}

</script>
<style lang="less">
.sales-strategy {
  .ivu-poptip-body-content-inner {
    white-space: normal;
  }
}

</style>
