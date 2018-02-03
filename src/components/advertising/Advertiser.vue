<template>
  <div class="advertiser">
    <div class="system-title">
      <Icon type="chatboxes" size="27"></Icon><span>广告商管理</span>
    </div>
    <div class="btn-line">
      <Button type="primary" icon="plus-round" @click="openAddModal">创建广告商</Button>
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入广告商名称" style="width: 300px;float: right" @on-click="getkeyWordList()" @on-enter="getkeyWordList()"></Input>
    </div>
    <div class="tables" style="margin-top: 0">
      <Table border :loading="loading" :columns="columnsList" :data="dataList" ref="selection" @on-selection-change="selectItem"></Table>
      <Button class="btns" disabled v-if="selectIds==''">批量删除</Button>
      <Button class="btns" @click="BatchPutOn()" v-if="selectIds!=''">批量删除</Button>
    </div>
    <div class="page" style="margin-top: -30px;">
      <Page :total="parseInt(totalCount)" :current="parseInt(page)" size="small" show-elevator :page-size="pageSize" show-total show-sizer @on-page-size-change='changeSize' @on-change="change"></Page>
    </div>
    <!-- 新增广告商 -->
    <Modal v-model="addModal" :mask-closable="false" id="noFooter">
      <p slot="header" style="text-align:center;color:#333;">创建广告商</p>
      <Form :model="formItem" :label-width="100" ref="formValidate" :rules="ruleValidate">
        <FormItem label="广告商名称:" prop="Title">
          <Input v-model="formItem.Title" placeholder="请输入广告商名称"></Input>
        </FormItem>
        <FormItem label="联系人:" prop="ContactPerson">
          <Input v-model="formItem.ContactPerson" placeholder="请输入联系人"></Input>
        </FormItem>
        <FormItem label="联系方式:" prop="MobileNumber">
          <Input v-model="formItem.MobileNumber" placeholder="请输入电话号码"></Input>
        </FormItem>
      </Form>
      <div style="text-align: center;">
        <Button type="primary" @click="addAdvertiser('formValidate')">确定</Button>
        <Button @click="addModal=false">取消</Button>
      </div>
    </Modal>
    <!-- 修改广告商 -->
    <Modal v-model="updateModal" :mask-closable="false" id="noFooter">
      <p slot="header" style="text-align:center;color:#333;">修改广告商信息</p>
      <Form :model="updateItem" :label-width="100" ref="formValidate1" :rules="ruleValidate">
        <FormItem label="广告商名称:" prop="Title">
          <Input v-model="updateItem.Title" placeholder="请输入广告商名称"></Input>
        </FormItem>
        <FormItem label="联系人:" prop="ContactPerson">
          <Input v-model="updateItem.ContactPerson" placeholder="请输入联系人"></Input>
        </FormItem>
        <FormItem label="联系方式:" prop="MobileNumber">
          <Input v-model="updateItem.MobileNumber" placeholder="请输入电话号码"></Input>
        </FormItem>
      </Form>
      <div style="text-align: center;">
        <Button type="primary" @click="updateAd('formValidate1')">确定</Button>
        <Button @click="updateModal=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    const validatePhones = (rule, value, callback) => {
      var myreg = /^1[34578][0-9]{9}/;
      if (!value) {
        return callback(new Error('电话不能为空'));
      } else if (!myreg.test(value)) {
        return callback(new Error('请输入有效电话'));
      } else {
        callback()
      }
    };
    const validateAdvertiser = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('请填写广告商名称'));
      } else if (value.trim().length > 20) {
        return callback(new Error('广告商名称长度不能超过20'));
      } else {
        callback()
      }
    };
    const validatePerson = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('请填写联系人名称'));
      } else if (value.trim().length > 10) {
        return callback(new Error('联系人名称长度不能超过10'));
      } else {
        callback()
      }
    };
    return {
      loading: false,
      keyWord: "",
      oldkeyWord: '',
      totalCount: 0,
      page: "1",
      pageSize: 10,
      selectIds: "",
      columnsList: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '编号',
        key: 'Id',
        width: 110,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Id)
          ])
        }
      }, {
        title: '广告商名称',
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
        title: '联系人',
        key: 'ContactPerson',
        width: 150,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.ContactPerson ? params.row.ContactPerson : "-")
          ])
        }
      }, {
        title: '联系方式',
        key: 'MobileNumber',
        width: 140,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.MobileNumber ? params.row.MobileNumber : "-")
          ])
        }
      }, {
        title: '创建时间',
        key: 'CreateTime',
        width: 180,
        render: (h, params) => {
          return h("span", {}, params.row.CreateTime ? params.row.CreateTime : "-")
        }
      }, {
        title: '操作',
        key: 'action',
        width: 130,
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
                  this.updateModal = true;
                  this.updateItem = Object.assign({}, this.dataList[params.index])
                }
              }
            }, '修改'),
            h('Button', {
              props: {
                type: 'text',
                size: 'small',
                type: "error"
              },
              on: {
                click: () => {
                  this.selectIds = params.row.Id
                  this.BatchPutOn()
                }
              }
            }, '删除')
          ]);
        }
      }],
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
      ruleValidate: {
        Title: [
          { required: true, validator: validateAdvertiser, trigger: 'blur' },
        ],
        ContactPerson: [
          { required: true, validator: validatePerson, trigger: 'blur' },
        ],
        MobileNumber: [{
          required: true,
          validator: validatePhones,
          trigger: 'blur'
        }, ],
        type: 2
      }
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    /**
     * [getkeyWordList 搜索关键字]
     * @Author   王柳
     * @DateTime 2017-12-13
     * @return   {[type]}   [description]
     */
    getkeyWordList() {
      if (this.oldkeyWord == this.keyWord.trim() && this.keyWord.trim() == '') {
        this.$Message.warning('请输入广告商名称')
        return false;
      }
      this.loading = true;
      this.page=1
      this.$http.get(this.ApiTransfer("/Advertiser/List"), {
          params: this.ApiTransfer("/Advertiser/List", {
            keyword: this.keyWord.trim(),
            type: 0, //所属行业类型0全部1教育2医疗3金融4互联网
            ps: this.pageSize,
            cp: this.page
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
     * [getlist 得到广告商列表]
     * @Author   王柳
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    getlist() {
      this.loading = true;
      this.$http.get(this.ApiTransfer("/Advertiser/List"), {
          params: this.ApiTransfer("/Advertiser/List", {
            keyword: this.oldkeyWord,
            type: 0, //所属行业类型0全部1教育2医疗3金融4互联网
            ps: this.pageSize,
            cp: this.page
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
     * @Author   王柳
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
     * @Author   王柳
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
     * @Author   王柳
     * @DateTime 2017-11-19
     * @param    {[type]}   status [description]
     * @return   {[type]}          [description]
     */
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    /**
     * [selectItem 全选功能得到ids]
     * @Author   王柳
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
     * @Author   王柳
     * @DateTime 2017-11-19
     */
    BatchPutOn() {
      if (this.selectIds == "") {
        this.$Message.warning('请选择要删除的内容')
      } else {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要删除该广告商吗，一旦删除，无法恢复哟！</p>',
          onOk: () => {
            this.$http.post(this.ApiTransfer("/Advertiser/Delete"), this.ApiTransfer("/Advertiser/Delete", {
                ids: this.selectIds,
                // isEnable:isEnable
              }))
              .then((res) => {
                if (res.data.Success) {
                  this.$Message.success('成功')
                  this.selectIds = ""
                  this.getlist()
                }else{
                  this.$Message.error('已经绑定广告的广告商不能删除')
                }
              })
          },
        });
      }
    },
    /**
     * [openAddModal 打开新增广告商模态框，清空数据]
     * @Author   王柳
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    openAddModal() {
      this.addModal = true;
      this.formItem.Title = '';
      this.formItem.ContactPerson = '';
      this.formItem.MobileNumber = '';
    },
    /**
     * [addAdvertiser 新增广告商]
     * @Author   王柳
     * @DateTime 2017-11-19
     */
    addAdvertiser(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer("/Advertiser/Create"), this.ApiTransfer("/Advertiser/Create", {
              businessType: 1,
              description: '',
              mobileNumber: this.formItem.MobileNumber,
              title: this.formItem.Title.trim(),
              contactPerson: this.formItem.ContactPerson.trim()
            }))
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success("新增成功")
                this.$refs.formValidate.resetFields();
                this.getlist()
                this.addModal = false
              }
            })
        }
      })
    },
    /**
     * [updateAd 修改广告商信息]
     * @Author   王柳
     * @DateTime 2017-11-19
     * @param    {[type]}   id [description]
     * @return   {[type]}      [description]
     */
    updateAd(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer("/Advertiser/Update"), this.ApiTransfer("/Advertiser/Update", {
              id: this.updateItem.Id,
              businessType: 1,
              description: '1',
              mobileNumber: this.updateItem.MobileNumber,
              title: this.updateItem.Title.trim(),
              contactPerson: this.updateItem.ContactPerson.trim()
            }))
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success("修改成功")
                this.getlist()
                this.updateModal = false
              }
            })
        }
      })
    },
  },
  watch: {
    'updateModal': function(val, oldVal) {
      if (!val && oldVal) {
        this.$refs.formValidate1.resetFields();
      }
    },
  }
}

</script>
<style lang="less">
.advertiser {}

</style>
