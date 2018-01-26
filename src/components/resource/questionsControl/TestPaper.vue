<template>
   <div class="order-form">

    <Row class="resource-header">
      <Col span='8'>
        <Button type="primary" @click='addDetail' icon="plus-round" >创建试卷生成参数</Button>
      </Col>

    </Row>

    <div class="resource-table">
        <Table  :loading='loadingData' border :columns="columns" :data="dataList"></Table>
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

    <Modal v-model="showModal" width="700" :mask-closable="false" >
        <p slot="header" class="resource-modal-header">{{modalTitle}}</p>

        <!-- 新增 -->
        <create-test
        :createUpdateTestData="createUpdateTestData" 
        :createOrUpdateTestValid="modalConfirm.setPriceExecValid"
        v-on:setParentData="setParentData"
        v-on:setValidRes="setValidRes"
        v-show="modalType == 1"
        ></create-test>
        
        <!-- 修改章节 -->
        <create-update-test
        :createUpdateTestData="createUpdateTestData" 
        :createOrUpdateTestValid="modalConfirm.createOrUpdateTestValid"
        v-on:setParentData="setParentData"
        v-on:setValidRes="setValidRes"
        v-show="modalType == 2"
        ></create-update-test>
        
        <div slot="footer"  style="text-align: center;">
          <Button type="primary" @click="handleExecValid">确定</Button>      
              <Button type="ghost" @click="showModal=false">取消</Button>
       </div>
    </Modal>
 
  </div>
</template>
<script>
    import createOrUpdateTest from '../common/createOrUpdateTestModal.vue';
    import createTestModal from '../common/createTestModal.vue';
    export default {
        data() {
            return {
                aa: '',
                totalCount: 100,
                page: "1",
                pageSize: 20,
                keyWord: '',
                loadingData: false,


                //模态框属性
                showModal: false,
                modalTitle: '创建试卷',
                modalType: 2, //模态框类型，2 - 新增或修改试卷，由是否传入id区分
                modalConfirm: { //模态框确定按钮点击时触发哪个表单的表单验证 
                    createOrUpdateTestValid: false,
                    setPriceExecValid: false,
                },

                //修改章节
                createUpdateTestData: {
                    title: '',
                    category: '',
                    radio: {
                        title: 'radio',
                        num: '',
                        score: ''
                    },
                    multiple: {
                        title: 'multiple',
                        num: '',
                        score: ''
                    },
                    judge: {
                        title: 'judge',
                        num: '',
                        score: ''
                    },
                    question: {
                        title: 'question',
                        num: '',
                        score: ''
                    },
                    time: '',
                },

                dataList: [],
                columns: [{
                        title: '编号',
                        key: 'Id',
                    },{
                        title: '标题',
                        key: 'Title',
                        width:160
                    },  {
                        title: '题型',
                        render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.ExtendData ? this.questionTypes(params.row.ExtendData) : '-',
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                },  params.row.ExtendData ? this.questionTypes(params.row.ExtendData) : '-')
                            ])
                        }
                    },{
                        title: '习题数量（道）',
                        key: 'TestQuestionCount',
                        render: (h, params) => {
                            return h('span', params.row.ExtendData.TestQuestionCount ? params.row.ExtendData.TestQuestionCount : '-');
                        }
                    }, {
                        title: '分值（分）',
                        key: 'ExtendData',
                        render: (h, params) => {
                            return h('span', params.row.ExtendData.Score ? params.row.ExtendData.Score : '-');
                        }
                    }, {
                        title: '参数',
                        key: 'ExtendData',
                        render: (h, params) => {
                            return h('span', params.row.ExtendData.Subject ? '-' : '-');
                        }
                    },

                    {
                        title: '操作',
                        width: 220,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.goDetail(params.row)
                                        }
                                    }
                                }, '修改试卷参数'),


                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteTest(params.row)
                                        }
                                    }
                                }, '删除试卷参数'),


                            ]);
                        }
                    }
                ],
            }
        },

        components: {
            'create-update-test': createOrUpdateTest,
            'create-test': createTestModal,
        },
        mounted() {
            this.getlist()
        },
        methods: {
            //试题类型
            questionTypes(data){
                var str="";
                if(data.SingleChoiceCount>0){
                    str+='单选题/'
                }
                if(data.MultipleChoiceCount>0){
                    str+='多选题/'
                }
                if(data.JudgeQuestionCount>0){
                    str+='判断题/'
                }
                if(data.AnswerQustionCount>0){
                    str+='问答题/'
                } 
                return str.substring(0,str.length - 1)
            },
            //分页数量
            eachPageChange(pageSize) {
                this.pageSize = pageSize;
                this.getlist()
            },
            change(page) {
                this.page = page
                this.getlist()
            },
            getlist() {
                this.loadingData = true
//                this.$http.get(this.ApiTransfer("/Content/Search"), {
//                        params: this.ApiTransfer("/Content/Search", {
//                            keyword: this.keyWord,
//                            ps: this.pageSize,
//                            cp: this.page,
//                            objectTypes: 114
//                        })
//                    })
//                    .then((res) => {
//                        if (res.data.Success) {
//                            this.dataList = res.data.Data.ItemList;
//                            this.totalCount = res.data.Data.RecordCount;
//                            this.loadingData = false
//                        }
//                    })
                     this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search", {
                        ps: this.pageSize,
                        cp: this.page,
                        query: JSON.stringify({
                            "SearchOrderBy": {
                                "ColumnName": "CreateTime",
                                "Descending": true
                            },
                            keyword: this.keyWord,
                            ObjectTypes: [114],
                        })
                    }))
                    .then((res) => {
                        if (res.data.Success) {
                            this.dataList = res.data.Data.ItemList;
                            this.totalCount = res.data.Data.RecordCount;
                            this.loadingData = false
                        }
                    })
            },

            /**
             * [goDetail 查看试卷详情]
             * @Author   罗文
             * @DateTime 2017-11-19
             * @return   {[type]}   [description]
             */
            goDetail(row) {
                this.moneyId = row.Id
                this.modalType = 2;
                this.modalTitle = '修改试卷';
                this.showModal = true;
                this.createUpdateTestData = {
                    title: row.Title,
                    category: row.ExtendData.Subject,
                    radio: {
                        title: 'radio',
                        num: row.ExtendData.SingleChoiceCount,
                        score: row.ExtendData.SingleChoiceScore
                    },
                    multiple: {
                        title: 'multiple',
                        num: row.ExtendData.MultipleChoiceCount,
                        score: row.ExtendData.MultipleChoiceScore
                    },
                    judge: {
                        title: 'judge',
                        num: row.ExtendData.JudgeQuestionCount,
                        score: row.ExtendData.JudgeQuestionScore
                    },
                    question: {
                        title: 'question',
                        num: row.ExtendData.AnswerQustionCount,
                        score: row.ExtendData.AnswerQustionScore
                    },

                    //                    totalNumAndScore: '',
                    time: row.ExtendData.ExamTime,
                }
            },
            /**
             * [addDetail 增加试卷]
             * @Author   罗文
             * @DateTime 2017-11-19
             * @return   {[type]}   [description]
             */
            addDetail() {
                this.modalType = 1;
                this.modalTitle = '新增试卷';
                this.showModal = true;
                this.createUpdateTestData = {
                    title: '',
                    category: '科目1',
                    radio: {
                        title: 'radio',
                        num: '0',
                        score: '2'
                    },
                    multiple: {
                        title: 'multiple',
                        num: '0',
                        score: '3'
                    },
                    judge: {
                        title: 'judge',
                        num: '0',
                        score: '4'
                    },
                    question: {
                        title: 'question',
                        num: '0',
                        score: '10'
                    },

                    totalNumAndScore: '',
                    time: '100',
                    //                    timeType: '1', //1 - 分钟 2 - 小时
                }
            },

            /**
             * [deleteTest 删除试卷]
             * @Author   罗文
             * @DateTime 2017-11-19
             * @return   {[type]}   [description]
             */
            deleteTest(row) {
                this.$Modal.confirm({
                    title: '操作提示',
                    content: '<h3>确定删除这个试卷？</h3>',
                    onOk: () => {
                        this.$http.post(this.ApiTransfer("/Content/Delete"), this.ApiTransfer("/Content/Delete", {
                                id: row.Id
                            }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.getlist()
                                    this.$Message.success('删除成功');
                                }
                            })
                    },
                });
            },


            /**
             * [setPriceData 子组件设置这个页面中的价格数据]
             * @Author   罗文
             * @DateTime 2017-11-16
             * @param    {[type]}   data [description]
             */
            setParentData(data) {},


            /**
             * [handleExecValid 点击确定，触发表单验证]
             * @Author   罗文
             * @DateTime 2017-11-16
             * @return   {[type]}   [description]
             */
            handleExecValid() {
                //modalType:1,   //模态框类型，1 - 设定价格  2- 修改章节  3 - 更新章节文件 4 - 设置优惠活动 5 - 设定版权
                switch (this.modalType) {
                    case 1:
                        this.$set(this.modalConfirm, 'setPriceExecValid', !this.modalConfirm.setPriceExecValid);
                        break;
                    case 2:
                        this.$set(this.modalConfirm, 'createOrUpdateTestValid', !this.modalConfirm.createOrUpdateTestValid);
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
                    switch (this.modalType) {
                        case 1:
                            this.$http.post(this.ApiTransfer("/Content/Create"),
                                    this.ApiTransfer("/Content/Create", {
                                        title: this.createUpdateTestData.title,
                                        objectType: 114,
                                        extendData:JSON.stringify({
                                            MultipleChoiceScore: this.createUpdateTestData.multiple.score,
                                            MultipleChoiceCount: this.createUpdateTestData.multiple.num,

                                            JudgeQuestionCount: this.createUpdateTestData.judge.num,
                                            JudgeQuestionScore: this.createUpdateTestData.judge.score,

                                            AnswerQustionCount: this.createUpdateTestData.question.num,
                                            AnswerQustionScore: this.createUpdateTestData.question.score,

                                            SingleChoiceScore: this.createUpdateTestData.radio.score,
                                            SingleChoiceCount: this.createUpdateTestData.radio.num,
                                            Score: this.createUpdateTestData.totalNumAndScore,

                                            ExamTime: this.createUpdateTestData.time,
                                            Subject: this.createUpdateTestData.category,
                                            TestQuestionCount: parseInt(this.createUpdateTestData.multiple.num) + parseInt(this.createUpdateTestData.judge.num) + parseInt(this.createUpdateTestData.question.num) + parseInt(this.createUpdateTestData.radio.num),
                                        })
                                    }))
                                .then((res) => {
                                    if (res.data.Success) {
                                        this.createUpdateTestData = {
                                            title: '',
                                            category: '',
                                            radio: {
                                                title: 'radio',
                                                num: '',
                                                score: ''
                                            },
                                            multiple: {
                                                title: 'multiple',
                                                num: '',
                                                score: ''
                                            },
                                            judge: {
                                                title: 'judge',
                                                num: '',
                                                score: ''
                                            },
                                            question: {
                                                title: 'question',
                                                num: '',
                                                score: ''
                                            },
                                            time: '',
                                        }
                                        
                                            this.getlist()
                                            this.showModal = false;
                                       
                                    }
                                })
                            break;
                        case 2:
                            this.$http.post(this.ApiTransfer("/Content/Update"), this.ApiTransfer("/Content/Update", {
                                    id: this.moneyId,
                                    title: this.createUpdateTestData.title,
                                    extendData: JSON.stringify({
                                        MultipleChoiceScore: this.createUpdateTestData.multiple.score,
                                        MultipleChoiceCount: this.createUpdateTestData.multiple.num,

                                        JudgeQuestionCount: this.createUpdateTestData.judge.num,
                                        JudgeQuestionScore: this.createUpdateTestData.judge.score,

                                        AnswerQustionCount: this.createUpdateTestData.question.num,
                                        AnswerQustionScore: this.createUpdateTestData.question.score,

                                        SingleChoiceScore: this.createUpdateTestData.radio.score,
                                        SingleChoiceCount: this.createUpdateTestData.radio.num,
                                        Score: this.createUpdateTestData.totalNumAndScore,

                                        ExamTime: this.createUpdateTestData.time,
                                        Subject: this.createUpdateTestData.category,
                                        TestQuestionCount: parseInt(this.createUpdateTestData.multiple.num) + parseInt(this.createUpdateTestData.judge.num) + parseInt(this.createUpdateTestData.question.num) + parseInt(this.createUpdateTestData.radio.num),
                                    })
                                }))
                                .then((res) => {
                                    if (res.data.Success) {
                                        this.createUpdateTestData = {
                                            title: '',
                                            category: '',
                                            radio: {
                                                title: 'radio',
                                                num: '',
                                                score: ''
                                            },
                                            multiple: {
                                                title: 'multiple',
                                                num: '',
                                                score: ''
                                            },
                                            judge: {
                                                title: 'judge',
                                                num: '',
                                                score: ''
                                            },
                                            question: {
                                                title: 'question',
                                                num: '',
                                                score: ''
                                            },
                                            time: '',
                                        }
                                        this.getlist()
                                        this.showModal = false;
                                    }
                                })
                            break;
                        default:
                            // statements_def
                            break;
                    }
                }
            },

        }
    }

</script>
<style lang="less">


</style>
