<template>
  <div class="">
    <Row class="resource-header">
      <Col span="16">
      <span style="color: #2cabe3;font-size: 16px">{{this.$route.query.title}} 详情</span>
      </Col>
      <Col span="2">
      <Select v-model="model1" style="" @on-change='selectClass'>
        <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      </Col>
      <Col span="6">
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入资源名称" style="float: right" @on-click="searchInfo()"
      @on-enter="searchInfo()"></Input>
      </Col>
    </Row>
    <div class="resource-table">
      <Table border  :loading="loadingData" :columns="columns" :data="dataList"></Table>
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
    <Modal v-model="showModal" :mask-closable="false"  @on-cancel="showModal=false">
      <p slot="header" class="resource-modal-header">{{modalTitle}}</p>
      <!-- 设定价格 -->
      <set-price :priceData="priceData" :setPriceExecValid="modalConfirm.setPriceExecValid" v-on:setParentData="setParentData" v-on:setValidRes="setValidRes" v-show="modalType == 1"></set-price>
      <!-- 修改资源 -->
      <update-yuestudy-courseresource :yueStudyCourseResourceData="yueStudyCourseResourceData" :updateSectionExecValid="modalConfirm.updateSectionExecValid" v-on:setParentData="setParentData" v-on:setValidRes="setValidRes" v-show="modalType == 2"></update-yuestudy-courseresource>
      <!-- 更新资源文件 -->
      <update-resource v-show="modalType == 3"></update-resource>
      <!-- 优惠活动 -->
      <discounts-activity :discountsActivityData="discountsActivityData" v-on:setParentData="setParentData" v-show="modalType == 4"></discounts-activity>
     <div slot="footer" style="text-align: center;">
        <Button type="primary" @click="handleExecValid">确定</Button>
        <Button type="ghost" @click="showModal=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
    import setPrice from '../common/setPriceModal.vue';
    import updateyueStudyCourseResource from '../common/updateyueStudyCourseResourceModal.vue';
    import updateResource from '../common/updateResourceModal.vue';
    import discountsActivity from '../common/discountsActivityModal.vue';
    export default {
        data() {
            return {
                loadingData: false,
                model1: 0,
                aa: '',
                totalCount: 0,
                page: "1",
                pageSize: 20,
                keyWord: '',
                oldkeyWord: '',

                list: [{
                    value: 0,
                    label: '全部'
                }, {
                    value: 103,
                    label: '电子标准'
                }, {
                    value: 101,
                    label: '知识元'
                }, {
                    value: 104,
                    label: '图书'
                }, {
                    value: 105,
                    label: 'OA论文'
                }, {
                    value: 106,
                    label: '电子电路包'
                }, {
                    value: 107,
                    label: '课程'
                }, {
                    value: 108,
                    label: '图片'
                }, {
                    value: 109,
                    label: '视频'
                }, {
                    value: 110,
                    label: '音频'
                }, {
                    value: 111,
                    label: '动画'
                }],

                //模态框属性
                showModal: false,
                modalTitle: '设定价格',
                modalType: 1, //模态框类型，1 - 设定价格  2- 修改资源  3 - 更新资源文件 4 - 设置优惠活动 
                modalConfirm: { //模态框确定按钮点击时触发哪个表单的表单验证 
                    setPriceExecValid: false,
                    updateSectionExecValid: false
                },


                //设定价格
                priceData: {
                    strategyType: '满减',
                    strategy: '1',
                    price: '',
                },

                //修改资源
                yueStudyCourseResourceData: {
                    title: '',
                    description: '',
                    category: '1',
                },

                //优惠活动
                discountsActivityData: {
                    isUseDiscounts: false,
                    activityId: '1'
                },



                more: [
                    '更新资源文件',
                    '下载资源文件',
                    '设置优惠活动',
                    '下架',
                    '删除',
                ],
                dataList: [],
                columns: [{
                        title: '内容标题',
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
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Title ? params.row.Title : "-")
                            ])
                        },
                        width: 200
                    }, {
                        title: '教师',
                        key: 'Author',
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
                        },

                    }, {
                        title: '出版社',
                        key: 'Publisher',
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
                        },
                    }, {
                        title: '资源类型',
                        render: (h, params) => {
                            return h('span', params.row.state == 1 ? '图书' : '视频');
                        }
                    },
                    {
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
                    }, {
                        title: '简介',
                        width: 120,
                        key: 'IsOnShelf',
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
                    //                    {
                    //                        title: '修改资源',
                    //                        align: 'center',
                    //                        render: (h, params) => {
                    //                            return h('div', [
                    //                                h('Button', {
                    //                                    props: {
                    //                                        type: 'primary',
                    //                                    },
                    //                                    on: {
                    //                                        click: () => {
                    //                                            this.updateSection(params.row)
                    //                                        }
                    //                                    }
                    //                                }, '修改资源'),
                    //                            ]);
                    //                        }
                    //                    },
                ],
            }
        },

        components: {
            'set-price': setPrice,
            'update-yuestudy-courseresource': updateyueStudyCourseResource,
            'update-resource': updateResource,
            'discounts-activity': discountsActivity,
        },
        mounted() {
            this.getlist(1)
            this.$emit('refreshList');
        },
        methods: {
            selectClass() {
                this.getlist(1)
            },
            //分页数量
            eachPageChange(pageSize) {
                this.page = 1
                this.pageSize = pageSize;
                this.getlist(1)
            },
            change(page) {
                //                console.log(page)
                this.page = page;
                this.getlist(1)
            },
            getlist(type) {
                    this.loadingData = true
                    if (this.model1 == 0) {
                        this.$http.get(this.ApiTransfer("/Content/Search"), {
                                params: this.ApiTransfer("/Content/Search", {
                                    keyword: this.oldkeyWord.trim(),
                                    //                            objectTypes: this.model1,
                                    packageId: this.$route.query.knowledgeId,
                                    cp: this.page,
                                    ps: this.pageSize,
                                })
                            })
                            .then((res) => {
                                if (res.data.Success) {
                                    this.dataList = res.data.Data.ItemList
                                    this.totalCount = parseInt(res.data.Data.RecordCount);
                                    this.loadingData = false
                                }
                            })
                    } else {
                        this.$http.get(this.ApiTransfer("/Content/Search"), {
                                params: this.ApiTransfer("/Content/Search", {
                                    keyword: this.oldkeyWord.trim(),
                                    objectTypes: this.model1,
                                    packageId: this.$route.query.knowledgeId,
                                    cp: this.page,
                                    ps: this.pageSize,
                                    //                            productId:3
                                })
                            })
                            .then((res) => {
                                if (res.data.Success) {
                                    this.dataList = res.data.Data.ItemList
                                    this.totalCount = parseInt(res.data.Data.RecordCount);
                                    this.loadingData = false
                                }
                            })
                    }
            },
            searchInfo(type) {
                if (type == 1 || this.oldWord != this.keyWord || this.keyWord) {
                    this.oldWord = this.keyWord
                    this.loadingData = true
                    this.page=1
                    if (this.model1 == 0) {
                        this.$http.get(this.ApiTransfer("/Content/Search"), {
                                params: this.ApiTransfer("/Content/Search", {
                                    keyword: this.keyWord.trim(),
                                    //                            objectTypes: this.model1,
                                    packageId: this.$route.query.knowledgeId,
                                    cp: this.page,
                                    ps: this.pageSize,
                                })
                            })
                            .then((res) => {
                                if (res.data.Success) {
                                    this.oldkeyWord=this.keyWord
                                    this.dataList = res.data.Data.ItemList
                                    this.totalCount = parseInt(res.data.Data.RecordCount);
                                    this.loadingData = false
                                }
                            })
                    } else {
                        this.$http.get(this.ApiTransfer("/Content/Search"), {
                                params: this.ApiTransfer("/Content/Search", {
                                    keyword: this.keyWord.trim(),
                                    objectTypes: this.model1,
                                    packageId: this.$route.query.knowledgeId,
                                    cp: this.page,
                                    ps: this.pageSize,
                                    //                            productId:3
                                })
                            })
                            .then((res) => {
                                if (res.data.Success) {
                                      this.oldkeyWord=this.keyWord
                                    this.dataList = res.data.Data.ItemList
                                    this.totalCount = parseInt(res.data.Data.RecordCount);
                                    this.loadingData = false
                                }
                            })
                    }
                } else {
                    this.$Message.warning('请输入资源名称');
                }
            },

            /**
             * [dispatchOperate 点击每一行右侧下拉框，根据不同选项执行不同操作]
             * @Author   罗文
             * @DateTime 2017-11-16
             * @param    {[type]}   index [description]
             * @return   {[type]}         [description]
             */
            dispatchOperate(index, row, rowIndex) {
                switch (index) {
                    case 0:
                        //更新资源文件
                        this.documentId = row.Id
                        this.modalType = 3;
                        this.modalTitle = '更新资源文件';
                        this.showModal = true;
                        break;
                    case 1:
                        //下载资源文件
                        this.$http.get(this.ApiTransfer("/File/Stream"), {
                            params: this.ApiTransfer("/File/Stream", {
                                id: row.Id
                            })
                        }).then((res) => {
                            if (res.data.Success) {
                                var el = document.createElement("a");
                                document.body.appendChild(el);
                                el.href = res.data.Data; //url 是你得到的连接
                                el.target = '_new'; //指定在新窗口打开
                                el.download = 'true'
                                el.click();
                                document.body.removeChild(el);
                            }
                        })
                        break;
                    case 2:
                        //设置优惠活动
                        if (!!row.ExtendData.SaleStrategyId && row.ExtendData.SaleStrategyId != 0) {
                            this.discountsActivityData = {
                                isUseDiscounts: true,
                                activityId: row.ExtendData.SaleStrategyId
                            }
                        } else if (row.ExtendData.SaleStrategyId == 0 || !row.ExtendData.SaleStrategyId) {
                            this.discountsActivityData = {
                                isUseDiscounts: false,
                                activityId: ''
                            }
                        }
                        this.documentId = row.Id
                        this.modalType = 4;
                        this.modalTitle = '设置优惠活动';
                        this.showModal = true;
                        break;

                    case 3:
                        //停用
                       this.$http.post(this.ApiTransfer("/Content/SetState"),
                                this.ApiTransfer("/Content/SetState", {
                                    ids: row.Id,
                                    state: !row.IsOnShelf,
                                    actionType:2
                                }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.$Message.success('操作成功');
                                    this.getlist(1)
                                }
                            })
                        break;

                    case 4:
                        //删除
                        this.$Modal.confirm({
                            title: '确定要删除么？',
                            content: '<p>一旦删除，无法找回哟</p>',
                            onOk: () => {
                                this.$http.post(this.ApiTransfer("/Content/Delete"),
                                        this.ApiTransfer("/Content/Delete", {
                                            id: row.Id
                                        }))
                                    .then((res) => {
                                        if (res.data.Success) {
                                            this.getlist(1)
                                            this.$Message.success('删除成功');
                                        }
                                    })
                            }
                        });

                        break;
                    default:
                        // statements_def
                        break;
                }
            },

            /**
             * [setPrice 设定价格]
             * @Author   罗文
             * @DateTime 2017-11-16
             * @param    {[type]}   row [description]
             */
            setPrice(row) {
                this.modalType = 1;
                this.modalTitle = '设定价格';
                this.showModal = true;
            },

            /**
             * [setPriceData 子组件设置这个页面中的价格数据]
             * @Author   罗文
             * @DateTime 2017-11-16
             * @param    {[type]}   data [description]
             */
            setParentData(data) {
                //                console.log(data);
                switch (this.modalType) {
                    case 1:
                        //                        this.$set(this.modalConfirm, 'setPriceExecValid', !this.modalConfirm.setPriceExecValid);
                        break;
                    case 2:
                        //                        this.$set(this.modalConfirm, 'updateSectionExecValid', !this.modalConfirm.updateSectionExecValid);
                        break;
                    case 3:
                        this.uploadId = data
                        break;
                    case 5:
                        this.copyright = data
                        break;
                    default:
                        // statements_def
                        break;
                }

            },


            /**
             * [handleExecValid 点击确定，触发表单验证]
             * @Author   罗文
             * @DateTime 2017-11-16
             * @return   {[type]}   [description]
             */
            handleExecValid() {
                //modalType:1,   //模态框类型，1 - 设定价格  2- 修改资源  3 - 更新资源文件 4 - 设置优惠活动
                switch (this.modalType) {
                    case 1:
                        this.$set(this.modalConfirm, 'setPriceExecValid', !this.modalConfirm.setPriceExecValid);
                        break;
                    case 2:
                        this.$set(this.modalConfirm, 'updateSectionExecValid', !this.modalConfirm.updateSectionExecValid);
                        break;
                    case 3:
                        this.$http.post(this.ApiTransfer("/Content/Update"), this.ApiTransfer("/Content/Update", {
                            id: this.documentId,
                            defaultFileId: this.uploadId
                        })).then((res) => {
                            if (res.data.Success) {
                                this.documentId = ''
                                this.uploadId = ''
                                this.$Message.success('成功');
                                this.getlist(1)
                                this.showModal = false;
                            }
                        })
                        break;
                    case 4:
                        if (this.discountsActivityData.isUseDiscounts && this.discountsActivityData.activityId !== '') {
                            this.$http.post(this.ApiTransfer("/ObjectSaleStrategy/SetContentSaleStrategy"),
                                this.ApiTransfer("/ObjectSaleStrategy/SetContentSaleStrategy", {
                                    objectId: this.documentId,
                                    saleStrategyId: this.discountsActivityData.activityId
                                })).then((res) => {
                                if (res.data.Success) {
                                    this.documentId = ''
                                    this.$Message.success('成功');
                                    this.discountsActivityData.activityId = ''
                                    this.getlist(1)
                                    this.showModal = false;
                                }
                            })
                        } else {
                            this.$http.post(this.ApiTransfer("/ObjectSaleStrategy/SetContentSaleStrategy"),
                                this.ApiTransfer("/ObjectSaleStrategy/SetContentSaleStrategy", {
                                    objectId: this.documentId,
                                    saleStrategyId: ''
                                })).then((res) => {
                                if (res.data.Success) {
                                    this.documentId = ''
                                    this.$Message.success('成功');
                                    this.discountsActivityData = {
                                            isUseDiscounts: false,
                                            activityId: ''
                                        },
                                        this.getlist(1)
                                    this.showModal = false;
                                }
                            })
                        }
                        break;
                    default:
                        // statements_def
                        break;
                }
            },

            /**
             * [setValidRes 子组件验证表单，返回验证结果]
             * @Author   罗文
             * @DateTime 2017-11-16
             * @param    {[type]}   valid [description]
             */
            setValidRes(valid) {
                if (valid.valid) {
                    let modelType = valid.modelType
                    switch (modelType) {
                        case 1:

                            break;
                        case 2:
                            //                            console.log(this.sectionData)
                            this.$http.post(this.ApiTransfer("/Content/Update"),
                                    this.ApiTransfer("/Content/Update", {
                                        id: this.moneyId,
                                        title: this.yueStudyCourseResourceData.title,
                                        ObjectType: this.yueStudyCourseResourceData.category,
                                        currentPrice: this.yueStudyCourseResourceData.price,
                                        abstracts: this.yueStudyCourseResourceData.abstracts,
                                        //                                    extendData: JSON.stringify({
                                        //                                        Source: this.sectionData.resource
                                        //                                    })
                                    }))
                                .then((res) => {
                                    if (res.data.Success) {
                                        this.yueStudyCourseResourceData = {
                                            title: '',
                                            abstracts: '',
                                            category: '',
                                            price: '',
                                        }
                                        this.$Message.success('成功');
                                        this.getlist(1)
                                        this.showModal = false;
                                    }
                                })
                            break;
                        case 3:
                            console.log(111)
                            break;
                        default:
                            // statements_def
                            break;
                    }
                }
            },


            /**
             * [updateSection 修改资源]
             * @Author   罗文
             * @DateTime 2017-11-16
             * @param    {[type]}   row [description]
             * @return   {[type]}       [description]
             */
            updateSection(row) {
                this.yueStudyCourseResourceData = {
                    title: row.Title,
                    abstracts: row.Abstracts,
                    category: row.ObjectType,
                    price: row.CurrentPrice,
                }
                this.moneyId = row.Id
                this.modalType = 2;
                this.modalTitle = '修改资源';
                this.showModal = true;
            }
        }
    }

</script>
<style lang="less">


</style>
