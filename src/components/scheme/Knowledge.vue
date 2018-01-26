<template>
  <div class="bg-knowledge">
    <div class="system-title">
      <Icon type="document-text" size="27"></Icon><span>知识体系管理</span>
    </div>
    <div class="btn-line">
      <Button type="primary" icon="plus-round" @click="openModal">知识体系导入</Button>
      <span style="width: 385px;float: right">
          <Input v-model="keyWord" icon="ios-search" placeholder="请输入知识体系名称" 
          @on-click="getlist(1)"
          @on-enter="getlist(1)"
          ></Input>
        </span>
    </div>
    <div style="margin-bottom: 25px;">
      <Table :loading="Tableloading" border :columns="columns2" :data="knowledgeList"></Table>
    </div>
    <div class="statistics">
      <p>基本统计
        <span @click="$router.push('/wrap/scheme/knowWarp/knowImport')" class="echart-btn">【查看详细报表】</span>
      </p>
      <p>
        <span>分类体系总数:&nbsp;&nbsp;&nbsp;{{totalCount}}</span>
      </p>
    </div>
    <!-- 知识体系导入 -->
    <Modal v-model="showModal" :mask-closable="false" id="modal1" width='630'>
      <p slot="header" style="text-align:center;color:#333;">导入知识体系</p>
      <Tabs value="1">
        <TabPane label="RMS导入" name="1">
          <list v-if="showModal" @childrenEmit="doListEmit"></list>
        </TabPane>
        <TabPane label="本地导入" name="2">
          <Row style="margin-top: 20px;">
            <Col span="8" style='text-align: right;line-height: 30px;padding-right: 15px;'>选择产品：</Col>
            <Col span="16">
            <Select v-model="fileObj.productId" style="width:174px">
              <Option v-for="item in productList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
          </Row>
          <Row style="margin-top: 15px;">
            <Col span="8" style='text-align: right;line-height: 30px;padding-right: 15px;'>上传文件：</Col>
            <Col span="16">
            <Upload v-if="resetUpload" :action="baseUrl+'/Hierarchy/ImportWordData'" :before-upload="handleUpload" :format="['zip','rar']">
              <Button type="ghost" icon="ios-cloud-upload-outline">请上传zip格式的压缩包</Button>
            </Upload>
            <div v-if="file !== null">{{ file.name }}</div>
            </Col>
          </Row>
          <div style="text-align: right;margin-top: 50px;">
            <Button type="ghost" @click="shopUpload">取消</Button>
            <Button type="primary" @click="importData" :loading="loadingStatus">导入</Button>
          </div>
        </TabPane>
      </Tabs>
      <Spin fix v-if="loading">
        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
    </Modal>
  </div>
</template>
<script>
import list from "./List.vue"
export default {
  components: {
    list
  },
  data() {
    return {
      baseUrl: baseUrl,
      Tableloading: false,
      loading: false,
      keyWord: "",
      totalCount: 0,
      columns2: [{
        title: '编号',
        key: 'Id',
        width: 100,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Id)
          ])
        }
      }, {
        title: '知识体系名称',
        key: 'Title',
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
        title: '所属子产品',
        key: 'ProductTitle',
        width: 120,
        ellipsis: true,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.ProductTitle ? params.row.ProductTitle : "暂无")
          ])
        }
      }, {
        title: '版本号',
        key: 'Version',
        width: 90,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Version ? params.row.Version : "暂无")
          ])
        }
      }, {
        title: '导入时间',
        key: 'ImportTime',
        ellipsis: true,
      }, {
        title: '知识元数量',
        key: 'Count',
        width: 110,
      }, {
        title: '使用状态',
        key: 'IsUse',
        width: 100,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text',
                size: 'small',
                type: params.row.IsUse ? 'success' : 'ghost'
              },
              style: {
                color: params.row.IsUse ? '#19be6b' : '',
                backgroundColor: "#fff",
                cursor: 'default'
              }
            }, params.row.IsUse ? "使用中" : "未使用"),
          ])
        }
      }, {
        title: '操作',
        key: 'action',
        width: 150,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                size: 'small',
                type: 'primary'
              },
              on: {
                click: () => {
                  this.$router.push({ path: "/wrap/scheme/knowWarp/knowledgeList", query: { knowledgeId: params.row.Id } })
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
                        content: '<p>该知识体系已经在使用中</p>',
                      })
                    } else {
                      this.useKnowledge(params.row.Id)
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
      knowledgeList: [],
      showModal: false,
      file: null,
      loadingStatus: false,
      fileObj: {
        productId: 0
      },
      url: "",
      uploadObj: {},
      resetUpload: true,
      productList: [],
    }
  },
  mounted() {
    this.getlist()
    this.getProductList()
  },
  methods: {
    /**
     * [getlist 获取页面列表数据]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    getlist(type) {
      if (type == 1 && localStorage.knowledgeKeyWord == this.keyWord.trim()) {
        if (this.keyWord.trim() == '') {
          this.$Message.warning('请输入知识体系名称')
          return false;
        }
      }
      this.Tableloading = true;
      this.$http.get(this.ApiTransfer("/Hierarchy/List"), {
          params: this.ApiTransfer("/Hierarchy/List", {
            keyword: this.keyWord.trim(),
            cp: 1,
            ps: 999,
            type: 2
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.knowledgeList = res.data.Data.ItemList
            this.totalCount = parseInt(res.data.Data.RecordCount);
            localStorage.knowledgeKeyWord = this.keyWord.trim()
            this.Tableloading = false;
          }
        })
    },
    /**
     * [openModal 打开上传模态框]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    openModal() {
      this.showModal = true;
      this.resetUpload = true;
    },
    //上传之前的处理函数
    handleUpload(file) {
      if (file.name.indexOf('zip') > 0 || file.name.indexOf('rar') > 0) {
        this.file = file;
        this.fileObj.file = file.name;
        return false;
      } else {
        this.$Message.warning('请上传zip,rar格式的压缩包');
        return false;
      }
    },
    /**
     * [shopUpload 停止上传]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    shopUpload() {
      this.file = null;
      this.showModal = false;
      this.loadingStatus = false;
      this.resetUpload = false;
    },
    /**
     * [importData 导入知识体系]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    importData() {
      if (this.fileObj.productId == '') {
        this.$Message.warning('请选择产品');
      } else {
        if (this.file) {
          // this.loading = true;
          this.loadingStatus = true;


          var form = new FormData();
          form.append("productId", this.fileObj.productId);
          form.append("file", this.file, this.file.name);
          form.append("BridgePlatformName", transferUrl);
          form.append("ApiName", '/Hierarchy/ImportWordData');
          var _this = this;

          var xhr = $.ajax({
            url: _this.baseUrl + '/Hierarchy/ImportWordData',
            contentType: false,
            type: 'POST',
            data: form,
            processData: false,
            dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
            success: function(data, textStatus, jqXHR) {
              if (data.Success) {
                _this.$Message.success('导入成功')
                _this.getlist()
                _this.file = null;
                _this.loadingStatus = false;
                // _this.loading = false;
                _this.showModal = false;
              } else {
                _this.$Message.error(res.Description)
              }
            }
          })

          //取消请求
          // xhr.abort()
        } else {
          this.$Message.warning('请先选择文件')
        }
      }
    },
    /**
     * [leadingOut 导出体系]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   id [description]
     * @return   {[type]}      [description]
     */
    leadingOut(id) {
      this.Tableloading = true;
      this.$http.post(this.ApiTransfer("/Hierarchy/ExportWordData"), this.ApiTransfer("/Hierarchy/ExportWordData", {
          hierarchyId: id,
        }))
        .then((res) => {
          this.Tableloading = false;
          if (res.data.Success) {
            window.location.href = res.data.Data
          } else {
            this.$Message.error(res.data.Description)
          }
        })
    },
    /**
     * [useKnowledge 使用知识体系]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   id [description]
     * @return   {[type]}      [description]
     */
    useKnowledge(id) {
      this.$http.post(this.ApiTransfer("/Hierarchy/WordUse"), this.ApiTransfer("/Hierarchy/WordUse", {
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
    /**
     * [getProductList 获取产品列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-28
     * @return   {[type]}   [description]
     */
    getProductList() {
      this.$http.get(this.ApiTransfer('/Product/List'), {
        params: this.ApiTransfer('/Product/List', {
          keyword: '',
          ps: 999999999,
        })
      }).then((res) => {
        for (let i = 0; i < res.data.Data.ItemList.length; i++) {
          this.productList.push({
            value: res.data.Data.ItemList[i].Id,
            label: res.data.Data.ItemList[i].Title
          })
        }
      })

    },
    /**
     * [doListEmit 处理子组件]
     * @Author   赵雯欣
     * @DateTime 2017-12-21
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
.bg-knowledge {
  width: 100%;

  .btn-line {
    height: 50px;
    margin-top: 25px;
  }

  .knowledge-title {
    line-height: 32px;
    font-weight: 700;
    font-size: 16px;
    padding-left: 10px;
  }
}

#modal1 {
  position: relative;
  .ivu-modal-footer {
    display: none;
  }

  .ivu-tabs-bar {
    margin-bottom: 0;
  }
}

</style>
