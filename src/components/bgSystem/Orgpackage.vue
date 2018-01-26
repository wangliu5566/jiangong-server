<template>
    <div class='filelmport'>
    <div class="system-title resource-system-title ">
      <span style="color: #2cabe3;font-weight: 700;">机构资源查看</span>
      <Button type="primary" style='float:right;margin-right:20px' @click="brack">返回</Button>
    </div>
     <Row class="resource-header">
         <Col span="18" >
               类型：
                <Select v-model="exerType" style="width:200px;" @on-change='selectClass'>
                <Option value="全部">全部</Option>
                 <Option v-for="item in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
             </Select>
                状态：
            <Select v-model="isOnType" style="width:200px;" @on-change='selectIson'>
                <Option value="全部">全部</Option>
                <Option value="true">已上架</Option>
                <Option value="false">未上架</Option>
             </Select>
<!--             <Button type="primary" @click="">更新</Button>-->
          </Col>
         <Col span="6" >
          <Input v-model="keyWord" icon="ios-search" placeholder="请输入内容标题" style="float: right" 
          @on-click="searchInfo()"
      @on-enter="searchInfo()"
          ></Input>
      </Col>
    </Row>
         <Table border :loading='loadingData' :columns="codeDetailsColumns" :data="ValidateCodeListdate" ></Table>
           <Row style="margin-top: 15px">
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
<!--        查看详情-->
       <Modal v-model="detailsModal" :mask-closable="false"  width="550">
          <p slot="header" style="text-align:center;color:#333;">详情</p>
              <Form ref="detailsForm" :model="detailsData" :label-width="120" >

          <FormItem label="封面" >
            <img :src="detailsData.CoverUrl" style="width: 280;height: 200px" alt="">
          </FormItem>  
          <FormItem label="内容标题" >
             <Input v-model="detailsData.Title" placeholder="" style="width: 300px" readonly></Input>
          </FormItem>  
          <FormItem label="作者" >
              <Input v-model="detailsData.Author" placeholder="" style="width: 300px" readonly></Input>
          </FormItem>  
          <FormItem label="出版社" >
             <Input v-model="detailsData.Publisher" placeholder="" style="width: 300px" readonly></Input>
          </FormItem>
          <FormItem label="内容简介" >
           <Input v-model="detailsData.Abstracts" type="textarea" :rows="4" placeholder="" style="width: 300px"></Input>
          </FormItem>  
          <FormItem label="定价" >
           <Input v-model="detailsData.MarketPrice" placeholder="" style="width: 300px" readonly></Input>
          </FormItem>  
          <FormItem label="载体类型" >
            <Input v-model="detailsData.MediaType" placeholder="" style="width: 300px" readonly></Input>
          </FormItem>  
          <FormItem label="类型" >
               {{resourceType(detailsData.ObjectType)}}
<!--            <Input v-model="detailsData.ObjectType" placeholder="" style="width: 300px" readonly></Input>-->
          </FormItem>  

        </Form>
          <div slot="footer" style="text-align: center">
        <Button type="ghost" @click="detailsModal=false">确定</Button>
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
                detailsData: {
                    Title: ""
                },
                loadingData: false,
                detailsModal: false,
                allCodeModal: false,
                exerType: '全部',
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
                classList: [],
                codeDetailsColumns: [{
                        title: '编号',
                        key: 'Id',
                        width: 120,
                    }, {
                        title: '内容标题',
                        key: 'Title',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.Title ? params.row.Title.replace(/<.*?>/ig, "") : "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Title.replace(/<.*?>/ig, ""))
                            ])
                        }

                    },
                    {
                        title: '作者',
                        key: 'Author',
                        align: 'center',
                        width: 140,
                         render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.Author ? params.row.Author: "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Author ? params.row.Author: "-")
                            ])
                        }
                    },
                    {
                        title: '出版社',
                        key: 'Publisher',
                        align: 'center',
                        width: 140,
                       render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.Publisher ? params.row.Publisher: "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Publisher ? params.row.Publisher: "-")
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
                            }, ` ${this.formatPrice(params.row.MarketPrice, 2)}`)
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
                            }, `${this.formatPrice(params.row.CurrentPrice,2)}`)
                        }
                    },
                    {
                        title: '导入时间',
                        key: 'ActivationTime',
                        align: 'center',
                        width:200,
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

                    }, {
                        title: '资源状态',
                        key: 'IsOnShelf',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        type: params.row.IsOnShelf ? 'success' : 'ghost'
                                    },
                                    style: {
                                        color: params.row.IsOnShelf ? '#19be6b' : '',
                                        backgroundColor: "#fff",
                                        cursor: 'default'
                                    }
                                }, params.row.IsOnShelf ? '已上架' : '未上架'),
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        width: 160,
                        render: (h, params) => {

                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: "primary",
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            //                                            this.updateSection(params.row)
                                            this.goDetail(params.row)

                                        }
                                    }
                                }, '查看详情'),

                            ]);
                        }
                    }
                ],
            }
        },
        mounted() {
            this.getlist()
            this.getClass()
        },
        methods: {
            //返回上一页
            brack() {
                this.$router.push({
                    path: "/wrap/userMain/organiza",
                })
            },
            titleType(data) {
                //                console.log(data.indexOf("</p>")>0)
                if (data.indexOf("</p>") > 0) {
                    return data.replace(/<.*?>/ig, "")
                } else {
                    return data
                }

            },
            //返回类型
            resourceType(data) {
                for (var i = 0; i < this.classList.length; i++) {
                    if (this.classList[i].value == data) {
                        return this.classList[i].label
                    }
                }
            },
            //查看详情
            goDetail(data) {
                this.detailsModal = 'true'
                this.detailsData = data
                //                                            console.log(this.detailsData)  
            },

            getClass() {
                this.$http.get(this.ApiTransfer("/ObjectType/ResourceList"), {
                        params: this.ApiTransfer("/ObjectType/ResourceList", {})
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            res.data.Data.map((item) => {
                                this.classList.push({
                                    value: item.Type,
                                    label: item.TypeDescription,
                                })
                            })
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
                this.selectIds = []
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
                if (type == 1 || this.oldkeyWord != this.keyWord || this.keyWord) {
                    this.oldkeyWord = this.keyWord
                    this.detailscp = 1
                    this.loadingData = true
                    if (this.exerType == '全部') {
                        this.$http.get(this.ApiTransfer("/Organization/ContentList"), {params:this.ApiTransfer("/Organization/ContentList", {
                        ps: this.detailsep,
                        cp: this.detailscp,
                        keyword: this.keyWord,
                        objectType: this.exerType == "全部" ? '' : this.exerType,
                        IsOnShelf: this.isOnType == "全部" ? "" : this.isOnType,
                        organizationIds:this.$route.query.knowledgeId
                    })})
                            .then((res) => {
                                if (res.data.Success) {
                                    this.oldkeyWord = this.keyWord
                                    this.detailstp = res.data.Data.RecordCount
                                    this.ValidateCodeListdate = res.data.Data.ItemList
                                    this.loadingData = false
                                }
                            })
                    } else {
                         this.$http.get(this.ApiTransfer("/Organization/ContentList"), {params:this.ApiTransfer("/Organization/ContentList", {
                        ps: this.detailsep,
                        cp: this.detailscp,
                        keyword: this.keyWord,
                        objectType: this.exerType == "全部" ? '' : this.exerType,
                        IsOnShelf: this.isOnType == "全部" ? "" : this.isOnType,
                        organizationIds:this.$route.query.knowledgeId
                    })})
                            .then((res) => {
                                if (res.data.Success) {
                                    this.oldkeyWord = this.keyWord
                                    this.detailstp = res.data.Data.RecordCount
                                    this.ValidateCodeListdate = res.data.Data.ItemList
                                    this.loadingData = false

                                }
                            })
                    }
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
                this.$http.get(this.ApiTransfer("/Organization/ContentList"), {params:this.ApiTransfer("/Organization/ContentList", {
                        ps: this.detailsep,
                        cp: this.detailscp,
                        keyword: this.oldkeyWord,
                        objectType: this.exerType == "全部" ? '' : this.exerType,
                        IsOnShelf: this.isOnType == "全部" ? "" : this.isOnType,
                        organizationIds:this.$route.query.knowledgeId
                    })})
                    .then((res) => {
                        if (res.data.Success) {
                            this.loadingData = false
                            this.detailstp = res.data.Data.RecordCount
                            this.ValidateCodeListdate = res.data.Data.ItemList
                        }
                    })
            },
        },
    }

</script>
<style lang="less">
    .filelmport {
        min-width: 1500px;
    }

    .resource-header {
        margin-bottom: 10px;
    }

    .file-down {
        margin-top: 10px;
        p {
            font-size: 16px;
            span {
                color: #e75151;
                cursor: pointer;
            }
        }
    }

</style>
