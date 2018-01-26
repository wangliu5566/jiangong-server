<template>
    <div class="orgdetailds">
     <Row class="resource-header">
         <Col span="18" >
               状态：
                <Select v-model="exerType" style="width:200px;" @on-change='selectClass'>
                <Option value="全部">全部</Option>
                <Option value="已使用">已使用</Option>
                <Option value="未使用">未使用</Option>
             </Select>

          </Col>
         <Col span="6" >
    <Input v-model="keyWord" icon="ios-search" placeholder="请输入用户名" style="float: right" @on-click="searchInfo()" @on-enter="searchInfo()"></Input>
      </Col>
    </Row>
         <Table border :loading='loadingData' :columns="codeDetailsColumns" :data="ValidateCodeListdate"></Table>
           <Row style='margin-top: 10px'>
               <Page 
                   style='float: right;'
                   :total="detailstp" 
                   :current='detailscp' 
                   :page-size="detailsep" 
                   size="small" 
                   show-total show-sizer  
                   :page-size-opts='[10,20,30]' 
                   placement='top'
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
                oldkeyWord: '',
                loadingData: false,
                exerType: '全部',
                detailstp: 0,
                detailscp: 1,
                detailsep: 10,
                //每个机构的验证码
                ValidateCodeListdate: [],
                //每个机构的验证码使用详情
                codeDetailsColumns: [{
                        title: '验证码',
                        key: 'Code',
                        align: 'center',
                        width: 140,
                    },
                    {
                        title: '机构码使用状态',
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
                        title: '用户',
                        key: 'Account',
                        align: 'center',
                        width: 140,
                        render: (h, params) => {
                            return h('div', [
                                h("span", params.row.Account ? params.row.Account : "-")
                            ])
                        }
                    },
                    {
                        title: '有效期限',
                        key: 'ActivationTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h("span", params.row.StartTime ? `${params.row.StartTime}至${params.row.EndTime}` : "-")
                            ])
                        }
                    }
                ],
            }
        },
        props: ['orgid','orgzt'],
        methods: {
            selectClass() {
                this.detailscp = 1;
                this.detailsOrganization(1);
            },
            //机构验证码分页
            detailsPageChange(value) {
                this.detailscp = value;
                this.detailsOrganization(1);
            },

            detailsPagesizeChange(value) {
                this.detailscp = 1;
                this.detailsep = value;
                this.detailsOrganization(1);
            },
            searchInfo(type) {
                if (type == 1 || this.oldkeyWord != this.keyWord || this.keyWord) {
                    this.oldkeyWord = this.keyWord
                    this.loadingData = true
                    if (this.exerType == '全部') {
                        this.$http.get(this.ApiTransfer("/Organization/ValidateCodeList"), {
                                params: this.ApiTransfer("/Organization/ValidateCodeList", {
                                    organizationId: this.orgid,
                                    ps: this.detailsep,
                                    cp: this.detailscp,
                                    keyWord: this.keyWord
                                })
                            })
                            .then((res) => {
                                if (res.data.Success) {
                                    this.oldkeyWord = this.keyWord
                                    this.detailstp = res.data.Data.ValidateCodeList.RecordCount
                                    this.ValidateCodeListdate = res.data.Data.ValidateCodeList.ItemList
                                    this.loadingData = false
                                }
                            })
                    } else {
                        //                        console.log(this.keyWord)
                        this.$http.get(this.ApiTransfer("/Organization/ValidateCodeList"), {
                                params: this.ApiTransfer("/Organization/ValidateCodeList", {
                                    organizationId: this.orgid,
                                    ps: this.detailsep,
                                    cp: this.detailscp,
                                    keyWord: this.keyword,
                                    state: this.exerType == "未使用" ? '0' : '1',
                                })
                            })
                            .then((res) => {
                                if (res.data.Success) {
                                    this.oldkeyWord = this.keyWord
                                    this.detailstp = res.data.Data.ValidateCodeList.RecordCount
                                    this.ValidateCodeListdate = res.data.Data.ValidateCodeList.ItemList
                                    this.loadingData = false

                                }
                            })
                    }
                } else {
                    this.$Message.warning('请输入用户名');
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
                this.$http.get(this.ApiTransfer("/Organization/ValidateCodeList"), {
                        params: this.ApiTransfer("/Organization/ValidateCodeList", {
                            organizationId: this.orgid,
                            ps: this.detailsep,
                            cp: this.detailscp,
                            keyWord: this.keyword,
                            state: this.exerType == "未使用" ? '0' : this.exerType == "已使用" ? "1" : '',
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            this.loadingData = false
                            this.detailstp = res.data.Data.ValidateCodeList.RecordCount
                            this.ValidateCodeListdate = res.data.Data.ValidateCodeList.ItemList
                        }
                    })
            },
        },

        watch: {
            'orgzt': {
                handler: function(nv) {
                    this.keyWord = '';
                    this.exerType = '全部';
                    this.detailstp = 0;
                    this.detailscp = 1;
                    this.detailsep = 10;
                    this.ValidateCodeListdate = [];
                    this.detailsOrganization();
                },
                deep: true
            },
        }
    }

</script>
<style lang="less">
    .orgdetailds{
        .ivu-select-dropdown {
        position: fixed !important;
    }
    }
    .resource-header {
        margin-bottom: 10px;
    }

</style>
