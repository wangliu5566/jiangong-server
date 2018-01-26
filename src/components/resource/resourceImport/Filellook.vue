<template>
  <div class="file-import">
<!--     <Row class="resource-header">
      <Col span='8'>
        入库报告
        <Button type="primary" @click="tableType = true">成功入库报告</Button>
        <Button type="error" @click="tableType = false">异常入库报告</Button>
      </Col>

      <Col span="8" >
        <span> &nbsp;</span>
      </Col>

      <Col span="8" >
         <Button type="primary" style="float:right" icon="plus-round" @click="showModal=true">资源导入</Button>
      </Col>
    </Row> -->
    <div class='aggregation'>
        <p>已入库资源：{{allnum}}</p>
        <p>{{aggrega}}</p>
    </div>
    <div class="resource-table">
        <!-- <h3>{{tableType ? '成功入库报告':'异常入库报告'}}  -->
        <h3>
            入库报告
<!--            <Button type="primary" style="float:right" icon="plus-round" @click="showModal=true">资源导入</Button>-->
       <Button type="primary" style='float:right;margin-right:20px' @click="brack">返回</Button>
        </h3>
        <Table :loading='loadingData' border :columns="columnsSuccess" :data="knowledgeList"></Table>
<!--        <Table v-else  border :columns="columnsFail" :data="dataList"></Table>-->
    </div>
<Row>
    <div class="resource-page">
       <Page 
          :total="parseInt(totalCount)"
           :current='parseInt(page)'
            :page-size="pageSize" 
            size="small" 
            show-total 
            show-sizer
             show-elevator
             :page-size-opts='[10,20,30]' 
             @on-change="change"
              @on-page-size-change="eachPageChange"></Page>
    </div>
    </Row>
    <Modal v-model="showModal" :mask-closable="false" id="modalLead" @on-cancel="showModalclose" >
        <p slot="header" class="resource-modal-header">资源导入</p>
        <Form ref="addNewAcademyForm" :model="importResource" :label-width="120" :rules="addNewAcademyRules">
          <FormItem label="选择产品" prop='product'>
            <Select v-model="model1" style="width:200px">
        <Option v-for="item in system" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
          </FormItem>
          <FormItem label="选择资源类型" prop='resourceType'>
             <Select v-model="model2" style="width:200px">
        <Option v-for="item in kindList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
          </FormItem>  

          <FormItem label="选择文件" prop='selectFile'>
            <Upload 
            ref='upload'
            :data="ApiTransfer('/File/Upload',uploadMessage)"
            :on-success="uploadSuccess"
             :action="ApiTransfer('/File/Upload')"
             style="margin-top:0"  
             :format='uploadCalss'
             :on-format-error="handleFormatError"
              >
              <Button  type="ghost" icon="ios-cloud-upload-outline">选择要导入的文件 ( 只能为zip格式文件 ) </Button>
            </Upload>
          </FormItem>  
        </Form>
        <div slot="footer" style="text-align: center;">
          <Button type="primary" @click="uploadsure">确定</Button>
          <Button type="ghost" @click="showModalclose">取消</Button>
       </div>
    </Modal>

  </div>
</template>
<script>
    import validator from '../../common/validate.js';
    export default {
        data() {
            return {
                loadingData: false, //loading开关
                baseUrl: baseUrl,
                load: true,
                uploadMessage: {
                    userid: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id,
                    customType: 'content'
                },
                aggrega: '',
                allnum: 0,
                model1: 3, //选择的产品
                model2: 104, //选择的资源类型
                system: [], //产品列表
                uploadCalss: ['zip', 'ZIP'], //上传类型
                keyWord: "",
                totalCount: 0,
                page: "1",
                pageSize: 20,
                select: '',
                knowledgeList: [],
                tableType: true, //true - 成功入库  false - 异常入库
                importResource: {
                    product: 'beijing',
                    resourceType: 'shanghai',
                },
                kindList: [
                    //                    {
                    //                        value: 101,
                    //                        label: '知识元'
                    //                    },
                    {
                        value: 112,
                        label: '期刊'
                    }, {
                        value: 102,
                        label: '章节'
                    },
                    {
                        value: 104,
                        label: '图书'
                    },
                    {
                        value: 105,
                        label: 'OA论文'
                    },
                    {
                        value: 106,
                        label: '电子电路包'
                    },
                    {
                        value: 107,
                        label: '课程'
                    },
                    {
                        value: 108,
                        label: '图片'
                    },
                    {
                        value: 109,
                        label: '视频'
                    },
                    {
                        value: 110,
                        label: '音频'
                    },
                    {
                        value: 111,
                        label: '动画'
                    },
                    {
                        value: 103,
                        label: '电子标准'
                    }
                ],
                columnsSuccess: [{
                    title: '入库时间',
                    key: 'CreateTime',
                }, {
                    title: '资源总量',
                    key: 'TotalAmount',
                }, {
                    title: '成功入库资源总量',
                    key: 'SuccessAmount',
                }, {
                    title: '异常入库资源总量',
                    key: 'FailAmount',
                }, {
                    title: '入库清单下载',
                    key: 'ExcelFilePath',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        //                                       window.location.href=params.row.ExcelFilePath
                                        //                                        window.open(`${params.row.ExcelFilePath}`)
                                        var el = document.createElement("a");
                                        document.body.appendChild(el);
                                        el.href = params.row.ExcelFilePath; //url 是你得到的连接
                                        el.target = '_new'; //指定在新窗口打开
                                        el.download = 'true'
                                        el.click();
                                        document.body.removeChild(el);
                                    }
                                }
                            }, '清单下载'),
                        ]);
                    }
                }],
                //验证规则
                addNewAcademyRules: {
                    email: [{
                        validator: validator.CheckEmail,
                        trigger: 'blur'
                    }],

                    mobileNumber: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'blur'
                    }, {
                        validator: validator.CheckPhone,
                        trigger: 'blur'
                    }],

                    password: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        max: 18,
                        message: '密码长度在6-18位',
                        trigger: 'blur'
                    }],

                    age: [{
                        validator: validator.CheckCode,
                        trigger: 'blur'
                    }],
                },
                dataList: [{
                    Id: 1,
                    Title: '测试',
                    Num: 100,
                    time: new Date().toLocaleString()
                }],
                showModal: false,
                file: null,
                loadingStatus: false
            }
        },
        mounted() {
            this.getlist()
            this.getSystemlist()
            this.aggregation()
        },
        methods: {
            //返回上一页
            brack() {
                this.$router.push({
                    path: "/wrap/resource/resourceImport/fileImport",
                })
            },
            handleFormatError(file) {
                this.$Message.warning('请上传zip格式文件');
            },

            //分页切换当前页
            change(page) {
                this.page = page;
                this.getlist()
            },
            //分页数量
            eachPageChange(pageSize) {
                this.page = 1;
                this.pageSize = pageSize;
                this.getlist()
            },
            getlist() {
                this.loadingData = true
                this.$http.get(this.ApiTransfer("/ImportReport/List"), {
                        params: this.ApiTransfer("/ImportReport/List", {
                            type: 1,
                            cp: this.page,
                            ps: this.pageSize,
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            this.knowledgeList = res.data.Data.ItemList
                            this.totalCount = parseInt(res.data.Data.RecordCount);
                            this.loadingData = false
                        }
                    })
            },
            //数量汇总
            aggregation(keyWord, page, pageSize) {
                this.$http.get(this.ApiTransfer("/Content/GetCountByObjectType"), {
                        params: this.ApiTransfer("/Content/GetCountByObjectType", {

                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            res.data.Data.map((item) => {
                                if(item.Key!='试题'&&item.Key!='试卷'){
                                this.aggrega += `${item.Key?item.Key:'其他'}:${item.Value},`
                                this.allnum += parseInt(item.Value)
                                }
                            })
                             this.aggrega = this.aggrega.substring(0, this.aggrega.length-1);
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
                    for (let i = 0; i < res.data.Data.ItemList.length; i++) {
                        this.system.push({
                            value: res.data.Data.ItemList[i].Id,
                            label: res.data.Data.ItemList[i].Title
                        })
                    }
                })
            },
            uploadSuccess(response, file, fileList) {
                if (fileList.length > 1) {
                    fileList.shift()
                }
                this.uploadId = response.Data.Id
            },
            handleUpload(file) {
                if (this.load) {
                    this.file = file;
                    return false;
                } else {
                    return true;
                }
            },
            //确定上传成功
            uploadsure() {
                if (!!this.uploadId) {
                    this.$http.post(this.ApiTransfer('/Content/ImportContentData'),
                        this.ApiTransfer('/Content/ImportContentData', {
                            objectType: this.model2,
                            productId: this.model1,
                            id: this.uploadId
                        })).then((res) => {
                        this.getlist(this.keyWord, this.page, this.pageSize)
                        this.showModalclose()
                        this.$Message.success('导入成功');
                        this.uploadId = ''
                    })
                } else {
                    this.$Message.error('请选择上传文件')
                }
            },
            //关闭上传框
            showModalclose() {
                this.$refs.upload.clearFiles()
                this.showModal = false
                this.uploadId = ''
            },
            goDetail(type) {
                this.$router.push({
                    path: "/wrap/knowledgeList",
                    query: {
                        knowledgeType: type
                    }
                })
            },
            //导出
            leadingOut(id) {

            }
        }
    }

</script>
<style lang="less">
    .aggregation {
        margin-top: 20px;
        font-size: 16px
    }

    #modal .ivu-upload {
        padding-left: 0;
    }

</style>
