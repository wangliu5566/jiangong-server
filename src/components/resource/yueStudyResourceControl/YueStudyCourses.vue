<template>
  <div class="">
    <Row class="resource-header">
      <Col span="16">
       <Button type="primary" icon="plus-round" @click="addCurriculum">导入课程</Button>
      <span> &nbsp;</span>
      </Col>
      <Col span="8">
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入课程名称" style="float: right" @on-click="searchInfo()"
      @on-enter="searchInfo()"></Input>
      </Col>
    </Row>
    <div class="resource-table">
      <Table :loading='loadingData' border :columns="columns" @on-selection-change="selectItem" :data="dataList"></Table>
    </div>
    <Row>
      <Button class="allbtns" disabled v-if="selectIds==''">批量上架</Button>
      <Button class="allbtns" @click="putaway" v-if="selectIds!=''">批量上架</Button>
      <Button class="allbtns" disabled v-if="selectIds==''">批量下架</Button>
      <Button class="allbtns" @click="soldOut" v-if="selectIds!=''">批量下架</Button>
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
    <Modal v-model="showModal" :mask-closable="false" width='600px'   @on-cancel="showModal=false">
      <p slot="header" class="resource-modal-header">{{modalTitle}}</p>
      <!-- 修改课程 -->
      
      <update-yuestudy-course
      :yueStudyCourseData="yueStudyCourseData" 
      :updateSectionExecValid="modalConfirm.updateSectionExecValid"
       v-on:setParentData="setParentData"
        v-on:setValidRes="setValidRes"
        v-show="modalType == 2"> 
        </update-yuestudy-course>
          
      <create-curriculum
      :curriculumData="curriculumData" 
      :updateSectionExecValid="modalConfirm.updateSectionExecValid"
        v-show="modalType == 3"> 
        </create-curriculum>
        
        
      <div slot="footer" style="text-align: center;">
        <Button type="primary" v-if="modalType != 3" @click="handleExecValid">确定</Button>
        <Button type="primary" v-if="modalType == 3" @click="handleExecValid">导入</Button>
        <Button type="ghost" @click="showModal=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
    import updateYueStudyCourse from '../common/updateYueStudyCourseModal.vue';
    import createCurriculum from '../common/createCurriculum.vue';
    export default {
        data() {
            return {
                aa: '',
                totalCount: 0,
                page: "1",
                pageSize: 20,
                keyWord: '',
                oldkeyWord: '',
                loadingData: false, //loading开关
                //模态框属性
                showModal: false,
                modalTitle: '设定价格',
                modalType: 2, //模态框类型，1 - 设定价格  2- 修改课程  3 - 更新课程文件 4 - 设置优惠活动 5 - 设定版权
                modalConfirm: { //模态框确定按钮点击时触发哪个表单的表单验证 
                    updateSectionExecValid: false
                },

                //修改课程
                yueStudyCourseData: {
                    price: '',
                },
                curriculumData: {
                    selectIds: '',
                    load: false,
                },
                oldWord: '无异议',
                newthedata: [],
                more: [
                    '下架',
                    '编辑价格',
                    '设置规则',
                ],
                dataList: [],
                selectIds: [],
                columns: [{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    }, {
                        title: '编号',
                        key: 'Id',
                        width: 100
                    }, {
                        title: '课程名称',
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
                        }
                    }, {
                        title: '教师',
                        key: 'UpdateTime',
                        width: 180,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {}, params.row.UpdateTime ? params.row.UpdateTime : '-')
                            ])
                        }
                    }, {
                        title: '时长',
                        key: 'ExtendData',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {}, params.row.ExtendData.Description)
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
                    }, {
                        title: '资源状态',
                        key: 'IsOnShelf',
                        width: 120,
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
                    }, {
                        title: '上架时间',
                        key: 'CreateTime',
                        render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.CreateTime ? params.row.CreateTime : "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.CreateTime ? params.row.CreateTime : "-")
                            ])
                        }
                    },
                    {
                        title: '操作',
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
                                }, '课程详情'),
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

        components: {
            'update-yuestudy-course': updateYueStudyCourse,
            'create-curriculum': createCurriculum,
        },
        mounted() {
            this.getlist(1)
        },
        methods: {
            putaway() {
                this.$http.post(this.ApiTransfer("/Content/OnShelf"),
                        this.ApiTransfer("/Content/OnShelf", {
                            ids: this.selectIds,
                            IsOnShelf: true,
                        }))
                    .then((res) => {
                        if (res.data.Success) {
                            this.$Message.success('操作成功');
                            this.getlist(1)
                        }
                    })
            },
            soldOut() {
                this.$http.post(this.ApiTransfer("/Content/OnShelf"),
                        this.ApiTransfer("/Content/OnShelf", {
                            ids: this.selectIds,
                            IsOnShelf: false,
                        }))
                    .then((res) => {
                        if (res.data.Success) {
                            this.$Message.success('操作成功');
                            this.getlist(1)
                        }
                    })
            },
            //批量操作先选ids
            selectItem(status) {
                var arr1 = []
                status.forEach(function(item, index) {
                    arr1.push(item.Id)
                })
                this.selectIds = arr1.join(",")
            },
            /**
             * [goDetail 课程使用详情]
             * @Author   刘启瑞
             * @DateTime 2017-12-5
             * @param    {[type]}   id [description]
             * @return   {[type]}      [description]
             */
            goDetail(row) {
                this.$router.push({
                    path: "/wrap/resource/yueStudyResourceControl/YueStudyDetails",
                    query: {
                        knowledgeId: row.Id,
                        title: row.Title,
                    }
                })
            },
            //分页数量
            eachPageChange(pageSize) {
                this.selectIds = [];
                this.page = 1
                this.pageSize = pageSize;
                this.getlist(1)
            },
            change(page) {
                this.selectIds = [];
                this.page = page;
                this.getlist(1)
            },
            getlist(type) {
                this.loadingData = true
                this.$http.get(this.ApiTransfer("/Content/Search"), {
                        params: this.ApiTransfer("/Content/Search", {
                            keyword: this.oldkeyWord.trim(),
                            ps: this.pageSize,
                            cp: this.page,
                            objectTypes: 107,
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            this.dataList = res.data.Data.ItemList;
                            this.totalCount = res.data.Data.RecordCount;
                            this.loadingData = false
                        }
                    })
            },
            searchInfo(type) {
                if (type == 1 || this.oldWord != this.keyWord || this.keyWord) {
                    this.oldWord = this.keyWord
                    this.page = 1
                    this.loadingData = true
                    this.$http.get(this.ApiTransfer("/Content/Search"), {
                            params: this.ApiTransfer("/Content/Search", {
                                keyword: this.keyWord.trim(),
                                ps: this.pageSize,
                                cp: this.page,
                                objectTypes: 107,
                            })
                        })
                        .then((res) => {
                            if (res.data.Success) {
                                this.oldkeyWord = this.keyWord
                                this.dataList = res.data.Data.ItemList;
                                this.totalCount = res.data.Data.RecordCount;
                                this.loadingData = false
                            }
                        })
                } else {
                    this.$Message.warning('请输入课程名称');
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
                console.log(index)
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
                        this.updateSection(row)
                        break;
                    default:
                        // statements_def
                        break;
                }
            },

            /**
             * [setPriceData 子组件设置这个页面中的价格数据]
             * @Author   罗文
             * @DateTime 2017-11-16
             * @param    {[type]}   data [description]
             */
            setParentData(data) {
                //                console.log(data);
            },


            /**
             * [handleExecValid 点击确定，触发表单验证]
             * @Author   罗文
             * @DateTime 2017-11-16
             * @return   {[type]}   [description]
             */
            handleExecValid() {
                switch (this.modalType) {
                    case 3:
                        console.log(this.curriculumData)
                        break;
                    case 2:
                        this.$set(this.modalConfirm, 'updateSectionExecValid', !this.modalConfirm.updateSectionExecValid);
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
                if (valid) {
                    this.$http.post(this.ApiTransfer("/Content/Update"),
                            this.ApiTransfer("/Content/Update", {
                                id: this.moneyId,
                                currentPrice: this.yueStudyCourseData.price,
                            }))
                        .then((res) => {
                            if (res.data.Success) {
                                this.yueStudyCourseData = {
                                        price: '',
                                    },
                                    this.moneyId = ''
                                this.$Message.success('成功');
                                this.getlist(1)
                                this.showModal = false;
                            }
                        })
                }
            },


            /**
             * [updateSection 修改课程]
             * @Author   刘启瑞
             * @DateTime 2017-12-17
             * @param    {[type]}   row [description]
             * @return   {[type]}       [description]
             */
            updateSection(row) {
                //                console.log(row.ExtendData.CategoryId)
                this.yueStudyCourseData = {
                    price: row.CurrentPrice,
                }
                this.moneyId = row.Id
                this.modalType = 2;
                this.modalTitle = '编辑价格';
                this.showModal = true;
            },
            /**
             * [addCurriculum 导入课程]
             * @Author   刘启瑞
             * @DateTime 2017-12-17
             * @param    {[type]}   row [description]
             * @return   {[type]}       [description]
             */
            addCurriculum() {
                this.curriculumData = {
                    selectIds: [],
                    load: !this.curriculumData.load,
                };
                this.modalType = 3;
                this.modalTitle = '导入课程';
                this.showModal = true;
            }
        }
    }

</script>
<style lang="less">
    .allbtns {
        margin-top: 10px;
    }

</style>
