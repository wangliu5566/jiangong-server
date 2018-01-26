<template>
  <div class="message-container">
    <Row>
      <div class="system-title">
        <Icon type="speakerphone" size="24"></Icon>
        <span>公告管理</span>
      </div>
    </Row>
    <Row>
      <Col span='8'>
      <Button type="primary" @click="addNewMessage">
        <Icon type="plus-round"></Icon> 新增公告</Button>
      </Button>
      <span>&nbsp;</span>
      </Col>
      <Col span="8">
      <span>&nbsp;</span>
      </Col>
      <Col span="8">
      <Input v-model="filter.searchKey" icon="ios-search-strong" placeholder="请输入公告标题" @on-click="searchInfo" @on-enter="searchInfo"></Input>
      </Col>
    </Row>
    <Row class="pt10 pb10">
      <Table border :loading="loadingData" :columns="accountColumns" :data="accountDatas" @on-select="tableSelectCurrent" @on-select-all='tableSelectAll' @on-select-cancel="tableCancelCurrent" @on-selection-change="tableChange" highlight-row no-data-text="暂无数据">
      </Table>
    </Row>
    <Row class="tr pt5 pb10">
      <Page :total="tp" :current='cp' :page-size="ep" size="small" show-total show-sizer show-elevator :page-size-opts='[10,20,30]' @on-change="currentPageChange" @on-page-size-change="eachPageChange"></Page>
    </Row>
    <!-- 新增公告modal -->
    <Modal v-model="addNewMessageModel" :mask-closable="false" width="600" title="新增公告">
       <p slot="header" style="text-align:center;color:#333;">新增公告</p>

      <div class="edit-model-body">
        <Form ref="addNewMessageForm" :model="addNewMessageDatas" :label-width="120" :rules="addNewMessageRules">
          <FormItem label="公告标题" prop="title" required>
            <Input v-model="addNewMessageDatas.title" placeholder="输入公告标题"></Input>
          </FormItem>
          <FormItem label="公告内容" prop="contents" required>
            <Input v-model="addNewMessageDatas.contents" type="textarea" :rows="4" placeholder="输入公告内容"></Input>
          </FormItem>
          <!-- <FormItem label="关联链接" prop="abstracts" required>
            <Input v-model="addNewMessageDatas.abstracts" placeholder="输入关联链接"></Input>
          </FormItem> -->
          <!-- <FormItem label="是否为系统公告" required >
            <RadioGroup v-model="addNewMessageDatas.isSystem">
              <Radio label="0">否</Radio>
              <Radio label="1">是</Radio>
            </RadioGroup>
          </FormItem> -->
        </Form>
      </div>
      <div slot="footer" style="text-align:center;">
        
        <Button type="primary" @click="submitAddNewMessage('addNewMessageForm')">确认新增</Button>
        <Button type="ghost" @click="addNewMessageModel=false">返回</Button>
      </div>
    </Modal>
    <!-- 修改公告modal -->
    <Modal v-model="editMessageModel" :mask-closable="false" width="600" title="修改公告">
       <p slot="header" style="text-align:center;color:#333;">修改公告</p>

      <div class="edit-model-body">
        <Form ref="editMessageForm" :model="editMessageDatas" :label-width="120" :rules="addNewMessageRules">
          <FormItem label="公告标题" prop="title" required>
            <Input v-model="editMessageDatas.title" placeholder="输入公告标题"></Input>
          </FormItem>
          <FormItem label="公告内容" prop="contents" required>
            <Input v-model="editMessageDatas.contents" type="textarea" :rows="4" placeholder="输入公告内容"></Input>
          </FormItem>
          <!-- <FormItem label="关联链接" prop="abstracts" required>
            <Input v-model="editMessageDatas.abstracts" placeholder="输入关联链接"></Input>
          </FormItem> -->
          <!-- <FormItem label="是否为系统公告" required>
            <RadioGroup v-model="editMessageDatas.isSystem">
              <Radio label="0">否</Radio>
              <Radio label="1">是</Radio>
            </RadioGroup>
          </FormItem> -->
        </Form>
      </div>
      <div slot="footer" style="text-align:center;">
       
        <Button type="primary" @click="submitEditMessage('editMessageForm')">确认修改</Button>
         <Button type="ghost" @click="editMessageModel=false">返回</Button>
      </div>
    </Modal>
    <!-- 确认推送公告modal -->
    <Modal v-model="pushMessageModel" :mask-closable="false" width="600" title="推送公告">
       <p slot="header" style="text-align:center;color:#333;">推送公告</p>

      <div class="edit-model-body">
        <Form :model="editMessageDatas" :label-width="150" ref="pushMessageForm">
          <FormItem label="公告标题">
            <Input v-model="editMessageDatas.title" readonly></Input>
          </FormItem>
          <FormItem label="公告内容">
            <Input v-model="editMessageDatas.contents" type="textarea" :rows="4" readonly></Input>
          </FormItem>
          <!-- <FormItem label="关联链接" prop="abstracts" required>
            <Input v-model="editMessageDatas.abstracts" placeholder="输入关联链接"></Input>
          </FormItem> -->
          <!-- <FormItem label="是否为系统公告" required>
            <RadioGroup v-model="editMessageDatas.isSystem">
              <Radio label="0">否</Radio>
              <Radio label="1">是</Radio>
            </RadioGroup>
          </FormItem> -->
        </Form>
      </div>
      <div slot="footer" style="text-align: center;">
        
        <Button type="primary" @click="submitPushMessage('pushMessageForm')">确认推送</Button>
        <Button type="ghost" @click="pushMessageModel=false">返回</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import validator from '@/validate.js'
export default {
  beforeRouteLeave(to, from, next) {
    window.sessionStorage.setItem('bg_user_filter', '')
    next();
  },
  data() {
    const filters = window.sessionStorage.getItem('bg_user_filter');
    const userInfo = JSON.parse(window.sessionStorage.getItem('bg_user_info'));
    return {
      baseUrl: baseUrl,
      //筛选条件
      filter: {
        searchKey: '',
      },
      loadingData: false,

      oldKey: '',

      // model数据
      addNewMessageModel: false,
      editMessageModel: false,
      pushMessageModel: false,

      //新增公告数据
      addNewMessageDatas: {
        title: '',
        contents: '',
      },

      //修改公告数据
      editMessageDatas: {
        title: '',
        contents: '',
      },

      //验证规则
      addNewMessageRules: {
        title: [{
          required: true,
          message: '请输入公告标题',
          trigger: 'blur'
        }],
        contents: [{
          required: true,
          message: '请输入公告内容',
          trigger: 'blur'
        }]
      },

      //分页
      tp: 0,
      cp: filters != null && filters != '' && JSON.parse(filters) != {} && JSON.parse(filters).cp ? parseInt(JSON.parse(filters).cp) : 1,
      ep: filters != null && filters != '' && JSON.parse(filters) != {} && JSON.parse(filters).ep ? parseInt(JSON.parse(filters).ep) : 10,

      //表格配置
      accountColumns: [
        // {
        //   title: 'ID',
        //   key: 'Id',
        //   width: 100
        // }, 
        {
          title: '公告标题',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.Title
              }
            }, params.row.Title)
          }
        }, {
          title: '公告内容',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.Contents ? params.row.Contents : ''
              }
            }, params.row.Contents ? params.row.Contents : '-')
          }
        },
        {
          title: '状态',
          ellipsis: true,
          render: (h, params) => {
            return h('Tag', {
              props: {
                type: 'border',
                color: params.row.IsPublished == true ? 'green' : 'yellow'
              }
            }, params.row.IsPublished == true ? '已推送' : '未推送')
          }
        },
        {
          title: '创建时间',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.CreateTime
              }
            }, params.row.CreateTime)
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
                  disabled: params.row.IsPublished,
                  size:'small'
                },
                on: {
                  click: () => {
                    this.pushMessage(params.row, params.index);
                  }
                }
              }, '推送公告'),
              h('Dropdown', {
                props: {
                  trigger: "hover",
                  placement: 'bottom-end'
                },
                on: {
                  'on-click': (name) => {
                    if (name == 'editMessage') {
                      this.editMessage(params.row, params.index)
                    } else if (name == 'deleteMessage') {
                      this.deleteMessage(params.row, params.index)
                    }
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'info',
                    size:'small'
                  },
                  style: {
                    marginLeft: '10px'
                  },
                }, '更多'),
                h('DropdownMenu', {
                  slot: 'list',
                  style: {
                    textAlign: 'center'
                  }
                }, [
                  h('DropdownItem', {
                    props: {
                      name: "deleteMessage",

                    }
                  }, '删除'),
                  h('DropdownItem', {
                    props: {
                      name: "editMessage",
                      disabled: params.row.IsPublished
                    }
                  }, '修改')
                ])
              ]),
            ])
          }
        }
      ],

      //表格数据
      accountDatas: [],

      //表格选中项
      selectItem: [],
    }
  },
  methods: {
    /**
     * [getListData 获取公告列表]
     * @Author   李志明
     * @DateTime 2017-11-06
     * @return   {[type]}   [description]
     */
    getListData(isSearch = false) {
      this.loadingData = true;
      this.$http.get(this.ApiTransfer('/Message/GetMessageList'), {
        params: this.ApiTransfer('/Message/GetMessageList', {
          keyWord: isSearch ? this.filter.searchKey.trim() : this.oldKey,
          ps: this.ep,
          cp: this.cp,
        })
      }).then((res) => {
        this.accountDatas = res.data.Data.ItemList;
        this.tp = parseInt(res.data.Data.RecordCount)
        this.loadingData = false;
        if (isSearch) {
          this.oldKey = this.filter.searchKey.trim();
        }
      })
    },

    /**
     * [addNewMessage 新增公告]
     * @Author   李志明
     * @DateTime 2017-11-06
     */
    addNewMessage() {
      this.addNewMessageModel = true;
    },

    /**
     * [searchInfo 关键字搜索列表]
     * @Author   李志明
     * @DateTime 2017-11-06
     * @return   {[type]}   [description]
     */
    searchInfo() {
      if (this.oldKey == this.filter.searchKey.trim() && this.filter.searchKey.trim() == '') {
        this.$Message.warning('请输入公告标题')
      } else {
        this.cp = 1;
        this.updateFilter({ 'searchKey': this.filter.searchKey });
        this.selectItem = [];
        this.getListData(true);
      }
    },

    //分页
    currentPageChange(value) {
      this.cp = value;
      this.updateFilter({ 'cp': this.cp });
      this.getListData();
    },

    eachPageChange(value) {
      this.ep = value;
      this.cp = 1;
      this.updateFilter({ 'ep': this.ep });
      this.getListData();
    },
    //表格单选/单选
    tableSelectCurrent(selection) {
      this.selectItem = selection;
    },
    tableSelectAll(selection) {
      this.selectItem = selection;
    },
    tableCancelCurrent(selection, row) {
      this.selectItem = selection;
    },
    tableChange(selection) {
      this.selectItem = selection;
    },

    /**
     * [deleteMessage 删除公告]
     * @Author   李志明
     * @DateTime 2017-11-06
     * @param    {[Object]}   row   [当前行数据]
     * @param    {[String]}   index [当前行角标]
     * @return   {[type]}         [description]
     */
    deleteMessage(row, index) {
      this.$Modal.confirm({
        title: '操作提示',
        content: '确认删除该公告？',
        onOk: () => {
          this.$http.post(this.ApiTransfer('/Message/Delete'), this.ApiTransfer('/Message/Delete', {
            ids: row.Id,
          })).then((res) => {
            if (res.data.Success) {
              this.$Message.success('删除操作成功');
              this.getListData();
            }
          })
        },
      });
    },

    submitAddNewMessage(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          this.$http.post(this.ApiTransfer('/Message/CreateMessage'), this.ApiTransfer('/Message/CreateMessage', this.addNewMessageDatas))
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success('新增公告操作成功');
                this.addNewMessageModel = false;
                this.getListData();
              } else {
                this.$Message.error(res.data.Description);
              }
            })
        }
      })
    },

    /**
     * [editMessage 修改公告]
     * @Author   李志明
     * @DateTime 2017-11-06
     * @param    {[Object]}   row   [description]
     * @param    {[String]}   index [description]
     * @return   {[type]}         [description]
     */
    editMessage(row, index) {
      this.editMessageDatas = Object.assign({}, this.editMessageDatas, {
        contents: row.Contents,
        title: row.Title,
        id:row.Id
      });
      this.editMessageModel = true;
    },

    /**
     * [editMessage 修改公告]
     * @Author   李志明
     * @DateTime 2017-11-06
     * @param    {[Object]}   row   [description]
     * @param    {[String]}   index [description]
     * @return   {[type]}         [description]
     */
    pushMessage(row, index) {
      this.editMessageDatas = Object.assign({}, this.editMessageDatas, {
        contents: row.Contents,
        title: row.Title,
        id: row.Id
      });
      this.pushMessageModel = true;
    },

    /**
     * [submitPushMessage 确认推送公告]
     * @Author   李志明
     * @DateTime 2017-12-05
     * @param    {[String]}   formName [表单名称]
     * @return   {[type]}            [description]
     */
    submitPushMessage(formName) {
      this.$http.post(this.ApiTransfer('/Message/ChanngePublishMessage'), this.ApiTransfer('/Message/ChanngePublishMessage', {
          id: this.editMessageDatas.id,

          IsPublish:!this.editMessageDatas.IsPublished
        }))
        .then((res) => {
          if (res.data.Success) {
            this.$Message.success('公告推送成功');
            this.pushMessageModel = false;
            this.getListData();
          }
        })
    },


    /**
     * [submitEditMessage 修改公告]
     * @Author   李志明
     * @DateTime 2017-11-07
     * @param    {[String]}   formName [公告form名]
     * @return   {[type]}            [description]
     */
    submitEditMessage(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer('/Message/UpdateMessage'), this.ApiTransfer('/Message/UpdateMessage',this.editMessageDatas))
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success('修改公告操作成功');
                this.editMessageModel = false;
                this.getListData();
              } else {
                this.$Message.error(res.data.Description);
              }
            })
        }
      })
    }
  },
  created() {
    this.getListData();
  },
  watch: {
    'addNewMessageModel': function(val, oldVal) {
      if (!val && oldVal) {
        this.$refs.addNewMessageForm.resetFields();
        this.addNewMessageDatas = {
          abstracts: '',
          contents: '',
          title: '',
          isSystem: 0
        }
      }
    }
  },

}

</script>
<style lang="less">


</style>
