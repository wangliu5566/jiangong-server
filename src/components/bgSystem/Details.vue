<template>
  <div class="details">
    <div class="system-title">
      <span>{{title}}验证码使用详情</span>
      <Button type="primary" style='float:right;margin-right:20px' @click="brack">返回</Button>
    </div>
    <Row class='top'>
      <Col span='8' class='title'><p>验证码总数</p><p>{{date.ValidateCodeCount}}</p></Col>
      <Col span='8' class='title'><p>已使验证码</p><p>{{date.ValidateCodeList.RecordCount}}</p></Col>
      <Col span='8' class='title'><p>未使用验证码</p><p>{{date.ValidateCodeCount-date.ValidateCodeList.RecordCount}}</p></Col>
      <Col  span='24'>
      <Table border :columns="codeDetailsColumns" :data="date.ValidateCodeList.ItemList"></Table>
      </Col>
    </Row>
    <Row class="down">
      <Page :total="tp" :current='cp' :page-size="ep" size="small" show-total show-sizer :page-size-opts='[10,20,30]' @on-change="currentPageChange" @on-page-size-change="eachPageChange"></Page>
    </Row>   
    <!-- 注销modal -->
    <Modal v-model="logoutModal" :mask-closable="false" width="600">
      <p slot="header" style="text-align:center;color:#333;">注销验证码提示</p>
      <div >
          <Row>
              <Col span='7' ><Icon type="android-alert" size="160" color='#ed3f14'></Icon></Col>
              <Col span='17'>
                  <p class="text">确定注销此验证码？</p>
                  <p class="text">注销后，使用此验证码的用户将需要重新激活。</p>
                  <p class="text">ps：系统会自动补充新的验证码来代替已注销的验证码</p>
              </Col>
          </Row>
      </div>
      <div slot="footer"  style="text-align: center;">
        <Button type="primary" @click="sureLogout">确定</Button>
        <Button type="ghost" @click="logoutModal=false">取消</Button>
      </div>
    </Modal> 
  </div>
</template>
<script>
    export default {
        data() {
            return {
                logoutModal: false, //注销窗口
                title: '',
                tp: 0,
                cp: 1,
                ep: 20,
                date:'',
                //验证码总览表格
                codeDetailsColumns: [{
                        title: '验证码',
                        key: 'Code',
                        align: 'center'
                    },
                    {
                        title: '机构码使用状态',
                        key: 'State',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h("span", params.row.State===0 ? '未使用' : params.row.State===1 ? '已使用' : "注销")
                            ])
                        }
                    },
                    {
                        title: '已绑定设备数',
                        key: 'DeviceCount',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h("span", params.row.DeviceCount ? params.row.DeviceCount+'/5' : "0/5")
                            ])
                        }
                    },
                    {
                        title: '激活时间',
                        key: 'ActivationTime',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h("span", params.row.ActivationTime ? params.row.ActivationTime : "-")
                            ])
                        }
                    },
                    {
                        title: '对应帐号',
                        key: 'Account',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h("span", params.row.Account ? params.row.Account : "-")
                            ])
                        }
                    },
                    {
                        title: '注销验证码',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color: "#2cabe3",
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        //关联权限
                                        click: () => {
                                            this.logout(params.row.Id)
                                        }
                                    }
                                }, '注销')
                            ])
                        }
                    }
                ],
            }
        },
        mounted() {
            this.getListData()
        },
        methods: {
            //返回上一页
            brack() {
                this.$router.push({
                    path: "/wrap/userMain/organiza",
                })
            },
            //确定注销
            sureLogout() {
                  this.$http.post(this.ApiTransfer("/ValidateCode/Cancel"), this.ApiTransfer("/ValidateCode/Cancel",{
                        validateCodeId:this.logoutid
                    }))
                    .then((res) => {
                        if (res.data.Success) {
                           this.getListData()
                            this.logoutModal = false
                        }
                    })
            },
            //注销
            logout(id) {
                this.logoutModal = true
                this.logoutid=id
            },
            //获取列表
            getListData() {
                this.title = this.$route.query.Title
                console.log(this.$route.query.knowledgeId)
                this.$http.get(this.ApiTransfer("/Organization/ValidateCodeList"), {
                        params: this.ApiTransfer("/Organization/ValidateCodeList",{
                            organizationId:this.$route.query.knowledgeId,
                            ps:this.ep,
                            cp:this.cp
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
//                            console.log(res.data.Data)
                            this.tp=res.data.Data.ValidateCodeList.RecordCount
                            this. date=res.data.Data
                        }
                    })
            },
            //分页
            currentPageChange(value) {
//                console.log(value)
                this.cp = value;
                this.getListData();
            },

            eachPageChange(value) {
                console.log(value)
                this.ep = value;
                this.getListData();
            },
        },
        beforeRouteLeave(to, from, next) {
            window.sessionStorage.setItem('bg_user_filter', '')
            next();
        },
        created() {
            this.getListData();
        },
        watch: {

        },

    }

</script>
<style lang="less">
    .system-title {
        margin-bottom: 30px
    }

    .details {
        .top {
            .title {
                background-color: #fff;
                text-align: center;
                border: 1px solid #ccc;
                padding: 6px;
                margin-bottom: 15px
            }
        }
        .down {
            float: right;
            margin-top: 15px
        }
    }

    .text {
        font-size: 16px;
    }

    .text:first-child {
        margin-top: 40px
    }

    .edit-ip-row {
        margin-bottom: 2px;
    }

    .editAcademy-model-body {
        width: 90%;
        .ivu-date-picker {
            width: 100%;
        }
    }

</style>
