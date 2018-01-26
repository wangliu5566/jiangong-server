<template>
    <div>
     <Row class="resource-header">
         <Col span="18" >
               状态：
                <Select v-model="exerType" style="width:200px;" @on-change='selectClass'>
                <Option value="全部">全部</Option>
                <Option value="单选">单选</Option>
                <Option value="多选">多选</Option>
                <Option value="判断">判断</Option>
                <Option value="问答">问答</Option>
             </Select>

          </Col>
         <Col span="6" >
          <Input v-model="keyWord" icon="ios-search" placeholder="请输入课程名称" style="float: right" 
          @on-click="searchInfo()"
      @on-enter="searchInfo()"
          ></Input>
      </Col>
    </Row>
         <Table border :loading='loadingData' :columns="codeDetailsColumns" @on-selection-change="selectItem" :data="ValidateCodeListdate"></Table>
           <Row>
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
    </div>
</template>
<script>
    export default {
        data() {
            return {
                keyWord: '',
                loadingData: false,
                exerType: '全部',
                detailstp: 0,
                detailscp: 1,
                detailsep: 10,
                selectIds: [],
                //每个机构的验证码
                ValidateCodeListdate: [],
                //每个机构的验证码使用详情
                codeDetailsColumns: [ {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '编号',
                        key: 'Id'
                    },
                    {
                        title: '课程名称',
                        key: 'State',
                        align: 'center',
                        width: 140,
                        render: (h, params) => {
                            return h('div', [
                                h("span", params.row.State === 0 ? '未使用' : params.row.State === 1 ? '已使用' : "注销")
                            ])
                        }
                    },
                    {
                        title: '教师',
                        key: 'Account',
                        align: 'center',
                        width: 140,
                        render: (h, params) => {
                            return h('div', [
                                h("span", params.row.Account ? params.row.Account : "-")
                            ])
                        }
                    }
                ],
            }
        },
        props: ['curriculumData'],
        methods: {
            //批量操作先选ids
            selectItem(status) {
                var arr1 = []
                status.forEach(function(item, index) {
                    arr1.push(item.Id)
                })
                this.curriculumData.selectIds = arr1.join(",")
            },
            selectClass() {
                this.curriculumData.selectIds =[]
                this.page = 1
                this.detailsOrganization(1)
            },
            //机构验证码分页
            detailsPageChange(value) {
                this.curriculumData.selectIds =[]
                this.detailscp = value;
                this.detailsOrganization(1);
            },

            detailsPagesizeChange(value) {
                this.curriculumData.selectIds =[]
                this.detailsep = value;
                this.detailsOrganization(1);
            },
            searchInfo(type) {
               if (type == 1 || this.oldWord != this.keyWord || this.keyWord) {
                    this.oldWord = this.keyWord
                    this.detailscp = 1
                    this.loadingData = true
                  this.$http.get(this.ApiTransfer("/EukBuildContent/Search"), 
                    {params:this.ApiTransfer("/EukBuildContent/Search", {
                        ps: this.detailsep,
                        cp: this.detailscp,
                        keyword:this.keyword,
                        objectType:this.exerType
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
        else {
            this.$Message.warning('请输入内容标题');
        }
            },
            /**
             * [detailsOrganization 机构详情]
             * @Author   刘启瑞
             * @DateTime 2017-11-30
             * @param    {[type]}   id [description]
             * @return   {[type]}      [description]
             */
            detailsOrganization() {
                this.loadingData = true
                this.$http.get(this.ApiTransfer("/EukBuildContent/Search"), {
                        params: this.ApiTransfer("/EukBuildContent/Search", {
                            objectType: 107,
//                            categoryIds: 0,
                            ps: this.detailsep,
                            cp: this.detailscp,
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            this.loadingData = false
                            this.detailstp = res.data.Data.RecordCount
                            this.ValidateCodeListdate = res.data.Data.ItemList
                        }
                    })
            },
        },

        watch: {
            'curriculumData.load': {
                handler: function(nv) {
                    this.detailsOrganization();
                    this.keyWord = '';
                    this.exerType = '全部';
                    this.detailstp = 0;
                    this.detailscp = 1;
                    this.detailsep = 10;
                    this.ValidateCodeListdate = [];
                },
                deep: true
            },
        }
    }

</script>
<style lang="less">
    .resource-header {
        margin-bottom: 10px;
    }

</style>
