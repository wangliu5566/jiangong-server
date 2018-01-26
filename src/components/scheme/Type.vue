<template>
  <div class="bg-type">
    <div class="system-title">
      <Icon type="pricetag" size="27"></Icon><span>分类体系管理</span>
    </div>
    <div class="btn-line">
      <Button type="primary" icon="plus-round" @click="openModal">分类体系导入</Button>
    </div>
    <div style="margin-bottom: 25px">
      <Table border :loading="loading" :columns="columns2" :data="typeList"></Table>
    </div>

   <div class="statistics">
      <p>基本统计
        <span @click="$router.push('/wrap/scheme/typeWrap/TypeImportList')" class="echart-btn">【查看详细报表】</span>
      </p>
      <p>
        <span>分类体系总数:&nbsp;&nbsp;&nbsp;{{totalCount}}</span>
      </p>
    </div>
    <!-- 分类体系导入 -->
    <Modal v-model="showModal" :mask-closable="false" id="noFooter" width="630">
      <p slot="header" style="text-align:center;color:#333;">导入分类体系</p>
      <list1 @childrenEmit="doEmit" v-if="showModal"></list1>
    </Modal>
  </div>
</template>
<script>
import list1 from "./TypeModal.vue"
export default {
  components: {
    list1
  },
  data() {
    return {
      baseUrl: baseUrl,
      loading: false,
      keyWord: "",
      totalCount: 0,
      columns2: [{
        title: '编号',
        key: 'Id',
        width: 110,
      }, {
        title: '分类体系名称',
        key: 'Title',
        // render: (h, params) => {
        //   return h('div', [
        //     h("Tooltip", {
        //       props: {
        //         trigger: "hover",
        //         content: params.row.Title ? params.row.Title : "-",
        //         placement: "top-start"
        //       },
        //       style: {
        //         width: '100%',
        //         textOverflow: 'ellipsis'
        //       }
        //     }, params.row.Title ? params.row.Title : "-")
        //   ])
        // }
      }, {
        title: '所属子产品',
        key: 'ProductTitle',
        width: 120,
        ellipsis: true,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.ProductTitle ? params.row.ProductTitle : "-")
          ])
        }
      }, {
        title: '版本号',
        width: 100,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Version ? params.row.Version : '-')
          ])
        }
      }, {
        title: '导入时间',
        key: 'ImportTime',
        ellipsis:true,
        // render: (h, params) => {
        //   return h('div', [
        //     h("span", params.row.ImportTime ? params.row.ImportTime : '-')
        //   ])
        // }
      }, {
        title: '分类数量',
        key: 'Count',
        width: 100,
      },  {
        title: '使用状态',
        key: 'IsUse',
        width: 100,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text',
                size: 'small',
                type:params.row.IsUse ? 'success' : 'ghost'
              },
              style: {
                color: params.row.IsUse ? '#19be6b' : '',
                backgroundColor: "#fff",
                cursor: 'default'
              }
            }, params.row.IsUse  ? "使用中" : "未使用"),
          ])
        }
      },{
        title: '操作',
        key: 'action',
        width: 150,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text',
                size: 'small',
                type: "primary"
              },
              on: {
                click: () => {
                  this.$router.push({path: "/wrap/scheme/typeWrap/typeList",query: {typeId: params.row.Id}})
                }
              }
            }, '查看详情'),
            h('Dropdown', {
              props: {
                trigger: "click",
              },
              on: {
                "on-click": (name) => {
                  if (name == "use") {
                    if (params.row.IsUse) { //正在使用1
                      this.$Modal.warning({
                        title: '提示',
                        content: '<p>该分类体系已经在使用中</p>',
                      })
                    } else {
                      this.useType(params.row.Id)
                    }
                  } else if (name == "leadingOut") {
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
                    name: 'leadingOut'
                  }
                }, '导出'),
                h('DropdownItem', {
                  props: {
                    name: 'use',
                    // disabled:params.row.IsUse?true:false
                  }
                }, '使用'),
              ])
            ])
          ]);
        }
      }],
      typeList: [],
      showModal: false,
      loadingStatus: false,
      url: "",
      uploadObj: {},
      productList: []
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    getlist() {
      this.loading = true;
      this.$http.get(this.ApiTransfer("/Hierarchy/List"), {
          params: this.ApiTransfer("/Hierarchy/List", {
            cp: 1,
            ps: 100,
            type: 1
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.typeList = res.data.Data.ItemList;
            this.totalCount = parseInt(res.data.Data.RecordCount);
            this.loading = false;
          }
        })
    },
    //打开上传模态框
    openModal() {
      this.showModal = true;
    },
    //导出
    leadingOut(id) {
      this.loading = true;
      this.$http.post(this.ApiTransfer("/Hierarchy/ExPortCategoryPortData"), this.ApiTransfer("/Hierarchy/ExPortCategoryPortData", {
          hierarchyId: id,
        }))
        .then((res) => {
          this.loading = false;
          if (res.data.Success) {
            window.location.href = res.data.Data
          } else {
            this.$Message.error(res.data.Description)
          }
        })
    },
    /**
     * [useType 使用分类体系]
     * @Author   赵雯欣
     * @DateTime 2017-12-14
     * @param    {[type]}   id [description]
     * @return   {[type]}      [description]
     */
    useType(id) {
      this.$http.post(this.ApiTransfer("/Hierarchy/CategoryUse"), this.ApiTransfer("/Hierarchy/CategoryUse", {
          id: id,
          isUse: true
        }))
        .then((res) => {
          if (res.data.Success) {
            this.$Message.success('设置使用成功')
            this.getlist();
          }
        })
    },
    doEmit(index){
      this.showModal = false;
      if(index==1){
        this.getlist()
      }
    }
  }
}

</script>
<style lang="less">
.bg-type {
  width: 100%;

  .btn-line {
    height: 50px;
    margin-top: 25px;
  }

  .btn-line .echart-btn {
    float: right;
    padding: 0 20px;
    line-height: 32px;
    font-size: 14px;
  }
}

#noFooter {}

</style>
