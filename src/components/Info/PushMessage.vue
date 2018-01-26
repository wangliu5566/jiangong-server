<template>
  <div class="push-message">
    <div class="system-title">
      <Icon type="android-send" size="27"></Icon><span>推送消息管理</span>
    </div>
    <div class="btn-line">
      <Button type="primary" icon="plus-round" @click="openAddModal">新增推送消息</Button>
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入消息标题或编号" style="width: 300px;float: right" @on-click="getkeyWordList()" @on-enter="getkeyWordList()"></Input>
    </div>
    <div>
      <Table border :loading="loading" :columns="columns" :data="msgList"></Table>
    </div>
    <div class="page">
      <Page :total="parseInt(totalCount)" size="small" show-elevator :current="parseInt(page)" :page-size="pageSize" show-total show-sizer @on-page-size-change='changeSize' @on-change="change"></Page>
    </div>
    <!-- 新增修改推送信息 -->
    <Modal v-model="addModal" :mask-closable="false" id="modal">
      <p slot="header" style="text-align:center;color:#333;">{{creatOrUpdata==1?'新增推送消息':'修改推送消息'}}</p>
      <Form :model="formItem" :label-width="90" ref="formValidate" :rules="ruleValidate">
        <FormItem label="消息标题:" prop="Title">
          <Input v-model="formItem.Title" placeholder="请输入消息标题"></Input>
        </FormItem>
        <FormItem label="消息内容:" prop="Contents">
          <Input v-model="formItem.Contents" type="textarea" :rows="3" placeholder="请输入消息内容"></Input>
        </FormItem>
      </Form>
      <div style="text-align: center;">
        <Button v-if="creatOrUpdata==1" type="primary" @click="addMessage('formValidate')">确定</Button>
        <Button v-if="creatOrUpdata==2" type="primary" @click="updateMessage('formValidate')">确定</Button>
        <Button type="ghost" @click="addModal=false">取消</Button>
      </div>
    </Modal>
    <!--推送信息 -->
    <Modal v-model="pushModal" :mask-closable="false" id="modal">
      <p slot="header" style="text-align:center;color:#333">推送消息</p>
      <Row>
        <Col span="5" style="line-height: 32px;text-align: right;padding-right: 10px;"> 推送消息至：
        </Col>
        <Col span="18">
        <Select v-model="childProduct">
          <Option v-for="item in productList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </Col>
      </Row>
      <div style="text-align: center;margin-top: 30px">
        <Button type="primary" @click="pushFn()">确定</Button>
        <!-- <Button type="ghost" @click="pushModal=false">取消</Button> -->
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
     const validateTitle = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('请填写消息标题'));
      } else if (value.trim().length>60) {
        return callback(new Error('消息标题长度不能超过60'));
      } else {
        callback()
      }
    };
    const validateContent = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('请填写消息内容'));
      } else if (value.trim().length>200) {
        return callback(new Error('消息内容长度不能超过200'));
      } else {
        callback()
      }
    };
    return {
      loading: false,
      keyWord: "",
      oldkeyWord:'',
      totalCount: 0,
      page: "1",
      pageSize: 10,
      msgList: [],
      addModal: false,
      creatOrUpdata:1, //1是新增，2是修改
      formItem: {
        Title: "",
        Contents: ""
      },
      pushModal: false,

      productList: [{
        value: '0',
        label: '全部'
      }], //推送到子产品的列表
      childProduct: "0",
      
      ruleValidate: {
        Title: [
          {required: true,validator: validateTitle,trigger: 'blur'},
        ],
        Contents: [
          {required: true,validator: validateContent,trigger: 'blur'},
        ],
      },
      columns: [{
        title: '编号',
        key: 'Id',
        width: 100,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Id)
          ])
        }
      }, {
        title: '消息标题',
        key: 'Title',
        ellipsis: true,
        render: (h, params) => {
          if (!!params.row.Title && params.row.Title.length > 7) {
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
          } else {
            return h('div', [
              h("span", params.row.Title ? params.row.Title : "-")
            ])
          }
        }
      }, {
        title: '消息内容',
        key: 'Contents',
        ellipsis: true,
        render: (h, params) => {
          if (!!params.row.Contents && params.row.Contents.length > 8) {
            return h('div', [
              h("Tooltip", {
                props: {
                  trigger: "hover",
                  content: params.row.Contents ? params.row.Contents : "-",
                  placement: "top-start"
                },
                style: {
                  width: '100%',
                  textOverflow: 'ellipsis'
                }
              }, params.row.Contents ? params.row.Contents : "-")
            ])
          } else {
            return h('div', [
              h("span", params.row.Contents ? params.row.Contents : "-")
            ])
          }
        }
      }, {
        title: '创建人',
        key: 'UserTitle',
        width: 160,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.ExtendData && params.row.ExtendData.NickName ? params.row.ExtendData.NickName : "-")
          ])
        }
      }, {
        title: '创建时间',
        key: 'CreateTime',
        width: 120,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.CreateTime ? params.row.CreateTime.slice(0, 10) : "-")
          ])
        }
      }, {
        title: '推送状态',
        key: 'IsPublished',
        width: 100,
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
            }, params.row.IsPublished ? "推送完成" : "未推送"),
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
                type: 'primary',
                size: 'small',
                disabled: params.row.IsPublished ? true : false
              },
              on: {
                click: () => {
                  if (!params.row.IsPublished) {
                    this.pushModal = true;
                    this.msgId = params.row.Id
                  } else {
                    this.$Message.warning('该消息已推送')
                  }
                }
              }
            }, '推送消息'),
            h('Dropdown', {
              props: {
                trigger: "click",
              },
              on: {
                "on-click": (name) => {
                  if (name == "update") {
                     if (!params.row.IsPublished) {
                      this.creatOrUpdata = 2;
                      this.formItem = Object.assign({}, this.msgList[params.index])
                      this.addModal = true;
                    }
                  } else if (name == "del") {
                    this.Delete(params.row.Id)
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
                    name: 'update',
                    disabled: params.row.IsPublished ? true : false
                  }
                }, '修改'),
                h('DropdownItem', {
                  props: {
                    name: 'del'
                  }
                }, '删除')
              ])
            ])
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
    /**
     * [getkeyWordList 搜索关键字]
     * @Author   赵雯欣
     * @DateTime 2017-12-13
     * @return   {[type]}   [description]
     */
    getkeyWordList() {
      if (this.oldkeyWord ==this.keyWord.trim()&&this.keyWord.trim() == '') {
        this.$Message.warning('请输入消息标题或编号')
        return false;
      }
      this.loading = true;
      this.$http.get(this.ApiTransfer("/Message/BackList"), {
          params: this.ApiTransfer("/Message/BackList", {
            keyword:this.keyWord.trim(),
            cp: this.page,
            ps: this.pageSize,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.msgList = res.data.Data.ItemList
            this.totalCount = parseInt(res.data.Data.RecordCount);
            this.oldkeyWord = this.keyWord.trim()
            this.loading = false;
          }
        })
    },
    /**
     * [getlist 获取消息列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    getlist() {
      this.loading = true;
      this.$http.get(this.ApiTransfer("/Message/BackList"), {
          params: this.ApiTransfer("/Message/BackList", {
            keyword:this.oldkeyWord,
            cp: this.page,
            ps: this.pageSize,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.msgList = res.data.Data.ItemList
            this.totalCount = parseInt(res.data.Data.RecordCount);
            this.loading = false;
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
      this.page=1
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
     * [openAddModal 打开新建消息模态框]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    openAddModal() {
      this.creatOrUpdata =1;
      this.addModal = true;
      this.formItem.Title = ''
      this.formItem.Contents = ''
    },
    /**
     * [addMessage description]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   type [description]
     * @return   {[type]}        [description]
     */
    addMessage(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer("/Message/BackCreate"), this.ApiTransfer("/Message/BackCreate", {
              title: this.formItem.Title,
              contents: this.formItem.Contents,
              userId: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id
            }))
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success("新增成功")
                this.addModal = false;
                this.getlist()
              }
            })
        }
      })
    },
    //修改推送消息
    updateMessage(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer("/Message/BackUpdate"), this.ApiTransfer("/Message/BackUpdate", {
              id: this.formItem.Id,
              title: this.formItem.Title,
              contents: this.formItem.Contents,
            }))
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success("修改成功");
                this.addModal = false;
                this.getlist()
              }
            })
        }
      })
    },
    //系统列表
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
              label: res.data.Data.ItemList[i].Title
            })
          }
        }
      })
    },
    /**
     * [pushFn 推送消息]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   type [description]
     * @return   {[type]}        [description]
     */
    pushFn() {
      this.$http.post(this.ApiTransfer("/Message/Push"), this.ApiTransfer("/Message/Push", {
          id: this.msgId,
          productIds: this.childProduct
        }))
        .then((res) => {
          if (res.data.Success) {
            this.$Message.success('推送成功')
            this.getlist()
            this.pushModal = false;
          }
        })
    },
    /**
     * [Delete 删除消息]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     */
    Delete(id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要删除该消息吗，一旦删除，无法恢复哟！</p>',
        onOk: () => {
          this.$http.post(this.ApiTransfer("/Message/Delete"), this.ApiTransfer("/Message/Delete", {
              ids: id,
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
    }
  },
}

</script>
<style lang="less">
.push-message {

  .btn-line {
    height: 50px;
    margin-top: 25px;
  }
  .page {
    height: 50px;
    padding-top: 15px;

    .ivu-page {
      float: right;
    }
  }
}

#modal {
  .ivu-modal-footer {
    display: none;
  }
}

</style>
