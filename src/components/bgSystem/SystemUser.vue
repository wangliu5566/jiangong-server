<template>
  <div class="bg-system-user">
    <div class="system-title">
      <span>普通用户管理</span>
    </div>
    <Row >
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入ID或昵称" style="width: 300px;float: right" 
      @on-click="searchInfo()"
      @on-enter="searchInfo()"
      ></Input>
    </Row>
  <div class="tables">
      <Table border :loading='loadingData' :columns="columns2" :data="userList" ref="selection" @on-selection-change="selectItem"></Table>
       <Row >
      <Col  style='float:left'>
<!--
      <Button class="btns" @click="handleSelectAll(true)">全选</Button>
      <Button class="btns" @click="handleSelectAll(false)">取消</Button>
-->
<!--      <Button class="btns btns1" @click="DeleteGroup(true)">批量删除</Button>-->
<!--      <Button class="btns btns1" @click="lockFnMore()">批量锁定</Button>-->
       </Col>
        <Col class="page">
           <Page :total="parseInt(totalCount)" :current='parseInt(page)' :page-size="pageSize" size="small" show-total show-sizer show-elevator :page-size-opts='[10,20,30]' @on-change="change" @on-page-size-change="eachPageChange"></Page>
        </Col>
        </Row>
    </div>
  </div>
    
</template>
<script>
    import sha1 from 'crypto-js/sha1';
    export default {
        data() {

            return {
                keyWord: "",
                oldkeyWord: "",
                totalCount: 0,
                page: "1",
                pageSize: 20,
                addUserModal: false, //新增管理员
                accountModal: false, //关联权限
                resetPSDModal: false, //重置密码
                resPsdValue: "",
                account: [],
                type: 2,
                loadingData: false,
                RoleType: [],
                columns2: [{
                    title: '编号',
                    width: 100,
                    key: 'Id',
                }, {
                    title: '昵称',
                    key: 'NickName',
                    ellipsis: true,
                    render: (h, params) => {
                        return h('span', [
                            h("span", {
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }
                            }, params.row.NickName ? params.row.NickName : "-")
                        ])
                    }
                }, {
                    title: '职业',
                    ellipsis: true,
                    key: 'Profession',
                    render: (h, params) => {
                        return h('span', [
                            h("span", {
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }
                            }, params.row.Profession ? params.row.Profession : "-")
                        ])
                    }
                }, {
                    title: '电话/邮箱',
                    ellipsis: true,
                    key: 'MobileNumber',
                    render: (h, params) => {
                        return h('span', [
                            h("span", {
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }
                            }, params.row.MobileNumber ? params.row.MobileNumber : params.row.Email ? params.row.Email : "-")
                        ])
                    }
                }, {
                    title: '用户来源',
                    ellipsis: true,
                    key: 'ProductName',
                    render: (h, params) => {
                        return h('span', [
                            h("span", {
                                style: {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }
                            }, params.row.ExtendData.ProductName ? params.row.ExtendData.ProductName : "-")
                        ])
                    }
                }, {
                    title: '状态',
                    ellipsis: true,
                    key: 'State',
                    width: 180,
                    render: (h, params) => {
                        return h('div', [
                            h("Button", {
                                props: {
                                    type: 'text',
                                    size: 'small',
                                    type: params.row.State == 1 ? 'success' : 'ghost'
                                },
                                style: {
                                    color: params.row.State == 1 ? '#19be6b' : 'red',
                                    backgroundColor: "#fff",
                                    cursor: 'default',
                                    borderColor: params.row.State == 1 ? '' : 'red'
                                }
                            }, params.row.State == 1 ? "正常" : params.row.State == 2 ? "锁定" : "未激活")
                        ])
                    }
                }, {
                    title: '创建时间',
                    width: 180,
                    key: 'CreateTime',
                }, {
                    title: '操作',
                    key: 'action',
                    width: 80,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: "primary",
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.lockFn(params.row.Id, params.row.State)
                                    }
                                }
                            }, params.row.State == 1 ? '锁定' : "解锁"),
//                            h("Button", {
//                                props: {
//                                    type: 'text',
//                                    size: 'small',
//                                    type: 'error'
//                                },
//                                on: {
//                                    click: () => {
//                                        this.resetPasswords(params.row.Id, params.row.State)
//                                    }
//                                }
//                            }, '重置密码')
                        ]);
                    }
                }],
                userList: [],
                addItem: {
                    phoneNumber: "",
                    password: '',
                    passwdCheck: "",
                    nickName: "",
                    sex: '保密',
                    age: "",
                    UserType: '',
                    email: '',
                    RoleType: ''
                },
                selectIds: "", //批量操作的ids
            }
        },
        mounted() {
            this.getlist(1)
        },
        methods: {
            search() {
                this.getlist()
            },
            //选着分类
            selectClass() {
                this.getlist(1)
            },
            //取消重置
            handleReset(name) {
                this.addUserModal = false
                this.addItem = {
                    phoneNumber: "",
                    password: '',
                    passwdCheck: "",
                    nickName: "",
                    email: "",
                    RoleType: '',
                    sex: '保密',
                }
                this.$refs[name].resetFields();
            },
            //用户列表
            getlist(type) {
                this.loadingData = true
                this.$http.get(this.ApiTransfer("/User/List"), {
                        params: this.ApiTransfer("/User/List", {
                            keyword: this.oldkeyWord.trim(),
                            ps: this.pageSize,
                            cp: this.page,
                            type: 7,
                            productId: 1
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            this.userList = res.data.Data.ItemList;
                            this.totalCount = res.data.Data.RecordCount;
                            this.loadingData = false;
                        }
                    })
            },
            //搜索用户列表
            searchInfo(type) {
                if (type == 1 || this.oldkeyWord != this.keyWord || this.keyWord) {
                    this.oldkeyWord = this.keyWord
                    this.loadingData = true
                    this.page = 1
                    this.$http.get(this.ApiTransfer("/User/List"), {
                            params: this.ApiTransfer("/User/List", {
                                keyword: this.keyWord.trim(),
                                ps: this.pageSize,
                                cp: this.page,
                                type: 7,
                                productId: 1
                            })
                        })
                        .then((res) => {
                            if (res.data.Success) {
                                this.oldkeyWord = this.keyWord
                                this.userList = res.data.Data.ItemList;
                                this.totalCount = res.data.Data.RecordCount;
                                this.loadingData = false;
                            }
                        })
                } else {
                    this.$Message.warning('请输入ID或昵称');
                }
            },
            //分页切换当前页
            change(page) {
                this.page = page;
                this.getlist(1)
            },
            //分页数量
            eachPageChange(pageSize) {
                this.pageSize = pageSize;
                this.getlist(1)
            },
            //全选
            handleSelectAll(status) {
                this.$refs.selection.selectAll(status);
            },
            //批量操作先选ids
            selectItem(status) {
                var arr1 = []
                status.forEach(function(item, index) {
                    arr1.push(item.Id)
                })
                this.selectIds = arr1.join(",")
            },
            //重置密码
            resetPasswords(id) {
                this.$Modal.confirm({
                    title: '',
                    content: '<p>是否重置密码为123456</p>',
                    onOk: () => {
                        this.$http.post(this.ApiTransfer("/Passport/ResetPassword"),
                                this.ApiTransfer("/Passport/ResetPassword", {
                                    objectId: id,
                                }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.$Message.success('密码已重置');
                                    this.getlist(1)
                                }
                            })
                    },
                })
            },
            //锁定用户(单人)
            lockFn(id, state) { //1正常，2已锁定，3没有激活
                this.$Modal.confirm({
                    title: '',
                    content: state == 1 ? '<p>是否锁定该用户</p>' : '<p>是否解锁该用户</p>',
                    onOk: () => {
                        this.$http.post(this.ApiTransfer("/User/SetState"), this.ApiTransfer("/User/SetState", {
                                ids: id,
                                state: state == 1 ? 2 : 1
                            }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.$Message.success(state == 1 ? '已锁定' : '已解锁');
                                    this.getlist(1)
                                }
                            })
                    },
                });

            },
            //锁定用户(多人)
            //            lockFnMore() { //1正常，2已锁定，3没有激活
            //                this.$http.post("/User/SetState", {
            //                       ids: this.selectIds,
            //                        state:2
            //                    })
            //                    .then((res) => {
            //                        if (res.data.Success) {
            //                            this.getlist(1)
            //                        }
            //                    })
            //            },
        },
        watch: {

        }
    }

</script>
<style lang="less">
    .bg-system-user {}

    #addUsermodal {
        .ivu-form-item {
            margin-bottom: 15px;
        }
        .ivu-modal-body {
            padding-right: 32px;
        }
        .ivu-form-item-error-tip {
            padding: 2px;
        }
        .ivu-modal-footer {
            display: none;
        }

        .test label:before {
            content: '*';
            display: inline-block;
            margin-right: 4px;
            line-height: 1;
            font-family: SimSun;
            font-size: 12px;
            color: #ff7676;
        }
    }

    #relevanceModal {
        .ivu-checkbox-group {
            border-radius: 10px;
            margin-left: 60px
        }
        .ivu-checkbox-wrapper {
            display: block;
            line-height: 28px;
            font-size: 14px;
            padding-left: 10px;
        }

        .warning {
            font-size: 14px;
        }
        .ivu-modal-footer {
            text-align: center;
        }
    }

</style>
