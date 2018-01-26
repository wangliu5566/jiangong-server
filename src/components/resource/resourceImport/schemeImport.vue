<template>
    <div class="scheme">
    <div class="system-title resource-system-title ">
      <span style="color: #2cabe3;font-weight: 700;">资源导入</span>
       <Button type="primary" style='float:right;margin-right:20px' @click="brack">返回</Button>
    </div>
     <Row class="resource-header">
         <Col span="18" >
               类型：
                <Select v-model="exerType" style="width:200px;" @on-change='selectClass'>
                 <Option v-for="item in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
             </Select>
<!--             <Button type="primary" icon="plus-round" @click="gopath('/wrap/resource/resourceImport/schemeImport')">导入内容</Button>-->
<!--             <Button type="primary" @click="">更新</Button>-->
          </Col>
         <Col span="6" >
          <Input v-model="keyWord" icon="ios-search" placeholder="请输入内容标题" style="float: right" 
          @on-click="searchInfo()"
      @on-enter="searchInfo()"
          ></Input>
      </Col>
    </Row>
         <Table border :loading='loadingData' :columns="codeDetailsColumns" :data="ValidateCodeListdate" @on-selection-change="selectItem"></Table>
           <Row style="margin:15px 0">
              <Button class="btns" disabled v-if="selectIds==''">导入内容</Button>
              <Button class="btns" @click="upExl" v-if="selectIds!=''">导入内容</Button>
               <Page 
                   style='float: right;margin-top: '
                   :total="detailstp" 
                   :current='detailscp' 
                   :page-size="detailsep" 
                   size="small" 
                   show-total show-sizer  
                   :page-size-opts='[10,20,30]' 
                   @on-change="detailsPageChange" 
                   @on-page-size-change="detailsPagesizeChange"></Page>
            </Row>
<!--            设定价格-->
       <Modal v-model="allCodeModal" :mask-closable="false"  width="500">
          <p slot="header" style="text-align:center;color:#333;">设定价格</p>
              <Form ref="setPriceForm" :model="priceData" :label-width="120" :rules="dataRules">

          <FormItem label="销售价格" prop='money'>
            <Input v-model="priceData.money" placeholder="请输入整数" style="width: 300px"></Input>
          </FormItem>  

        </Form>
          <div slot="footer" style="text-align: center">
          <Button type="primary"  @click="submitEditAcademy('setPriceForm')">确定</Button>
        <Button type="ghost" @click="allCodeModal=false">取消</Button>
          </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data() {
            const priceRules = (rule, value, callback) => {
                let reg = /^[1-9]{1}\d{0,8}(.\d{1,2})?$|^0.\d{1,2}$/
                //                console.log(value)
                if (value === 0) {
                    callback();
                } else if (!value) {
                    callback(new Error('该项不能为空'));
                } else if (reg.test(value) || value == 0) {
                    callback()
                } else {
                    callback(new Error('请输入正确价格，最多有2位小数'));
                }
            };
            return {
                priceData: {
                    money: ''
                },
                keyWord: '',
                oldkeyWord: '',
                moneyId: '',
                loadingData: false,
                allCodeModal: false,
                exerType: '',
                isOnType: '全部',
                detailstp: 0,
                detailscp: 1,
                detailsep: 10,
                //每个机构的验证码
                ValidateCodeListdate: [],
                selectIds: [],
                dataRules: {
                    money: [{
                        validator: priceRules,
                        trigger: 'change'
                    }],
                },
                more: [
                    '下架',
                    '编辑价格',
                ],
                classList: [],
                codeDetailsColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    }, {
                        title: '编号',
                        key: 'Id',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.Id ? params.row.Id : "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Id ? params.row.Id : "-")
                            ])
                        }
                    }, {
                        title: '内容标题',
                        key: 'Title',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.Title ? params.row.Title : "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Title ? params.row.Title : "-")
                            ])
                        }
                    },
                    {
                        title: '作者',
                        key: 'Author',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.Author ? params.row.Author : "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Author ? params.row.Author : "-")
                            ])
                        }
                    },
                    {
                        title: '出版社',
                        key: 'Publisher',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.Publisher ? params.row.Publisher : "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Publisher ? params.row.Publisher : "-")
                            ])
                        }
                    }, {
                        title: '定价（元）',
                        width: 140,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }
                            }, params.row.MarketPrice ? ` ${this.formatPrice(params.row.MarketPrice, 2)}` : '0.00')
                        }
                    }, {
                        title: '销售价格（元）',
                        width: 140,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }
                            }, params.row.CurrentPrice ? `${this.formatPrice(params.row.CurrentPrice,2)}` : '0.00')
                        }
                    },
                    {
                        title: '导入时间',
                        key: 'CreateTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.CreateTime ? `${params.row.CreateTime}` : "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.CreateTime ? `${params.row.CreateTime}` : "-")
                            ])
                        }
                    }
                ],
            }
        },
        mounted() {
            this.getClass()
            this.loadingData=true
        },
        methods: {
            //批量操作先选ids
            selectItem(status) {
                //                console.log(status)
                status.forEach((i) => {
                    if (this.selectIds.indexOf(i.Id) < 0) {
                        this.selectIds.push(i.Id)
                    }
                })
                //                console.log(this.selectIds)
            },
            //导入资源
            upExl() {
                this.$Modal.confirm({
                    title: '',
                    content: '<p>是否导入选中资源</p>',
                    onOk: () => {
                        this.$Message.warning('开始导入......');
                        this.$http.post(this.ApiTransfer("/EukBuildContent/ImportContent"), this.ApiTransfer("/EukBuildContent/ImportContent", {
                            ZipType:this.ziptypes(this.exerType),    
                            objectIds: this.selectIds.toString(),
                            }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.$Message.success('已经成功导入成功');
                                }
                            })
                        this.selectIds = []
                        this.getlist(1)
                    },
                });
            },
            ziptypes(type){
                if(type=='TSHU'){
                    return 'Book'
                }else if(type=='TPIA'){
                    return 'Image'
                }else if(type=='BPDF'){
                    return 'PDF'
                }else if(type=='SHIP'){
                    return 'Video'
                }
            },
            //返回上一页
            brack() {
                this.$router.push({
                    path: "/wrap/resource/resourceImport/fileImport",
                })
            },
            gopath(path) {
                console.log(1)
                this.$router.push(path)
            },
            getClass() {
                this.$http.get(this.ApiTransfer("/EukBuildContent/GetObjectTypeList"), {
                        params: this.ApiTransfer("/EukBuildContent/GetObjectTypeList", {

                        })
                    })
                    .then((res) => {
//                        console.log(res)
                        if (res.data.Success) {
                            res.data.Data.DBList.map((item) => {
                                this.classList.push({
                                    value: item.DBCode,
                                    label: item.Name,
                                })
                            })
                            this.exerType = this.classList[0].value
                            this.getlist()
                        }
                    })
            },
            submitEditAcademy(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post(this.ApiTransfer("/Content/Update"),
                                this.ApiTransfer("/Content/Update", {
                                    id: this.moneyId,
                                    currentPrice: this.priceData.money,
                                }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.priceData = {
                                            money: ''
                                        },
                                        this.$Message.success('成功');
                                    this.getlist(1)
                                    this.allCodeModal = false;
                                }
                            })
                    }
                })
            },
            selectIson() {
                this.selectIds = []
                this.detailscp = 1
                this.getlist(1)
            },
            selectClass() {
                this.selectIds = []
                this.detailscp = 1
                this.getlist(1)
            },
            //机构验证码分页
            detailsPageChange(value) {
                //                this.selectIds =[]
                this.detailscp = value;
                this.getlist(1);
            },

            detailsPagesizeChange(value) {
                this.selectIds = []
                this.detailscp = 1
                this.detailsep = value;
                this.getlist(1);
            },
            searchInfo(type) {
                this.selectIds = []
                if (type == 1 || this.oldkeyWord != this.keyWord || this.keyWord) {
                    this.oldkeyWord = this.keyWord
                    this.detailscp = 1
                    this.loadingData = true
                    this.$http.get(this.ApiTransfer("/EukBuildContent/Search"), {
                            params: this.ApiTransfer("/EukBuildContent/Search", {
                                ps: this.detailsep,
                                cp: this.detailscp,
                                keyword: this.keyWord,
                                dbcode: this.exerType
                            })
                        })
                        .then((res) => {
                            if (res.data.Success) {
                                this.loadingData = false
                                this.oldkeyWord = this.keyWord
                                this.detailstp = res.data.Data.RecordCount
                                this.ValidateCodeListdate = res.data.Data.ItemList
                            }
                        })

                } else {
                    this.$Message.warning('请输入内容标题');
                }
            },

            /**
             * [dispatchOperate 点击每一行右侧下拉框，根据不同选项执行不同操作]
             * @Author   刘启瑞
             * @DateTime 2017-11-29
             * @param    {[type]}   index [description]
             * @return   {[type]}         [description]
             */
            dispatchOperate(index, row, rowIndex) {
                switch (index) {
                    case 0:
                        //停用
                        this.$http.post(this.ApiTransfer("/Content/OnShelf"),
                                this.ApiTransfer("/Content/OnShelf", {
                                    ids: row.Id,
                                    IsOnShelf: !row.IsOnShelf,
                                }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.$Message.success('操作成功');
                                    this.getlist(1)
                                }
                            })
                        break;
                    case 1:
                        this.priceData.money = row.CurrentPrice
                        this.allCodeModal = true;
                        this.moneyId = row.Id
                        break;
                    default:
                        // statements_def
                        break;
                }
            },


            /**
             * [getlist 机构详情]
             * @Author   刘启瑞
             * @DateTime 2017-11-30
             * @param    {[type]}   id [description]
             * @return   {[type]}      [description]
             */
            getlist() {
                this.loadingData = true
                this.$http.get(this.ApiTransfer("/EukBuildContent/Search"), {
                        params: this.ApiTransfer("/EukBuildContent/Search", {
                            ps: this.detailsep,
                            cp: this.detailscp,
                            keyword: this.oldkeyWord,
                            dbcode: this.exerType
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            this.loadingData = false
                            this.detailstp = res.data.Data.RecordCount
                            //                            this.ValidateCodeListdate = res.data.Data.ItemList

                            this.ValidateCodeListdate = []
                            res.data.Data.ItemList.forEach((item) => {
                                item = Object.assign({}, item, {
                                    _checked: false
                                })
                                if (this.selectIds.indexOf(item.Id) > -1) {
                                    item._checked = true;
                                }
                                this.ValidateCodeListdate.push(item)
                            })




                        }
                    })
            },
        },
    }

</script>
<style lang="less">
    .scheme {
        //min-width: 1200px
    }

    .resource-header {
        margin-bottom: 10px;
    }

</style>
