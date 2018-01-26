<template>
  <div class="update-container">
    <div class="system-title">
      <Icon type="android-upload" size="24"></Icon>
      <span>客户端管理</span>
    </div>
    <Row>
      <Col span='10'>
      <Button type="primary" @click="addNewUpdate">
        <Icon type="plus-round"></Icon> 新增版本</Button>
      </Button>
      <span>&nbsp;</span>
      </Col>
      <Col span="6">
      <Select class="pull-right" v-model="filter.type" style="width:140px;margin-right: 10px;" @on-change="getListData">
        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <span class="pull-right" style="display:inline-block;padding-top: 5px;">平台类型：</span>
      </Col>
      <Col span="8">
      <Input v-model="filter.searchKey" icon="ios-search-strong" placeholder="请输入版本号" @on-click="searchInfo" @on-enter="searchInfo"></Input>
      </Col>
    </Row>
    <Row class="pt10 pb10">
      <Table border :loading="loadingData" :columns="accountColumns" :data="accountDatas" @on-select="tableSelectCurrent" @on-select-all='tableSelectAll' @on-select-cancel="tableCancelCurrent" @on-selection-change="tableChange" highlight-row no-data-text="暂无数据">
      </Table>
    </Row>
    <Row class="tr pt5 pb10">
      <Page :total="tp"  :current='cp' :page-size="ep" size="small" show-total show-sizer show-elevator :page-size-opts='[10,20,30]' @on-change="currentPageChange" @on-page-size-change="eachPageChange"></Page>
    </Row>
    <!-- 新增更新modal -->
    <Modal :closable="false" v-model="addNewUpdateModel" :mask-closable="false" width="600">
      <p slot="header" style="text-align:center;color:#333;">新增客户端版本</p>
      <div class="edit-model-body">
        <Form ref="addNewUpdateForm" :model="addNewUpdateDatas" :label-width="130" :rules="addNewUpdateRules">
          <FormItem label="平台类型" required>
            <RadioGroup :value="addNewUpdateDatas.type" @on-change="typeChange">
              <Radio label="1" :disabled="isUploading">Android</Radio>
              <!-- <Radio label="2" :disabled="isUploading">PC</Radio> -->
              <!-- <Radio label="3" :disabled="isUploading">IOS</Radio> -->
            </RadioGroup>
          </FormItem>
          <FormItem label="版本号" prop="versionUpgrade" required>
            <Input v-model="addNewUpdateDatas.versionUpgrade" placeholder="请上传文件后解析获取" readonly disabled></Input>
          </FormItem>
          <!-- <FormItem label="版本数字号" prop="versionNumberUpgrade" required>
            <Input v-model="addNewUpdateDatas.versionNumberUpgrade" placeholder="输入版本数字号" readonly disabled></Input>
          </FormItem> -->
          <FormItem label="是否强制升级" required>
            <RadioGroup v-model="addNewUpdateDatas.isEnforced">
              <Radio label="1">是</Radio>
              <Radio label="2">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="上传文件" required>
            <FileUpload v-if="addNewUpdateModel" ref="fileUpload" :before-upload="beforeFileUpload" :action="baseUrl+'/File/Upload'" :data="fileUploadData" :format="['apk','msi','ipa']" :on-success="fileUploadSuccess" :on-progress="fileUploadProgress" :on-error="fileUploadError" :show-upload-list='showFileList'>
              <Button type="primary" icon="ios-cloud-upload-outline">选择 {{addNewUpdateDatas.type==1?'.apk':addNewUpdateDatas.type==2?'.msi':'.ipa'}} 格式的文件</Button>
            </FileUpload>
          </FormItem>
          <FormItem label="文件地址" required prop="url">
            <Input v-model="addNewUpdateDatas.url" placeholder="请先上传文件" readonly disabled></Input>
          </FormItem>
          <FormItem label="版本描述" prop="description">
            <Input v-model="addNewUpdateDatas.description" type="textarea" :rows="4" placeholder="输入版本描述"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center;">
        
        <Button type="primary" :disabled="addNewUpdateDatas.url?false:true" @click="submitAddNewUpdate('addNewUpdateForm')">确认新增</Button>
        <Button type="ghost" @click="closeAddNewUploadModel">返回</Button>
      </div>
    </Modal>
    <!-- 修改更新modal -->
    <Modal v-model="editUpdateModel" :mask-closable="false" width="600" title="修改客户端版本">
       <p slot="header" style="text-align:center;color:#333;">修改客户端版本</p>
      <div class="edit-model-body">
        <Form ref="editUpdateForm" :model="editUpdateDatas" :label-width="130" :rules="addNewUpdateRules">
          <FormItem label="平台类型" required>
            <RadioGroup v-model="editUpdateDatas.type">
              <Radio label="1" disabled>Android</Radio>
              <!-- <Radio label="2" disabled>PC</Radio> -->
              <!-- <Radio label="3" disabled>IOS</Radio> -->
            </RadioGroup>
          </FormItem>
          <FormItem label="版本号" prop="versionUpgrade" required>
            <Input v-model="editUpdateDatas.versionUpgrade" placeholder="输入版本号" disabled readonly></Input>
          </FormItem>
          <!-- <FormItem label="版本数字号" prop="versionNumberUpgrade" required>
            <Input v-model="editUpdateDatas.versionNumberUpgrade" placeholder="输入版本数字号"></Input>
          </FormItem> -->
          <FormItem label="是否强制升级" required>
            <RadioGroup v-model="editUpdateDatas.isEnforced">
              <Radio label="1">是</Radio>
              <Radio label="2">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="上传文件" required>
            <Button disabled type="primary" icon="ios-cloud-upload-outline">选择 {{editUpdateDatas.type==1?'.apk':editUpdateDatas.type==2?'.msi':'.ipa'}} 格式的文件</Button>
          </FormItem>
          <FormItem label="文件地址" required prop="url">
            <Input v-model="editUpdateDatas.url" placeholder="请先上传文件" readonly disabled></Input>
          </FormItem>
          <FormItem label="版本描述" prop="description">
            <Input v-model="editUpdateDatas.description" type="textarea" :rows="4" placeholder="输入版本描述"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style='text-align:center;'>
        
        <Button type="primary" @click="submiteditUpdate('editUpdateForm')">确认修改</Button>
        <Button type="ghost" @click="editUpdateModel=false">返回</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import FileUpload from 'iview/src/components/upload'
//此处由于iview没有终止上传的方法
//修改过源码
//在组建upload的ajax.js
// if (xhr.upload) {
//     xhr.upload.onprogress = function progress(e) {
//       if (e.total > 0) {
//         e.percent = e.loaded / e.total * 100;
//       }
//       option.onProgress(e);
//     };

//     xhr.upload.onabort = function() {
//       xhr.abort();
//     };
//   }
import validator from '@/validate.js'
export default {
  components: {
    FileUpload,
  },
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
        type: '0'
      },

      oldKey:'',

      //model状态
      addNewUpdateModel: false,
      editUpdateModel: false,

      typeList: [{
          label: '全部',
          value: '0'
        }, {
          label: 'Android',
          value: '1'
        }, {
          label: 'PC',
          value: '2'
        }
        // , {
        //   label: 'IOS',
        //   value: '3'
        // }
      ],

      //上传相关配置
      extensions: 'apk,msi,ipa',

      //分页
      tp: 0,
      cp: filters != null && filters != '' && JSON.parse(filters) != {} && JSON.parse(filters).cp ? parseInt(JSON.parse(filters).cp) : 1,
      ep: filters != null && filters != '' && JSON.parse(filters) != {} && JSON.parse(filters).ep ? parseInt(JSON.parse(filters).ep) : 10,

      loadingData: false,

      //新增更新数据
      addNewUpdateDatas: {
        platformName: 'Android',
        versionUpgrade: '',
        description: '',
        url: '',
        mD5: '',
        versionNumberUpgrade: '',
        isEnforced: '2',
        type: '1'
      },

      //修改更新数据
      editUpdateDatas: {
        id: '',
        platformName: '',
        versionUpgrade: '',
        description: '',
        url: '',
        mD5: '',
        versionNumberUpgrade: '',
        isEnforced: '',
        type: ''
      },

      //表单验证规则
      addNewUpdateRules: {
        versionUpgrade: [{
          validator: validator.CheckVersion,
          trigger: 'blur'
        }],
        versionNumberUpgrade: [{
          validator: validator.CheckNumber,
          trigger: 'blur'
        }],
        url: [{
          required: true,
          message: '请上传客户端文件',
          trigger: 'blur',
        }],
        description:[{
          required:true,
          message:'请输入版本描述',
          trigger:'blur'
        }]

      },


      //表格配置
      accountColumns: [
        // {
        //   title: 'ID',
        //   key: 'Id',
        //   width: 120
        // }, 
        {
          title: '平台类型',
          ellipsis: true,
          key: 'PlatformName'
        }, {
          title: '版本号',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.Version ? params.row.Version : ''
              }
            }, params.row.Version ? params.row.Version : '-');
          }
        }, {
          title: '版本数字号',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.VersionNumber ? params.row.VersionNumber : ''
              }
            }, params.row.VersionNumber ? params.row.VersionNumber : '-');
          }
        }, {
          title: '是否强制升级',
          render: (h, params) => {
            return h('span', params.row.IsEnforced == 1 ? '是' : '否');
          }
        }, {
          title: '版本描述',
          ellipsis: true,
          key: 'Description',
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.Description ? params.row.Description : ''
              }
            }, params.row.Description ? params.row.Description : '-');
          }
        }, {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size:'small'
                },
                on: {
                  click: () => {
                    this.editUpdate(params.row, params.index);
                  }
                }
              }, '修改'),
              h('Dropdown', {
                props: {
                  trigger: "hover",
                  placement: 'bottom-end'
                },
                on: {
                  'on-click': (name) => {
                    if (name == 'deleteUpdate') {
                      this.deleteUpdate(params.row, params.index);
                    } else if (name == 'publishUpdate') {
                      // this.publishUpdate(params.row, params.index);
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
                      name: "deleteUpdate",
                    }
                  }, '删除'),
                  // h('DropdownItem', {
                  //   props: {
                  //     name: "publishUpdate",
                  //   }
                  // }, '发布')
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

      //判定文件是否在上传
      isUploading: false,

      //文件上传时携带数据
      fileUploadData: {
        file: '',
        userId: userInfo.Id,
        objectId: 0,
        description: '',
        customType: 'content',
        ApiName: '/File/Upload',
        BridgePlatformName: transferUrl,
      },

      //文件上传时的事件对象
      fileUploadEvent: '',

      //是否显示上传列表
      showFileList: false


    }
  },
  methods: {
    /**
     * [getListData 获取表格数据]
     * @Author   李志明
     * @DateTime 2017-10-31
     * @return   {[type]}   [description]
     */
    getListData(isSearch=false) {
      this.loadingData = true;
      this.$http.get(this.ApiTransfer("/Upgrade/List"), {
        params: this.ApiTransfer('/Upgrade/List', {
          keyWord: isSearch ? this.filter.searchKey.trim() : this.oldKey,
          ps: this.ep,
          cp: this.cp,
          type: this.filter.type,
          ApiName: '/Upgrade/List'
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
     * [addNewUpdate 新增更新]
     * @Author   李志明
     * @DateTime 2017-10-31
     */
    addNewUpdate() {
      this.addNewUpdateModel = true;
    },

    /**
     * [searchInfo 搜索更新关键字]
     * @Author   李志明
     * @DateTime 2017-10-31
     * @return   {[type]}   [description]
     */
    searchInfo() {
      if (this.oldKey == this.filter.searchKey.trim() && this.filter.searchKey.trim() == '') {
        this.$Message.warning('请输入版本号')
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
     * [typeChange 平台类型改变]
     * @Author   李志明
     * @DateTime 2017-11-02
     * @return   {[type]}   [description]
     */
    typeChange(value) {
      if (this.addNewUpdateDatas.url != '') {
        this.$Modal.confirm({
          title: '操作提示',
          content: '您已上传当前平台对应的文件，确认修改平台类型？',
          onOk: () => {
            this.addNewUpdateDatas.url = '';
            this.addNewUpdateDatas.versionUpgrade = '';
            this.addNewUpdateDatas.versionNumberUpgrade = '';
            this.addNewUpdateDatas.type = value;
          },
        });
      } else {
        this.addNewUpdateDatas.type = value;
      }
    },


    /**
     * [closeAddNewUploadModel 关闭上传模态框]
     * @Author   李志明
     * @DateTime 2017-11-01
     * @return   {[type]}   [description]
     */
    closeAddNewUploadModel() {
      if (this.isUploading) {
        this.$Modal.confirm({
          title: '操作提示',
          content: '现在有正在上传的文件，确认要关闭该窗口?',
          onOk: () => {
            this.addNewUpdateModel = false;
          },
        });
      } else {
        this.addNewUpdateModel = false;
      }
    },

    // startUpload() {
    //   this.$refs.fileUpload.active = true;
    // },

    /**
     * [beforeFileUpload 文件上传前]
     * @Author   李志明
     * @DateTime 2017-10-31
     * @return   {[type]}   [description]
     */
    beforeFileUpload(file) {
      if (this.isUploading) {
        if (this.addNewUpdateModel) {
          this.$Message.error({
            content: '文件正在上传中，请等待上传完成后再试！',
            duration: 4
          });
        }
        return false;
      } else {
        let fileArr = file.name.split('.');
        let fileType = fileArr[fileArr.length - 1];

        let allowType = '';
        switch (parseInt(this.addNewUpdateDatas.type)) {
          case 1:
            allowType = "apk";
            break;
          case 2:
            allowType = "msi";
            break;
          case 3:
            allowType = "ipa";
            break;
          default:
            allowType = "apk"
            break;
        }

        if (fileType != allowType) {
          this.$Message.warning({
            content: '请选择.' + allowType + '格式的文件',
            duration: 4
          });
          return false;
        } else {
          this.fileUploadData.file = file.name;
          this.fileUploadData.description = file.name;
          this.showFileList = true;
        }
      }

    },

    /**
     * [fileUploadProgress 文件上传过程中]
     * @Author   李志明
     * @DateTime 2017-11-01
     * @param    {[type]}   event    [description]
     * @param    {[type]}   file     [description]
     * @param    {[type]}   fileList [description]
     * @return   {[type]}            [description]
     */
    fileUploadProgress(event, file, fileList) {
      this.fileUploadEvent = event;
      this.isUploading = true;
      this.addNewUpdateDatas.url = '';
      this.addNewUpdateDatas.versionUpgrade = '';
      this.addNewUpdateDatas.versionNumberUpgrade = '';
    },

    /**
     * [fileUploadSuccess 文件上传成功]
     * @Author   李志明
     * @DateTime 2017-11-01
     * @param    {[type]}   response [description]
     * @param    {[type]}   file     [description]
     * @param    {[type]}   fileList [description]
     * @return   {[type]}            [description]
     */
    fileUploadSuccess(response, file, fileList) {
      this.addNewUpdateDatas.url = response.Data.Url;
      this.isUploading = false;
      this.showFileList = false;
      this.$refs.fileUpload.clearFiles();

      this.$http.get(this.ApiTransfer('/Upgrade/GetAppInfo'), {
          params: this.ApiTransfer('/Upgrade/GetAppInfo', {
            fileId: response.Data.Id,
            ApiName: '/Upgrade/GetAppInfo'
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.addNewUpdateDatas.versionUpgrade = res.data.Data.Version;
            this.addNewUpdateDatas.versionNumberUpgrade = res.data.Data.VersionCode;
          }

        })

    },

    /**
     * [fileUploadError 文件上传失败]
     * @Author   李志明
     * @DateTime 2017-11-01
     * @return   {[type]}   [description]
     */
    fileUploadError(error, file, fileList) {
      this.isUploading = false;
    },

    /**
     * [submitAddNewUpdate 提交新增的更新]
     * @Author   李志明
     * @DateTime 2017-11-02
     * @param    {[String]}   formName [表单名称]
     * @return   {[type]}            [description]
     */
    submitAddNewUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer('/Upgrade/Create'), this.ApiTransfer('/Upgrade/Create', Object.assign({}, this.addNewUpdateDatas, {
              ApiName: ''
            })))
            .then((res) => {
              if (res.data.Success) {
                this.addNewUpdateModel = false;
                this.$Message.success({
                  content: '操作成功！',
                  duration: 3
                })
                this.getListData();
              } else {
                this.$Message.error({
                  content: res.data.Description,
                  duration: 3
                })
              }
            })
        }
      })
    },

    /**
     * [deleteUpdate 删除更新]
     * @Author   李志明
     * @DateTime 2017-11-01
     * @param    {[Object]}   row   [当前行数据]
     * @param    {[String]}   index [当前行角标]
     * @return   {[type]}         [description]
     */
    deleteUpdate(row, index) {
      this.$Modal.confirm({
        title: '操作提示',
        content: '确认删除该更新？',
        onOk: () => {
          this.$http.post(this.ApiTransfer('/Upgrade/Delete'), this.ApiTransfer('/Upgrade/Delete', {
            ids: row.Id,
          })).then((res) => {
            if (res.data.Success) {
              this.$Message.success('删除操作成功');
              this.getListData();
            } else {
              this.$Message.error(res.data.Description)
            }
          })
        },
      });
    },

    /**
     * [publishUpdate 推送更新]
     * @Author   李志明
     * @DateTime 2017-11-01
     * @param    {[Object]}   row   [当前行数据]
     * @param    {[String]}   index [当前行角标]
     * @return   {[type]}         [description]
     */
    publishUpdate(row, index) {

    },

    /**
     * [editUpdate description]
     * @Author   李志明
     * @DateTime 2017-11-01
     * @param    {[type]}   row   [description]
     * @param    {[type]}   index [description]
     * @return   {[type]}         [description]
     */
    editUpdate(row, index) {
      this.editUpdateDatas = Object.assign({}, this.editUpdateDatas, {
        id: row.Id,
        platformName: row.PlatformName,
        versionUpgrade: row.Version,
        description: row.Description,
        url: row.Url,
        mD5: row['MD5'],
        versionNumberUpgrade: row.VersionNumber,
        isEnforced: row.IsEnforced,
        type: row.PlatformType
      })

      this.editUpdateModel = true;
    },

    /**
     * [submiteditUpdate 提交修改后的更新]
     * @Author   李志明
     * @DateTime 2017-11-02
     * @param    {[String]}   formName [表单名称]
     * @return   {[type]}            [description]
     */
    submiteditUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer('/Upgrade/Update'), this.ApiTransfer('/Upgrade/Update', this.editUpdateDatas))
            .then((res) => {
              if (res.data.Success) {
                this.editUpdateModel = false;
                this.$Message.success({
                  content: '操作成功！',
                  duration: 3
                })
                this.getListData();
              } else {
                this.$Message.error({
                  content: res.data.Description,
                  duration: 3
                })
              }
            })
        }
      })
    },

  },
  watch: {
    addNewUpdateModel: function(val, oldVal) {
      if (!val && oldVal) {
        if (this.fileUploadEvent != '') {
          if (this.fileUploadEvent.target.onabort) {
            this.fileUploadEvent.target.onabort();
          }

        }
        this.$refs.addNewUpdateForm.resetFields();
        this.isUploading = false;
        this.addNewUpdateDatas = {
          platformName: 'Android',
          versionUpgrade: '',
          description: '',
          url: '',
          mD5: '',
          versionNumberUpgrade: '',
          isEnforced: '2',
          type: '1'
        }
      }
    },
    editUpdateModel: function(val, oldVal) {
      if (!val && oldVal) {
        this.$refs.editUpdateForm.resetFields();
      }
    },
    'addNewUpdateDatas.type': function(val, oldVal) {
      switch (parseInt(val)) {
        case 1:
          this.addNewUpdateDatas.platformName = 'Android';
          break;
        case 2:
          this.addNewUpdateDatas.platformName = 'PC';
          break;
        case 3:
          this.addNewUpdateDatas.platformName = 'IOS';
          break;
        default:
          break;
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    window.sessionStorage.setItem('bg_user_filter', '')
    next();
  },
  created() {
    this.getListData();
  },
}

</script>
<style lang="less">
.update-container {
  .vue-file-upload {
    input {
      display: none;
    }
  }
}

.vue-file-upload {
  input {
    display: none;
  }
}

</style>
