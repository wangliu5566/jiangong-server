<template>
  <div class='filelmport'>
    <div class="system-title resource-system-title ">
      <span style="color: #2cabe3;font-weight: 700;">资源内容管理</span>
    </div>
    <Row class="resource-header">
      <Col span="18"> 类型：
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
      <Button type="primary" icon="plus-round" @click="gopath('/wrap/resource/resourceImport/schemeImport')">从资源库导入内容</Button>
      <!--             <Button type="primary" @click="">更新</Button>-->
      </Col>
      <Col span="6">
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入内容标题" style="float: right" @on-click="searchInfo()" @on-enter="searchInfo()"></Input>
      </Col>
    </Row>
    <Table border :loading='loadingData' ref="selection" :columns="codeDetailsColumns" :data="ValidateCodeListdate" @on-selection-change="selectItem"></Table>
    <Row style="margin-top: 15px">
      <Button class="btns" disabled v-if="selectIds==''">批量上架</Button>
      <Button class="btns" @click="putaway" v-if="selectIds!=''">批量上架</Button>
      <Button class="btns" disabled v-if="selectIds==''">批量下架</Button>
      <Button class="btns" @click="soldOut" v-if="selectIds!=''">批量下架</Button>
      <Button class="btns" disabled v-if="selectIds==''">导出内容</Button>
      <Button class="btns" @click="upExl" v-if="selectIds!=''">导出内容</Button>
      <Page style='float: right;margin-top: ' :total="detailstp" :current='detailscp' :page-size="detailsep" size="small" show-total show-sizer :page-size-opts='[10,20,30]' @on-change="detailsPageChange" @on-page-size-change="detailsPagesizeChange"></Page>
    </Row>
    <Row class='file-down'>
      <p>基本统计 <span @click="gopath('/wrap/resource/resourceImport/Filellook')">【查看详情报表】</span></p>
    </Row>
    <!--            设定价格-->
    <Modal v-model="allCodeModal" :mask-closable="false" width="500">
      <p slot="header" style="text-align:center;color:#333;">设定价格</p>
      <Form ref="setPriceForm" :model="priceData" :label-width="120" :rules="dataRules">
        <FormItem v-if='priceData.ObjectType!=108' label="销售价格" prop='money'>
          <Input v-model="priceData.money" placeholder="请输入整数" style="width: 300px"></Input>
        </FormItem>
        <FormItem v-if='priceData.ObjectType==108' label="中图价格" prop='mediumImagePrice'>
          <Input v-model="priceData.mediumImagePrice" placeholder="请输入整数" style="width: 300px"></Input>
        </FormItem>
        <FormItem v-if='priceData.ObjectType==108' label="原图价格" prop='originalImagePrice'>
          <Input v-model="priceData.originalImagePrice" placeholder="请输入整数" style="width: 300px"></Input>
        </FormItem>
        <Col span="1" v-if='priceData.ObjectType==104'>
        <Checkbox v-model="priceData.PaPerAllowSearch" style='margin-top: 8px'></Checkbox>
        </Col>
        <Col span="23" v-if='priceData.ObjectType==104'>
        <FormItem label="纸质书价格" prop='PaperBookPrice'>
          <Input v-model="priceData.PaperBookPrice" placeholder="请输入整数" :disabled='!priceData.PaPerAllowSearch' style="width: 280px"></Input>
        </FormItem>
        </Col>
        <Col span="1" v-if='priceData.ObjectType==104'>
        <Checkbox v-model="priceData.PODAllowSearch" style='margin-top: 8px'></Checkbox>
        </Col>
        <Col span="23" v-if='priceData.ObjectType==104'>
        <FormItem label="POD价格" prop='PodPrice'>
          <Input v-model="priceData.PodPrice" placeholder="请输入整数" :disabled='!priceData.PODAllowSearch' style="width: 280px"></Input>
        </FormItem>
        </Col>
      </Form>
      <div slot="footer" style="text-align: center">
        <Button type="primary" @click="submitEditAcademy('setPriceForm')">确定</Button>
        <Button type="ghost" @click="allCodeModal=false">取消</Button>
      </div>
    </Modal>
    <!--        查看详情-->
    <Modal v-model="detailsModal" :mask-closable="false" width="550">
      <p slot="header" style="text-align:center;color:#333;">详情</p>
      <Form ref="detailsForm" :model="detailsData" :label-width="120">
        <FormItem label="封面">
          <div class='zhanwei'>
            <img :src="detailsData.CoverUrl" style="max-width:280px;height: 200px" alt="">
          </div>
        </FormItem>
        <FormItem label="内容标题">
          <Input v-model="detailsData.Title" placeholder="" style="width: 300px" readonly></Input>
        </FormItem>
        <FormItem label="作者">
          <Input v-model="detailsData.Author" placeholder="" style="width: 300px" readonly></Input>
        </FormItem>
        <FormItem label="出版社">
          <Input v-model="detailsData.Publisher" placeholder="" style="width: 300px" readonly></Input>
        </FormItem>
        <FormItem label="内容简介">
          <Input v-model="detailsData.Abstracts" type="textarea" :rows="4" placeholder="" readonly style="width: 300px"></Input>
        </FormItem>
        <FormItem label="定价">
          <Input v-model="detailsData.MarketPrice" placeholder="" style="width: 300px" readonly></Input>
        </FormItem>
        <FormItem v-if='detailsData.ObjectType==104' label="载体类型">
          <Input v-model="classbook" placeholder="" style="width: 300px" readonly></Input>
        </FormItem>
        <FormItem label="类型">
          <span style="line-height: 34px;font-size: 14px;">{{resourceType(detailsData.ObjectType)}}</span>
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
            const mediumRules = (rule, value, callback) => {
                let reg = /^[1-9]{1}\d{0,8}(.\d{1,2})?$|^0.\d{1,2}$/
                //                console.log(value)
                if (value === 0) {
                    callback();
                } else if (!value) {
                    callback(new Error('该项不能为空'));
                } else if (reg.test(value) || value == 0) {
                    callback()
                } else {
                    callback(new Error('请输入正确价格，最多有9位正整数,2位小数'));
                }
            };
            const originalRules = (rule, value, callback) => {
                let reg = /^[1-9]{1}\d{0,8}(.\d{1,2})?$|^0.\d{1,2}$/
                //                console.log(value)
                if (value === 0) {
                    callback();
                } else if (!value) {
                    callback(new Error('该项不能为空'));
                } else if (reg.test(value) || value == 0) {
                    callback()
                } else {
                    callback(new Error('请输入正确价格，最多有9位正整数,2位小数'));
                }
            };
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
                    callback(new Error('请输入正确价格，最多有9位正整数,2位小数'));
                }
            };
            const PodPriceRules = (rule, value, callback) => {
                let reg = /^[1-9]{1}\d{0,8}(.\d{1,2})?$|^0.\d{1,2}$/
                //                console.log(value)
                if (value === 0) {
                    callback();
                } else if (!value) {
                    callback(new Error('该项不能为空'));
                } else if (reg.test(value) || value == 0) {
                    callback()
                } else {
                    callback(new Error('请输入正确价格，最多有9位正整数,2位小数'));
                }
            };
            const PaperBookPriceRules = (rule, value, callback) => {
                let reg = /^[1-9]{1}\d{0,8}(.\d{1,2})?$|^0.\d{1,2}$/
                //                console.log(value)
                if (value === 0) {
                    callback();
                } else if (!value) {
                    callback(new Error('该项不能为空'));
                } else if (reg.test(value) || value == 0) {
                    callback()
                } else {
                    callback(new Error('请输入正确价格，最多有9位正整数,2位小数'));
                }
            };
            return {
                priceData: {
                    money: ''
                },
                keyWord: '',
                oldkeyWord: '',
                allstr: '',
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
                classbook: '电子书 纸质书 POD',
                //每个机构的验证码
                ValidateCodeListdate: [],
                selectIds: [],
                dataRules: {
                    money: [{
                        validator: priceRules,
                        trigger: 'change'
                    }],
                    PodPrice: [{
                        validator: PodPriceRules,
                        trigger: 'change'
                    }],
                    PaperBookPrice: [{
                        validator: PaperBookPriceRules,
                        trigger: 'change'
                    }],
                    mediumImagePrice: [{
                        validator: mediumRules,
                        trigger: 'change'
                    }],
                    originalImagePrice: [{
                        validator: originalRules,
                        trigger: 'change'
                    }],
                },
                more: [
                    '下架',
                    '编辑价格',
                ],
                classList: [],
                codeDetailsColumns: [{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    }, {
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
                        width: 170,
                        render: (h, params) => {
                            let _this = this;
                            let aimArr = [];
                            this.more.forEach((item, index) => {
                                if (item == '下架') {
                                    aimArr.push(h('DropdownItem', {
                                        props: {
                                            name: item,
                                        }
                                    }, params.row.IsOnShelf ? '下架' : '上架'))
                                } else {
                                    aimArr.push(h('DropdownItem', {
                                        props: {
                                            name: item,
                                        }
                                    }, item))
                                }
                            })
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
                                h('Dropdown', {
                                    props: {
                                        trigger: 'click',
                                    },
                                    on: {
                                        'on-click': name => {
                                            //根据点击的是第几项，执行不同的操作
                                            this.dispatchOperate(this.more.indexOf(name), params.row, params.index);
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: "error",
                                            size: 'small'
                                        },
                                    }, [
                                        h('span', '更多 '),
                                    ]),

                                    h('DropdownMenu', {
                                        slot: 'list'
                                    }, [
                                        ...aimArr
                                    ])
                                ]),
                            ]);
                        }
                    }
                ],
            }
        },
        mounted() {
            this.getClass()
        },
        methods: {
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
                this.detailsModal = true
                this.detailsData = data
                //                                            console.log(this.detailsData)  
            },
            //批量上架
            putaway() {
                this.$http.post(this.ApiTransfer("/Content/OnShelf"),
                        this.ApiTransfer("/Content/OnShelf", {
                            ids: this.selectIds.join(","),
                            IsOnShelf: true,
                        }))
                    .then((res) => {
                        if (res.data.Success) {
                            this.selectIds = []
                            this.$Message.success('操作成功');
                            this.getlist(1)
                        }
                    })
            },
            //批量下架
            soldOut() {
                this.$http.post(this.ApiTransfer("/Content/OnShelf"),
                        this.ApiTransfer("/Content/OnShelf", {
                            ids: this.selectIds.join(","),
                            IsOnShelf: false,
                        }))
                    .then((res) => {
                        if (res.data.Success) {
                            this.selectIds = []
                            this.$Message.success('操作成功');
                            this.getlist(1)
                        }
                    })
            },
            //批量操作先选ids
            selectItem(status) {
                status.forEach((i) => {
                    if (this.selectIds.indexOf(i.Id) < 0) {
                        this.selectIds.push(i.Id)
                    }
                })
            },
            gopath(path) {
                //                console.log(1)
                this.$router.push(path)
            },
            //导出
            upExl() {
                //                console.log(this.selectIds)
                this.$http.post(this.ApiTransfer("/Content/ExportContent"), this.ApiTransfer("/Content/ExportContent", {
                        ids: this.selectIds.join(",")
                    }))
                    .then((res) => {
                        if (res.data.Success) {
                            this.selectIds = []
                            this.$refs.selection.selectAll(false)
                            var el = document.createElement("a");
                            document.body.appendChild(el);
                            el.href = res.data.Data; //url 是你得到的连接
                            el.target = '_new'; //指定在新窗口打开
                            el.download = 'true'
                            el.click();
                            document.body.removeChild(el);
                        }
                    })
            },
            getClass() {
                this.allstr = []
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
                                this.allstr.push(item.Type)
                            })

                            this.getlist()
                        }
                    })
            },
            submitEditAcademy(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.priceData.ObjectType == 104) {
                            this.$http.post(this.ApiTransfer("/Content/Update"),
                                    this.ApiTransfer("/Content/Update", {
                                        id: this.moneyId,
                                        currentPrice: this.priceData.money,
                                        extendData: JSON.stringify({
                                            PaPerAllowSearch: this.priceData.PaPerAllowSearch,
                                            PaperBookPrice: this.priceData.PaperBookPrice,
                                            PODAllowSearch: this.priceData.PODAllowSearch,
                                            PodPrice: this.priceData.PodPrice
                                        })
                                    }))
                                .then((res) => {
                                    if (res.data.Success) {
                                        this.priceData = {
                                                money: '',
                                                PaPerAllowSearch: '',
                                                PaperBookPrice: '',
                                                PODAllowSearch: '',
                                                PodPrice: '',
                                            },
                                            this.$Message.success('成功');
                                        this.getlist(1)
                                        this.allCodeModal = false;
                                    }
                                })
                        } else if (this.priceData.ObjectType == 108) {
                            this.$http.post(this.ApiTransfer("/Content/Update"),
                                    this.ApiTransfer("/Content/Update", {
                                        id: this.moneyId,
                                        extendData: JSON.stringify({
                                            MediumImagePrice: this.priceData.mediumImagePrice,
                                            OriginalImagePrice: this.priceData.originalImagePrice,
                                        })
                                    }))
                                .then((res) => {
                                    if (res.data.Success) {
                                        this.priceData = {
                                                mediumImagePrice: '',
                                                originalImagePrice: ''
                                            },
                                            this.$Message.success('成功');
                                        this.getlist(1)
                                        this.allCodeModal = false;
                                    }
                                })
                        } else {
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
                //                this.selectIds = []
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
                    if (this.keyWord) {
                        this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search", {
                                ps: this.detailsep,
                                cp: this.detailscp,
                                query: JSON.stringify({
                                    Keyword: this.keyWord,
                                    ObjectTypes: this.exerType == "全部" ? this.allstr : [this.exerType],
                                    ExtendProperties: {
                                        IsOnShelf: this.isOnType == "全部" ? "" : this.isOnType,
                                    }
                                })
                            }, ))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.oldkeyWord = this.keyWord
                                    this.detailstp = res.data.Data.RecordCount
                                    this.ValidateCodeListdate = res.data.Data.ItemList
                                    this.loadingData = false
                                }
                            })
                    } else {
                        this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search", {
                                ps: this.detailsep,
                                cp: this.detailscp,
                                query: JSON.stringify({
                                    "SearchOrderBy": {
                                        "ColumnName": "CreateTime",
                                        "Descending": true
                                    },
                                    Keyword: this.keyWord,
                                    ObjectTypes: this.exerType == "全部" ? this.allstr : [this.exerType],
                                    ExtendProperties: {
                                        IsOnShelf: this.isOnType == "全部" ? "" : this.isOnType,
                                    }
                                })
                            }, ))
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
                        if (row.ObjectType == 104) {
                            this.priceData = {
                                ObjectType: row.ObjectType,
                                money: this.formatPrice(row.CurrentPrice, 2),
                                PaPerAllowSearch: row.ExtendData.PaPerAllowSearch == 'true' ? true : false,
                                PaperBookPrice: this.formatPrice(row.ExtendData.PaperBookPrice, 2),
                                PODAllowSearch: row.ExtendData.PODAllowSearch == 'true' ? true : false,
                                PodPrice: this.formatPrice(row.ExtendData.PodPrice, 2),
                            }
                        } else if (row.ObjectType == 108) {
                            this.priceData = {
                                ObjectType: row.ObjectType,
                                mediumImagePrice: row.ExtendData.MediumImagePrice,
                                originalImagePrice: row.ExtendData.OriginalImagePrice
                            }
                        } else {
                            this.priceData = {
                                ObjectType: row.ObjectType,
                                money: row.CurrentPrice,
                            }
                        }
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
                if (this.oldkeyWord) {
                    this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search", {
                            ps: this.detailsep,
                            cp: this.detailscp,
                            query: JSON.stringify({
                                Keyword: this.oldkeyWord,
                                ObjectTypes: this.exerType == "全部" ? this.allstr : [this.exerType],
                                ExtendProperties: {
                                    IsOnShelf: this.isOnType == "全部" ? "" : this.isOnType,
                                }
                            })
                        }))
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
                } else {
                    this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search", {
                            ps: this.detailsep,
                            cp: this.detailscp,
                            query: JSON.stringify({
                                "SearchOrderBy": {
                                    "ColumnName": "CreateTime",
                                    "Descending": true
                                },
                                Keyword: this.oldkeyWord,
                                ObjectTypes: this.exerType == "全部" ? this.allstr : [this.exerType],
                                ExtendProperties: {
                                    IsOnShelf: this.isOnType == "全部" ? "" : this.isOnType,
                                }
                            })
                        }))
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
                }
            },
        },
    }

</script>
<style lang="less">
    .filelmport {
        //min-width: 1500px;
    }

    .resource-header {
        margin-bottom: 10px;
    }

    .zhanwei {
        background: url('../../../assets/zhanwei.jpg');
        background-size: 135px 200px;
        background-repeat: no-repeat;
        height: 200px;
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
