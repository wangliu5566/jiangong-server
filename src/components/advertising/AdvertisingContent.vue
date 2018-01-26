<template>
  <div class="ad-content">
    <div class="system-title">
      <Icon type="chatbubble-working" size="27"></Icon><span>广告内容管理</span>
    </div>
    <div class="btn-line">
      <Button type="primary" icon="plus-round" @click="openAddModal">创建广告</Button>
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入广告标题" style="width: 300px;float: right" @on-click="getkeyWordList()" @on-enter="getkeyWordList()"></Input>
    </div>
    <div class="tables" style="margin-top: 0">
      <Table border :loading="loading" :columns="columnsList" :data="dataList" ref="selection" @on-selection-change="selectItem"></Table>
      <Button class="btns" disabled v-if="selectIds==''">批量删除</Button>
      <Button class="btns" @click="BatchPutOn()" v-if="selectIds!=''">批量删除</Button>
    </div>
    <div class="page" style="margin-top: -30px;">
      <Page :total="parseInt(totalCount)" :current="parseInt(page)" size="small" show-elevator :page-size="pageSize" show-total show-sizer @on-page-size-change='changeSize' @on-change="change"></Page>
    </div>
    <!-- 新增广告 -->
    <Modal v-model="addModal" :mask-closable="false" id="noFooter">
      <p slot="header" style="text-align:center;color:#333;">{{modalType==1?'新建广告':'修改广告'}}</p>
      <contentForm :type="modalType" v-if="addModal" @childrenClick="childOK"></contentForm>
    </Modal>
  </div>
</template>
<script>
import contentForm from "./ContentForm.vue"
export default {
  components: {
    contentForm,
  },
  data() {
    //验证推送子产品
    const productList = (rule, value, callback) => {
      if (this.publishObj.childrenProduct == '') {
        return callback(new Error('请选择子产品'));
      } else if (this.publishObj.childrenProduct) {
        return callback();
      }
    };
    //验证推送时间
    const productTime = (rule, value, callback) => {
      if (!this.productTime) {
        return callback(new Error('请选择推送时间'));
      } else {
        if (!this.productTime[1]) {
          return callback(new Error('请选择推送时间'));
        } else {
          return callback();
        }
      }
    };
    return {
      loading: false,
      userId: {
        userid: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id
      },
      modalType: 1, //1是新增，2是修改
      keyWord: "",
      oldkeyWord: '',
      totalCount: 0,
      page: "1",
      pageSize: 10,
      selectIds: "",
      productTime: '',
      options: {
        disabledDate(date) {
          let initdate = new Date(localStorage.StartTime) - 86399999
          let initdate1 = new Date(localStorage.EndTime)
          return (date && date.valueOf() < initdate) || (date && date.valueOf() > initdate1)
        }
      },
      columnsList: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '广告标题',
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
          title: '开始时间',
          key: 'StartTime',
          // width: 118,
          ellipsis: true,
          render: (h, params) => {
            return h("span", params.row.StartTime ? params.row.StartTime.slice(0, 10) : "-")
          }
        }, {
          title: '到期时间',
          key: 'EndTime',
          // width: 118,
          ellipsis: true,
          render: (h, params) => {
            return h("span", params.row.EndTime && !params.row.IsDefaultAd ? params.row.EndTime.slice(0, 10) : "-")
          }
        }, {
          title: '所属广告位',
          // width: 150,
          ellipsis: true,
          render: (h, params) => {
            return h("span", {}, params.row.ExtendData.AdPositionTitle ? params.row.ExtendData.AdPositionTitle : "-")

          }
        }, {
          title: '平台类型',
          ellipsis:true,
          // width: 95,
          key: 'PlatformTypeTitle',
          render: (h, params) => {
            return h("span", {}, params.row.ExtendData.PlatformProduct ? params.row.ExtendData.PlatformProduct : '-')
          }
        },
        {
          title: '剩余使用时间',
          key: 'RestDay',
          // width: 125,
          render: (h, params) => {
            return h("span", {}, params.row.IsDefaultAd ? '-' : params.row.ExtendData && params.row.ExtendData.RestDay && params.row.ExtendData.RestDay > 0 ? params.row.ExtendData.RestDay + '天' : '0')
          }
        },
        {
          title: '关联广告商',
          key: 'AdTitle',
          // width: 110,
          ellipsis: true,
          render: (h, params) => {
            return h('div', [
              h("span", params.row.ExtendData.AdvertiesTitle ? params.row.ExtendData.AdvertiesTitle : "-")
            ])
          }
        }, {
          title: '状态',
          key: 'IsPublished',
          width: 90,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  type: params.row.IsPublished ? 'success' : 'ghost'
                },
                style: {
                  color: params.row.IsPublished ? '#19be6b' : '',
                  backgroundColor: "#fff",
                  cursor: 'default'
                }
              }, params.row.IsPublished ? "已使用" : "未使用"),
            ])
          }
        }, {
          title: '操作',
          key: 'action',
          width: 130,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                },
                on: {
                  click: () => {
                    this.modalType = 2;
                    localStorage.adContent = JSON.stringify(this.dataList[params.index])
                    this.addModal = true;
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                },
                on: {
                  click: () => {
                    if (params.row.IsPublished) {
                      this.$Message.warning("不能删除已发布的广告")
                    } else {
                      this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定要删除该广告内容吗，一旦删除，无法恢复哟！</p>',
                        onOk: () => {
                          this.$http.post(this.ApiTransfer("/Ad/Delete"), this.ApiTransfer("/Ad/Delete", {
                              ids: params.row.Id,
                              // isEnable:isEnable
                            }))
                            .then((res) => {
                              if (res.data.Success) {
                                this.$Message.success('删除成功')
                                this.getlist()
                              }
                            })
                        },
                      });
                    }
                  }
                }
              }, '删除'),
            ]);
          }
        }
      ],
      dataList: [],
      addModal: false,
      updateModal: false,
      formItem: {
        Title: '',
        ContactPerson: '',
        MobileNumber: '',
      },
      updateItem: {
        Title: '',
        ContactPerson: '',
        MobileNumber: '',
      },
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    getTimeFn(data) {
      return date && date.valueOf() > Date.now();
    },
    /**
     * [childOK 子组件触发的方法]
     * @Author   赵雯欣
     * @DateTime 2017-11-28
     * @return   {[type]}   [description]
     */
    childOK(str) {
      if (str == "ok") { //新增或修改成功
        this.addModal = false;
        this.getlist()
      } else if (str == "close") { //关闭模态框
        this.addModal = false
      }
    },
    /**
     * [getkeyWordList 搜索关键字]
     * @Author   赵雯欣
     * @DateTime 2017-12-13
     * @return   {[type]}   [description]
     */
    getkeyWordList() {
      if (this.oldkeyWord == this.keyWord.trim() && this.keyWord.trim() == '') {
        this.$Message.warning('请输入广告标题')
        return false;
      }
      this.loading = true;
      this.page = 1;
      this.$http.get(this.ApiTransfer('/Ad/List'), {
          params: this.ApiTransfer('/Ad/List', {
            keyword: this.keyWord.trim(),
            cp: this.page,
            ps: this.pageSize,
            productId: 0
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.dataList = res.data.Data.ItemList
            this.totalCount = parseInt(res.data.Data.RecordCount);
            this.oldkeyWord = this.keyWord.trim()
            this.loading = false;
          }
        })
    },
    /**
     * [getlist 得到广告列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    getlist() {
      this.loading = true;
      this.$http.get(this.ApiTransfer('/Ad/List'), {
          params: this.ApiTransfer('/Ad/List', {
            keyword: this.oldkeyWord,
            cp: this.page,
            ps: this.pageSize,
            productId: 0
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.dataList = res.data.Data.ItemList
            this.totalCount = parseInt(res.data.Data.RecordCount);
            this.loading = false;
            this.selectIds = '';
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
     * [handleSelectAll 全选或者全取消]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   status [description]
     * @return   {[type]}          [description]
     */
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    /**
     * [selectItem 全选功能得到ids]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   status [description]
     * @return   {[type]}          [description]
     */
    selectItem(status) {
      var _this = this;
      var arr1 = []
      status.forEach(function(item, index) {
        arr1.push(item.Id)
      })
      _this.selectIds = arr1.join(",")
    },
    /**
     * [BatchPutOn 批量删除]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     */
    BatchPutOn() {
      if (this.selectIds == "") {
        this.$Message.warning('请选择要删除的内容')
      } else {
        var arr = this.selectIds.split(',')
        var isCanDel = true
        console.log(this.selectIds)

        arr.forEach((item, index) => {
          this.dataList.forEach((i, ind) => {
            if (item == i.Id) {
              if (i.IsPublished) {
                isCanDel = false
              }
            }
          })
        })

        if (isCanDel) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>确定要删除该广告内容吗，一旦删除，无法恢复哟！</p>',
            onOk: () => {
              this.$http.post(this.ApiTransfer("/Ad/Delete"), this.ApiTransfer("/Ad/Delete", {
                  ids: this.selectIds,
                  // isEnable:isEnable
                }))
                .then((res) => {
                  if (res.data.Success) {
                    this.$Message.success('删除成功')
                    this.selectIds = ""
                    this.getlist()
                  }
                })
            },
          });
        } else {
          this.$Message.warning("不能删除已发布的广告")
        }
      }
    },
    /**
     * [openAddModal 打开新增广告商模态框，清空数据]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    openAddModal() {
      this.addModal = true;
      this.modalType = 1;
    },
  },
}

</script>
<style lang="less">
.ad-content {
  /*min-width: 1120px;*/
}

</style>
