<template>
   <div class="order-form">

    <Row class="resource-header">
<!--
      <Col span='8'>
         <Select v-model="exerType" style="width:200px;" @on-change='selectClass'>
            <Option value="全部">全部</Option>
            <Option value="单选">单选</Option>
            <Option value="多选">多选</Option>
            <Option value="判断">判断</Option>
            <Option value="问答">问答</Option>
         </Select>
      </Col>
-->

      <Col span="18" >
        <span> &nbsp;</span>
      </Col>

      <Col span="6" >
          <Input v-model="keyWord" icon="ios-search" placeholder="请输入习题题干" style="float: right" 
          @on-click="searchInfo()"
      @on-enter="searchInfo()"
          ></Input>
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

     <Modal v-model="showModal" :mask-closable="false" >
        <p slot="header" class="resource-modal-header">{{modalTitle}}</p>
        <!-- 设定价格 -->
        <exercise-detail 
        :exerciseDetailData="exerciseDetailData" 
        v-show="modalType == 1"
        ></exercise-detail>

        <div slot="footer"  style="text-align: center;">
<!--          <Button type="ghost" @click="showModal=false">返回</Button>-->
          <Button type="primary" @click="showModal=false">确定</Button>
       </div>
    </Modal>
 
  </div>
</template>
<script>
    import exerciseDetail from '../common/exerciseDetailModal.vue';
    export default {
        data() {
            return {
                aa: '',
                totalCount: 0,
                page: "1",
                pageSize: 20,
                keyWord: '',
                oldkeyWord: '',
                exerType: '全部', //习题类型  0 - 全部   1 - 单选  2 - 多选  3 - 判断  4 - 问答
                loadingData: false, //loading开关

                //模态框属性
                showModal: false,
                modalTitle: '试卷名',
                modalType: 1, //模态框类型，1 - 设定价格  2- 修改习题  3 - 更新习题文件 4 - 设置优惠活动 5 - 设定版权

                //设定价格
                exerciseDetailData: {
                    subject: '计算机组装与维护实训',
                    title: '计算机组装与维护实训',
                    content: '计算机组装与维护实训计算机组装与维计算机组装与维护实训计算机组装与维护实训计算机组装与维计算机组装与维护实训',
                },

                dataList: [],
                columns: [{
                        title: '编号',
                        key: 'Id',
                        width:120
                    }, {
                        title: '试卷标题',
                        key: 'Title',
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
                    }, {
                        title: '用户名',
                        key: 'ExtendData',
                        width:200,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }
                            }, params.row.ExtendData.Subject ? params.row.ExtendData.Subject : '-');
                        }
                    },{
                        title: '试题数量',
                        key: 'ExtendData',
                        width:200,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }
                            }, params.row.ExtendData.Subject ? params.row.ExtendData.Subject : '-');
                        }
                    },{
                        title: '试题分值',
                        key: 'ExtendData',
                        width:200,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }
                            }, params.row.ExtendData.Subject ? params.row.ExtendData.Subject : '-');
                        }
                    }, {
                        title: '创建时间',
                        key: 'ExtendData',
                        width:160,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }
                            }, params.row.ExtendData.TestQuestionType ? params.row.ExtendData.TestQuestionType : '-');
                        }
                    },
                    {
                        title: '操作',
                        width: 180,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: "primary",
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.goDetail(params.row)
                                        }
                                    }
                                }, '详情'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteExer(params.row)
                                        }
                                    }
                                }, '删除'),
                            ]);
                        }
                    }
                ],
            }
        },

        components: {
            'exercise-detail': exerciseDetail,
        },
        mounted() {
            this.getlist(1)
        },
        methods: {
            //选着分类
            selectClass() {
                this.page=1
                this.getlist(1)
            },
            change(page) {
                this.page = page;
                this.getlist(1)
            },
            //分页数量
            eachPageChange(pageSize) {
                this.pageSize = pageSize;
                this.getlist(1)
            },
            getlist(type) {
                    this.loadingData = true
                    if(this.exerType=='全部'){
                       this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search",{
                            query: JSON.stringify({
                                keyword: this.oldkeyWord.trim(),
                                objectTypes: [113],
                            }),
                            ps: this.pageSize,
                            cp: this.page,
                        }))
                        .then((res) => {
                            if (res.data.Success) {
                                //                            console.log(res.data.Data.ItemList)
                                this.dataList = res.data.Data.ItemList;
                                this.totalCount = res.data.Data.RecordCount;
                                this.loadingData = false

                            }
                        }) 
                    }else{
                        this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search",{
                            query: JSON.stringify({
                                keyword: this.oldkeyWord.trim(),
                                objectTypes: [113],
                                ExtendProperties: {
                                   testQuestionType: this.exerType
                                }
                            }),
                            ps: this.pageSize,
                            cp: this.page,
                        }))
                        .then((res) => {
                            if (res.data.Success) {
                                //                            console.log(res.data.Data.ItemList)
                                this.dataList = res.data.Data.ItemList;
                                this.totalCount = res.data.Data.RecordCount;
                                this.loadingData = false

                            }
                        })
                    }
            },
            searchInfo(type) {
                if (type == 1 || this.oldWord != this.keyWord || this.keyWord) {
                    this.oldWord = this.keyWord
                    this.loadingData = true
                    if(this.exerType=='全部'){
                       this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search",{
                            query: JSON.stringify({
                                keyword: this.keyWord.trim(),
                                objectTypes: [113],
                            }),
                            ps: this.pageSize,
                            cp: this.page,
                        }))
                        .then((res) => {
                            if (res.data.Success) {
                                this.oldkeyWord=this.keyWord
                                this.dataList = res.data.Data.ItemList;
                                this.totalCount = res.data.Data.RecordCount;
                                this.loadingData = false

                            }
                        }) 
                    }else{
                        this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search",{
                            query: JSON.stringify({
                                keyword: this.keyWord.trim(),
                                objectTypes: [113],
                                ExtendProperties: {
                                    testQuestionType: this.exerType
                                }
                            }),
                            ps: this.pageSize,
                            cp: this.page,
                        }))
                        .then((res) => {
                            if (res.data.Success) {
                                this.oldkeyWord=this.keyWord
                                this.dataList = res.data.Data.ItemList;
                                this.totalCount = res.data.Data.RecordCount;
                                this.loadingData = false

                            }
                        })
                    }
                } else {
                    this.$Message.warning('请输入习题题干');
                }
            },

            /**
             * [goDetail 查看习题详情]
             * @Author   罗文
             * @DateTime 2017-11-19
             * @return   {[type]}   [description]
             */
            goDetail(row) {
                this.exerciseDetailData = {
                    subject: row.ExtendData.Subject,
                    testQuestionType: row.ExtendData.TestQuestionType,
                    score: row.ExtendData.Score,
                    title: row.Title,
                    content: JSON.parse(row.ExtendData.Options)
                }
                this.modalType = 1;
                this.modalTitle = '习题详情';
                this.showModal = true;
            },

            /**
             * [deleteExer 删除习题]
             * @Author   罗文
             * @DateTime 2017-11-19
             * @return   {[type]}   [description]
             */
            deleteExer(row) {
                this.$Modal.confirm({
                    title: '操作提示',
                    content: '<h3>确定删除这个习题？</h3>',
                    onOk: () => {
                        this.$http.post(this.ApiTransfer("/Content/Delete"), this.ApiTransfer("/Content/Delete",{
                                id: row.Id
                            }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.getlist(1)
                                    this.$Message.success('删除成功');
                                }
                            })
                    },
                });
            }
        }
    }

</script>
<style lang="less">


</style>
