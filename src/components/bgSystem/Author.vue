<template>
  <div class="bg-system-user">
    <div class="system-title">
      <span>作者管理</span>
    </div>
    <div class="btn-line">
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入ID、昵称、电话" style="width: 300px;float: right" @on-click="searchInfo()"
      @on-enter="searchInfo()"></Input>
    </div>
    <div class="tables">
      <!--
    <Spin fix v-show="loadingData">
        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
        <div>数据加载中...</div>
      </Spin>
-->
      <Table border :columns="columns2" :loading='loadingData' :data="userList" ref="selection" @on-selection-change="selectItem"></Table>
      <Row>
        <Col class="page">
        <!--      <Page :total="parseInt(totalCount)" :current="parseInt(page)" :page-size="pageSize" show-total @on-change="change"></Page>-->
        <Page :total="parseInt(totalCount)" :current='parseInt(page)' :page-size="pageSize" size="small" show-total show-sizer show-elevator :page-size-opts='[10,20,30]' @on-change="change" @on-page-size-change="eachPageChange"></Page>
        </Col>
      </Row>
    </div>
    <!-- 修改用户 -->
    <Modal v-model="updateUserModal" :mask-closable="false" id="addUsermodal" width="430" @on-cancel="handleReset('form')">
      <p slot="header" style="text-align:center;color:#333;">修改信息</p>
      <Form ref="updateform" :model="updateItem" :rules="ruleInline" :label-width="90">
        <FormItem label="昵称:" prop="nickName">
          <Input v-model="updateItem.nickName" placeholder="请输入昵称"></Input>
        </FormItem>
        <FormItem label="密码:" prop="updatePassword">
          <Input type="password" v-model="updateItem.password" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem label="确认密码:" prop="updatePassCheck">
          <Input type="password" v-model="updateItem.passwdCheck" placeholder="确认密码"></Input>
        </FormItem>
        <FormItem style="text-align: center;margin-top: 20px;">
          <Button type="primary" @click="updateSubmit('updateform')">确定</Button>
          <Button type="ghost" @click="handleReset('updateform')">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
    import sha1 from 'crypto-js/sha1';
    export default {
        data() {
            const validatePhones = (rule, value, callback) => {
                var myreg = /^1[34578][0-9]{9}/;
                if (!value) {
                    return callback(new Error('电话不能为空'));
                } else if (!myreg.test(value)) {
                    return callback(new Error('请输入有效电话'));
                } else {
                    callback();
                }
            };
            //修改密码是否一致
            const updatePassCheck = (rule, value, callback) => {
                if (this.updateItem.passwdCheck !== this.updateItem.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            //修改密码是否填写
            const updatePassword = (rule, value, callback) => {
                //                if (!!this.updateItem.password) {
                //                    if (this.updateItem.password.length < 6) {
                //                        callback(new Error('密码长度不够'));
                //                    } else {
                //                        callback();
                //                    }
                //                } else {
                //                    callback(new Error('请输入密码'));
                //                }
                if (!this.updateItem.password) {
                    callback();
                } else if (this.updateItem.password != '') {
                    var reg = /^[^\u4e00-\u9fa5]{0,32}$/
                    //                    if (this.updateItem.password.length < 6) {
                    //                        callback(new Error('密码长度不够'));
                    //                    } else {
                    //                        callback();
                    //                    }
                    if (this.updateItem.password.length < 6 || this.updateItem.password.length > 32) {
                        callback(new Error('密码长度为6-32'));
                    } else if (!reg.test(this.updateItem.password)) {
                        callback(new Error('密码不能含有中文'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                keyWord: "",
                oldkeyWord: "",
                totalCount: 0,
                page: "1",
                pageSize: 20,
                addUserModal: false, //新增管理员
                updateUserModal: false, //修改管理员
                accountModal: false, //关联权限
                resetPSDModal: false, //重置密码
                resPsdValue: "",
                account: [],
                type: 4,
                loadingData: false,
                RoleType: [], //机构列表
                Rolelist: [], //角色列表
                system: [], //系统列表

                columns2: [{
                        title: 'ID',
                        ellipsis: true,
                        key: 'Id',
                        width: 100
                    }, {
                        title: '昵称',
                        key: 'NickName',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('div', [
                                h("span", params.row.NickName ? params.row.NickName : "-")
                            ])
                        }
                    }, {
                        title: '电话/邮箱',
                        ellipsis: true,
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
                        title: '状态',
                        ellipsis: true,
                        key: 'State',
                        width: 100,
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
                        ellipsis: true,
                        key: 'CreateTime',
                        width: 180,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Dropdown', {
                                    props: {
                                        trigger: "click",
                                    },
                                    style: {
                                        //                                        marginLeft: "50px"
                                    },
                                    on: {
                                        "on-click": (name) => {
                                            if (name == "update") {
                                                //修改
                                                this.updateUser(params.row)
                                            } else if (name == "lockFn") {
                                                //锁定
                                                this.lockFn(params.row.Id, params.row.State)
                                            }
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: "primary",
                                            size: 'small'
                                        },
                                    }, [
                                        h('span', '更多 '),
                                    ]),
                                    h('DropdownMenu', {
                                        slot: 'list'
                                    }, [
                                        h(params.row.UserType == 4 ? 'DropdownItem' : '', {
                                            props: {
                                                name: 'update'
                                            }
                                        }, '编辑'),
                                        h('DropdownItem', {
                                                props: {
                                                    name: 'lockFn'
                                                }
                                            },
                                            params.row.State == 1 ? '锁定' : "解锁")
                                    ])
                                ])
                            ]);
                        }


                    }
                ],
                changeId: '',
                userList: [],
                updateItem: {
                    phoneNumber: "",
                    password: '',
                    passwdCheck: "",
                    nickName: "",
                    sex: '',
                    age: "",
                    UserType: '',
                    system: '',
                    organizationId: '',
                },
                ruleInline: {
                    updatePassword: [{
                        //                        required: true,
                        validator: updatePassword,
                        trigger: 'blur'
                    }],
                    updatePassCheck: [{
                        //                        required: true,
                        validator: updatePassCheck,
                        trigger: 'blur'
                    }],
                    nickName: [{
                        required: true,
                        message: '请输入昵称',
                        trigger: 'blur'
                    }],
                },
                selectIds: "", //批量操作的ids
            }
        },
        mounted() {
            this.getlist(1)
        },
        methods: {
            //选着分类
            selectClass() {
                this.getlist(1)
            },
            //取消重置
            handleReset(name) {
                this.updateUserModal = false
                this.updateItem = {
                    objectid: '',
                    phoneNumber: "",
                    password: '',
                    passwdCheck: "",
                    nickName: "",
                    sex: '',
                    age: "",
                    UserType: 4,
                    system: '',
                    organizationId: '',
                }
                this.$refs[name].resetFields();
            },
            //修改信息详情
            updateUser(data) {
                this.updateUserModal = true
                this.updateItem = {
                    objectid: data.Id,
                    nickName: data.NickName,
                    UserType: data.UserType,
                    password: '',
                    passwdCheck: "",
                }
            },
            //用户列表
            getlist(type) {
                    this.loadingData = true
                    this.$http.get(this.ApiTransfer("/User/List"), {
                            params: this.ApiTransfer("/User/List", {
                                keyword: this.oldkeyWord.trim(),
                                ps: this.pageSize,
                                cp: this.page,
                                type: 4
                            })
                        })
                        .then((res) => {
                            if (res.data.Success) {
                                this.userList = res.data.Data.ItemList;
                                this.totalCount = res.data.Data.RecordCount;
                                this.loadingData = false
                            }
                        })
            },
            //用户列表
            searchInfo(type) {
                if (type == 1 || this.oldkeyWord != this.keyWord || this.keyWord) {
                    this.oldkeyWord = this.keyWord
                    this.page=1
                    this.loadingData = true
                    this.$http.get(this.ApiTransfer("/User/List"), {
                            params: this.ApiTransfer("/User/List", {
                                keyword: this.keyWord.trim(),
                                ps: this.pageSize,
                                cp: this.page,
                                type: 4
                            })
                        })
                        .then((res) => {
                            if (res.data.Success) {
                                this.oldkeyWord=this.keyWord
                                this.userList = res.data.Data.ItemList;
                                this.totalCount = res.data.Data.RecordCount;
                                this.loadingData = false
                            }
                        })
                } else {
                    this.$Message.warning('请输入ID、昵称、电话');
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
            //修改用户
            updateSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http.post(this.ApiTransfer("/User/UpdateAdmin"), this.ApiTransfer("/User/UpdateAdmin", {
                                objectid: this.updateItem.objectid,
                                password: this.updateItem.password.toString(),
                                nickName: this.updateItem.nickName,
                                userId: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id,
                                userType: 4
                            }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.$Message.success('修改成功');
                                    this.updateUserModal = false;
                                    this.updateItem = {
                                        //                                        objectid: '',
                                        //                                        password: '',
                                        //                                        passwdCheck: "",
                                        //                                        nickName: "",
                                        UserType: 4,
                                    }
                                    this.getlist(1);
                                } else {
                                    this.$Message.error(res.data.Description);
                                }
                            })
                    } else {
                        
                    }
                })
            },
            //锁定用户
            lockFn(id, state) { //1正常，2已锁定，3没有激活
                //                console.log(id, state)
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
            //删除
            DeleteGroup(group, id) {
                if (group) { //批量
                    if (this.selectIds == "") {
                        this.$Message.warning('请选择用户')
                    } else {
                        this.deleteFn(group)
                    }
                } else { //单个删除
                    this.deleteFn(group, id)
                }
            },
            deleteFn(group, id) {
                this.$Modal.confirm({
                    title: '确定要删除么？',
                    content: '<p>一旦删除，无法找回哟</p>',
                    onOk: () => {
                        this.$http.post(this.ApiTransfer("/User/Delete"), this.ApiTransfer("/User/Delete", {
                                ids: group ? this.selectIds : id,
                            }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.selectIds == "";
                                    this.$Message.success('删除成功')
                                    this.getlist(1)
                                }
                            })
                    }
                });
            }
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
