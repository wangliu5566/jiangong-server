<template>
  <div class="ad-position">
    <div class="system-title">
      <Icon type="easel" size="27"></Icon><span>广告位管理</span>
    </div>
    <Table border :loading="loading" :columns="columnsList" :data="dataList" ref="selection"></Table>
    <!-- 设置缺省广告 -->
    <Modal v-model="setImg" :mask-closable="false" id="noFooter1">
      <p slot="header" style="text-align:center;color:#333;">设置缺省广告</p>
       <contentForm1 :type="modalType" :adPositionId="adPositionId" v-if="setImg" @childrenClick="childOK"></contentForm1>
    </Modal>
  </div>
</template>
<script>
  import contentForm1 from './ContentFrom1.vue'
export default {
  components:{
    contentForm1
  },
  data() {
    return {
      loading: false,
      modalLoading: false,
      setImg: false,
      modalType:1,
      file: {},
      fileObj: {
        file: '', //name
        objectId: 0,
        userid: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id,
        customType: 'cover', //文件自定义类型，默认两种：cover-封面，content-文件内容
      },
      CoverUrl: '',
      adPositionId: '', //广告位Id
      dataList: [],
      columnsList: [{
          title: '广告位名称',
          key: 'Title',
          ellipsis: true,
        }, {
          title: '广告位编号',
          key: 'Id',
           ellipsis: true,
          render: (h, params) => {
            return h('div', [
              h("span", params.row.Id ? params.row.Id : "-")
            ])
          }
        }, {
          title: '广告位描述',
          key: 'Description',
           ellipsis: true,
          render: (h, params) => {
            return h('div', [
              h("span", params.row.Description ? params.row.Description : "-")
            ])
          }
        }, {
          title: '尺寸（PX）',
          key: 'Size',
           ellipsis: true,
          render: (h, params) => {
            return h('div', [
              h("span", params.row.Size ? params.row.Size : "-")
            ])
          }
        }, {
          title: '位置示意图',
          key: 'Picture',
           ellipsis: true,
          render: (h, params) => {
            if (!params.row.Picture || params.row.Pictur == '') {
              return h('div', [
                h('span', {


                }, "-"),
              ])
            } else {
              return h('div', [
                h('img', {
                  attrs: {
                    src: params.row.Picture,
                  },
                  style: {
                    width: '10px',
                    height: 'auto',
                    display: 'inline-block',
                  }
                }),
              ])
            }
          }
        },
        {
          title: '所属产品',
          key: 'PlatformType',
          // width: 10,
           ellipsis: true,
          render: (h, params) => {
            return h('div', [
              h("span", params.row.ExtendData && params.row.ExtendData.ProductTitle ? params.row.ExtendData.ProductTitle : "-")
            ])
          }
        },
        {
          title: '平台类型',
          key: 'PlatformTypeTitle',
          ellipsis: true,
          // width: 110,
          render: (h, params) => {
            return h('div', [
              h("span", params.row.ExtendData && params.row.ExtendData.PaidMoney ? params.row.ExtendData.PaidMoney : "-")
            ])
          }
        },
        {
          title: '发布状态',
          key: 'WordCount',
          width: 95,
          render: (h, params) => {
            return h('div', [
              h("Button", {
                props: {
                  size: 'small',
                  type: params.row.IsPublished? 'success' : 'ghost'
                },
                style: {
                  color: params.row.IsPublished? '#19be6b' : '',
                  backgroundColor: "#fff",
                  cursor: 'default'
                }
              }, params.row.IsPublished? '已发布' : "未发布")
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  size: 'small',
                  type: params.row.IsPublished ? "warning" : 'primary'
                },
                on: {
                  click: () => {
                    if(params.row.IsPublished){
                      this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定要撤回该广告内容吗</p>',
                        onOk: () => {
                          this.publishFn(params.row.Id,false)
                        },
                      });
                    }else{
                      this.publishFn(params.row.Id,true)
                    }
                  }
                }
              }, params.row.IsPublished ? "撤回广告" : '发布广告'),
              h("Button", {
                props: {
                  size: 'small',
                  type: 'error',
                },
                on: {
                  click: () => {
                    this.CoverUrl = ''
                    this.adPositionId = params.row.Id
                    this.setImg = true;
                  }
                }
              }, '设置缺省广告')

            ])
          }
        }
      ],

    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
     /**
     * [childOK 子组件触发的方法]
     * @Author   赵雯欣
     * @DateTime 2017-11-28
     * @return   {[type]}   [description]
     */
    childOK(str) {
       this.setImg = false
      if (str == "ok") { //新增或修改成功
        this.getlist()
      } 
    },
    getlist() {
      this.loading = true;
      this.$http.get(this.ApiTransfer("/AdPosition/List"), {
          params: this.ApiTransfer("/AdPosition/List", {
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
     * [handleBeforeUpload 上传图片之前的处理]
     * @Author   赵雯欣
     * @DateTime 2017-11-28
     * @return   {[type]}   [description]
     */
    handleBeforeUpload(file) {
      var names = file.name.toLocaleUpperCase()
      if (names.indexOf('.PNG') > 0 || names.indexOf('.JPG') > 0 || names.indexOf('.GIF') > 0) {
        this.file = file;
        this.fileObj.file = file.name;
      } else {
        this.$Message.warning('请上传JPG、PNG、GIF格式的图片');
        return false;
      }
    },
    /**
     * [getlist 上传图片]
     * @Author   赵雯欣
     * @DateTime 2017-12-06
     * @return   {[type]}   [description]
     */
    handleSuccess(res, file) {
      this.$refs.upload.fileList = []
      if (res.Success) {
        this.CoverUrl = res.Data.Url
      }
    },
     /**
     * [publishFn 发布广告]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    publishFn(id,bool) {
      this.$http.post(this.ApiTransfer("/AdPosition/SetPublishState"), this.ApiTransfer("/AdPosition/SetPublishState", {
          ids: id,
          state:bool,
        }))
        .then((res) => {
          if (res.data.Success) {
            if(bool){
              this.$Message.success("发布成功")
            }else{
              this.$Message.success("操作成功")
            }
            this.getlist()
          } else {
            this.$Message.error(res.data.Description)
          }
        })
    },
  }
}

</script>
<style lang="less">
.ad-position {}

#noFooter1 {
  .ivu-modal-footer {
    display: none;
  }
  /*上传图片*/
  .img-wrap {
    width: 260px;
    height: 140px;
    border: 1px dashed #ddd;
    line-height: 140px;
    text-align: center;
    font-size: 60px;
    cursor: pointer;
  }

  .ivu-upload-list {
    width: 260px;
    margin: 0 auto;
  }

  .wraps1 {
    width: 260px;
    height: auto;

    img {
      width: 100%;
      cursor: pointer;
    }
  }
}

#noFooter {
  .ivu-date-picker {
    width: 100%;
  }
}

</style>
