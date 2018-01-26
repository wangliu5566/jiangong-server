<template>
  <div class="bg-system-user">
    <div class="system-title">
      <span>管理员管理</span>
    </div>
    <div class="btn-line">
      <Button type="primary" icon="plus-round" @click="addUserModal=true">新增管理员</Button>
      <!--      <Button type="primary" @click="addUserModal=true">链接作者库</Button>-->
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入昵称、电话" style="width: 300px;float: right" @on-click="searchInfo()"
      @on-enter="searchInfo()" ></Input>
      <!--
      <Row style="float:right">
          <Select v-model="type" style="width:150px;float:right;margin-right:10px" @on-change='selectClass'>
            <Option v-for="item in classes" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
      </Row>
-->
    </div>
    <div class="tables">
      <Table border :loading='loadingData' :columns="columns2" :data="userList" ref="selection" @on-selection-change="selectItem"></Table>
      <Row>
        <!--
      <Col  style='float:left'>
      <Button class="btns" @click="handleSelectAll(true)">全选</Button>
      <Button class="btns" @click="handleSelectAll(false)">取消</Button>
      <Button class="btns btns1" @click="DeleteGroup(true)">批量删除</Button>
       </Col>
-->
        <Col class="page">
        <!--      <Page :total="parseInt(totalCount)" :current="parseInt(page)" :page-size="pageSize" show-total @on-change="change"></Page>-->
        <Page :total="parseInt(totalCount)" :current='parseInt(page)' :page-size="pageSize" size="small" show-total show-sizer show-elevator :page-size-opts='[10,20,30]' @on-change="change" @on-page-size-change="eachPageChange"></Page>
        </Col>
      </Row>
    </div>
    <!-- 新增用户 -->
    <Modal v-model="addUserModal" :mask-closable="false" id="addUsermodal" width="430" @on-cancel="handleReset('formInline')">
      <p slot="header" style="text-align:center;color:#333;">新增管理员</p>
      <Form ref="formInline" :model="addItem" :rules="ruleInline" :label-width="90">
        <FormItem label="昵称:" prop="nickName">
          <Input v-model="addItem.nickName" placeholder="请输入昵称"></Input>
        </FormItem>
        <FormItem label="密码:" prop="password" class="test">
          <Input type="password" v-model="addItem.password" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem label="确认密码:" prop="passwdCheck" class="test">
          <Input type="password" v-model="addItem.passwdCheck" placeholder="确认密码"></Input>
        </FormItem>
        <FormItem label="电话:" prop="phoneNumber" >
          <Input v-model="addItem.phoneNumber" placeholder="请输入电话"></Input>
        </FormItem>
        <FormItem label="邮箱" prop='email'>
          <Input v-model="addItem.email" placeholder="请输入邮箱"></Input>
        </FormItem>
        <FormItem label="所属机构:">
          <Select v-model="addItem.organizationId" style="width:290px">
            <Option v-for="item in RoleType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem style="text-align: center;margin-top: 20px;">
          <Button type="primary" @click="handleSubmit('formInline')">确定</Button>
          <Button type="ghost" @click="handleReset('formInline')">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 修改用户 -->
    <Modal v-model="updateUserModal" :mask-closable="false" id="addUsermodal" width="430" @on-cancel="handleReset('form')">
      <p slot="header" style="text-align:center;color:#333;">修改信息</p>
      <Form ref="form" :model="updateItem" :rules="ruleInline" :label-width="90">
        <FormItem label="昵称:" prop="nickName">
          <Input v-model="updateItem.nickName" placeholder="请输入昵称"></Input>
        </FormItem>
        <FormItem label="密码:" prop="updatePassword">
          <Input type="password" v-model="updateItem.password" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem label="确认密码:" prop="updatePassCheck">
          <Input type="password" v-model="updateItem.passwdCheck" placeholder="确认密码"></Input>
        </FormItem>
        <FormItem label="电话:" prop="phoneNumber">
          <Input v-model="updateItem.phoneNumber" placeholder="请输入电话"></Input>
        </FormItem>
        <FormItem label="邮箱" prop='email'>
          <Input v-model="updateItem.email" placeholder="请输入邮箱"></Input>
        </FormItem>
        <!--
        <FormItem label="角色分配:" prop="updateUserType" class="test">
            <Select v-model="updateItem.UserType" style="width:290px">
                <Option v-for="item in UserType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
-->
<!--
        <FormItem label="所属系统:">
          <Select v-model="updateItem.system" style="width:290px">
            <Option v-for="item in system" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
-->
        <FormItem label="所属机构:">
          <Select v-model="updateItem.organizationId" style="width:290px">
            <Option v-for="item in RoleType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem style="text-align: center;margin-top: 20px;">
          <Button type="primary" @click="updateSubmit('form')">确定</Button>
          <Button type="ghost" @click="handleReset('form')">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 角色分配 -->
    <Modal v-model="accountModal" :mask-closable="false" id="relevanceModal" width="530">
      <p slot="header" style="text-align:center;color:#333;">角色分配</p>
      <p>请选择角色：</p>
      <CheckboxGroup v-model="account">
        <Checkbox v-for="item in Rolelist" :label="item.id" :key="item.id">{{item.title}}</Checkbox>
      </CheckboxGroup>
      <div slot="footer">
        <Button type="primary" @click="changeRole">确定</Button>
        <Button type="ghost" @click="accountModal=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
    //    import sha1 from 'crypto-js/sha1';
    export default {
        data() {
            const validatePhones = (rule, value, callback) => {
                var myreg = /^1[34578][0-9]{9}/;
                if (!value) {
                    return callback();
                } else if (!myreg.test(value)) {
                    return callback(new Error('请输入有效电话'));
                } else {
                    callback();
                }
            };
            //验证角色分配不为空
            const validateuserType = (rule, value, callback) => {
                //                console.log(rule, value)
                if (this.addItem.UserType == '') {
                    return callback(new Error('请选择角色'));
                } else {
                    callback();
                }
            };
            //验证系统分配不为空
            const validatesystem = (rule, value, callback) => {
                //                console.log(this.addItem.system=='')
                if (this.addItem.system == '') {
                    return callback(new Error('请选择系统'));
                } else {
                    callback();
                }
            };
            //验证机构分配不为空
            const validateorganization = (rule, value, callback) => {
                //                console.log(this.addItem.system=='')
                if (this.addItem.organization == '') {
                    return callback(new Error('请选择机构'));
                } else {
                    callback();
                }
            };
            const validateName = (rule, value, callback) => {
                if (!value||value.trim().length==0) {
                    return callback(new Error('不能为空'));
                }else if(value.trim().length>60){
                    callback(new Error('角色名不能超过60字'));
                } else {
                    callback();
                }
            };
            //验证密码
            const validatePassword = (rule, value, callback) => {
                //                console.log(this.addItem.system=='')
                //                if (this.addItem.organization == '') {
                //                    return callback(new Error('请选择机构'));
                //                } else {
                //                    callback();
                //                }
                var reg = /^[^\u4e00-\u9fa5]{0,32}$/
                if (value == '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (value.length < 6 || value.length > 32) {
                        callback(new Error('密码长度为6-32'));
                    } else if (!reg.test(value)) {
                        callback(new Error('密码不能含有中文'));
                    } else {
                        callback();
                    }
                }

            };
            //密码是否一致
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.addItem.password) {
                    callback(new Error('两次输入密码不一致!'));
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
                //                console.log(value)
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
            //修改验证角色分配不为空
            const updateuserType = (rule, value, callback) => {
                //                                console.log(this.updateItem.UserType)
                if (this.updateItem.UserType == '') {
                    return callback(new Error('请选择角色'));
                } else {
                    callback();
                }
            };
            //修改验证系统分配不为空
            const updatesystem = (rule, value, callback) => {
                if (!this.updateItem.system) {
                    return callback(new Error('请选择系统'));
                } else {
                    callback();
                }
            };
            //修改验证机构分配不为空
            const updateorganization = (rule, value, callback) => {
                if (!this.updateItem.organizationId) {
                    return callback(new Error('请选择机构'));
                } else {
                    callback();
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
                classes: [{
                        value: 4,
                        label: '角色分类'
                    }, {
                        value: 1,
                        label: '系统管理员'
                    },
                    {
                        value: 3,
                        label: '作者'
                    },
                ],
                UserType: [{
                        value: 1,
                        label: '系统管理员'
                    },
                    {
                        value: 3,
                        label: '作者'
                    },
                ],
                ageList: [{
                        value: '20-30',
                        label: '20-30'
                    },
                    {
                        value: '30-45',
                        label: '30-45'
                    },
                    {
                        value: '45以上',
                        label: '45以上'
                    }
                ],
                columns2: [{
                        title: '编号',
                        ellipsis: true,
                        key: 'Id',
                    }, {
                        title: '昵称',
                        key: 'NickName',
                        ellipsis: 'true',
                        render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.NickName ? params.row.NickName : "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.NickName ? params.row.NickName : "-")
                            ])
                        }
                    },  {
                        title: '电话/邮箱',
                        ellipsis: 'true',
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
                        title: '状态',
                        ellipsis: true,
                        key: 'State',
                        width: 110,
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
                        title: '所属机构',
                        key: 'orgList',
                        render: (h, params) => {
                            return h('span', [
                                h("span", {
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.ExtendData.OrganizationTitle ? params.row.ExtendData.OrganizationTitle : "-")
                            ])
                        }
                    },{
                        title: '创建时间',
                        ellipsis: true,
                        width:175,
                        key: 'CreateTime',
                    }, 
                    //                           {
                    //                        title: '角色属性',
                    //                        ellipsis: true,
                    //                        key: 'Profession',
                    //                        render: (h, params) => {
                    //                            return h('div', [
                    //                                h("span", params.row.UserType == 1 ? '管理员' : "作者")
                    //                            ])
                    //                        }
                    //                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 120,
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
                                                //管理员修改
                                                this.updateUser(params.row.Id, params.index)
                                            } else if (name == "del") {
                                                //删除
                                                if (params.row.Id != JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id) {
                                                    this.DeleteGroup(false, params.row.Id)
                                                }
                                            } else if (name == "role") {
                                                //角色分配
                                                if (params.row.Id != JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id) {
                                                    this.relevanceRole(params.row.Id, params.index)
                                                }
                                            } else if (name == "lockFn") {
                                                //锁定

                                                if (params.row.Id != JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id) {
                                                    this.lockFn(params.row.Id, params.row.State)
                                                }
                                            } else if (name == "author") {

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
                                        h('DropdownItem', {
                                            props: {
                                                name: 'role',
                                                disabled: params.row.Id == JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id ? true : false,
                                            }
                                        }, '角色分配'),
                                        h('DropdownItem', {
                                            props: {
                                                name: 'update'
                                            }
                                        }, '编辑'),
                                        h('DropdownItem', {
                                                props: {
                                                    name: 'lockFn',
                                                    disabled: params.row.Id == JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id ? true : false,
                                                }
                                            },
                                            params.row.State == 1 ? '锁定' : "解锁"),
                                        h('DropdownItem', {
                                            props: {
                                                name: 'del',
                                                disabled: params.row.Id == JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id ? true : false,
                                            },
                                        }, '删除')
                                    ])
                                ])
                            ]);
                        }

                    }
                ],
                changeId: '',
                userList: [],
                addItem: {
                    phoneNumber: "",
                    password: '',
                    passwdCheck: "",
                    nickName: "",
                    sex: '',
                    age: "",
                    email: "",
                    UserType: 1,
                    system: '',
                    organizationId: '',
                },
                updateItem: {
                    phoneNumber: "",
                    password: '',
                    passwdCheck: "",
                    email: "",
                    nickName: "",
                    sex: '',
                    age: "",
                    UserType: '',
                    system: '',
                    organizationId: '',
                },
                ruleInline: {
                    phoneNumber: [{
                        validator: validatePhones,
                        trigger: 'blur'
                    }, ],
                    UserType: [{
                        validator: validateuserType,
                        trigger: 'change'
                    }, ],
                    System: [{
                        validator: validatesystem,
                        trigger: 'change'
                    }, ],
                    organization: [{
                        validator: validateorganization,
                        trigger: 'change'
                    }, ],
                    updateUserType: [{
                        validator: updateuserType,
                        trigger: 'change'
                    }, ],
                    updateSystem: [{
                        validator: updatesystem,
                        trigger: 'change'
                    }, ],
                    updateorganization: [{
                        validator: updateorganization,
                        trigger: 'change'
                    }, ],
                    password: [{
                        required: true,
                        validator: validatePassword,
                        trigger: 'blur'
                    }, ],
                    updatePassword: [{
                        validator: updatePassword,
                        trigger: 'blur'
                    }],
                    updatePassCheck: [{
                        validator: updatePassCheck,
                        trigger: 'blur'
                    }],
                    passwdCheck: [{
                        validator: validatePassCheck,
                        trigger: 'blur'
                    }],
                    nickName: [{
                        required: true,
                        validator: validateName,
                        trigger: 'blur'
                    }],
                    email: [{
//                        required: true,
                        message: '邮箱不能为空',
                        trigger: 'blur'
                    }, {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur'
                    }],
                },
                selectIds: "", //批量操作的ids
            }
        },
        mounted() {
            this.getlist(1)
            this.getOrganizationlist()
            this.getRolelist()
            this.getSystemlist()
        },
        methods: {
            //选着分类
            selectClass() {
                this.getlist()
            },
            //取消重置
            handleReset(name) {
                this.addUserModal = false
                this.addItem = {
                    phoneNumber: "",
                    email:"",
                    password: '',
                    passwdCheck: "",
                    nickName: "",
                    sex: '',
                    age: "",
                    UserType: 1,
                    system: '',
                    organizationId: '',
                }
                this.updateUserModal = false
                this.updateItem = {
                    phoneNumber: "",
                    email: "",
                    password: '',
                    passwdCheck: "",
                    nickName: "",
                    sex: '',
                    age: "",
                    UserType: '',
                    system: '',
                    organizationId: '',
                }
                this.$refs[name].resetFields();
            },
            //角色列表
            getRolelist() {
                this.$http.get(this.ApiTransfer("/Role/List"), {
                        params: this.ApiTransfer("/Role/List", {
                            keyword: this.keyWord,
                            ps: 999999999,
                            cp:1
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            for (var i = 0; i < res.data.Data.ItemList.length; i++) {
                                this.Rolelist.push({
                                    title: res.data.Data.ItemList[i].Title,
                                    id: res.data.Data.ItemList[i].Id,
                                })
                            }
                        }
                    })
            },
            //机构列表
            getOrganizationlist() {
                this.$http.get(this.ApiTransfer('/Organization/List'), {
                    params: this.ApiTransfer('/Organization/List', {
                        keyword: '',
                        ps: 999999999,
                    })
                }).then((res) => {
                    for (let i = 0; i < res.data.Data.ItemList.length; i++) {
                        this.RoleType.push({
                            value: res.data.Data.ItemList[i].Id,
                            label: res.data.Data.ItemList[i].Title
                        })
                    }
                })
            },
            //系统列表
            getSystemlist() {
                this.$http.get(this.ApiTransfer('/Product/List'), {
                    params: this.ApiTransfer('/Product/List', {
                        keyword: '',
                        ps: 999999999,
                    })
                }).then((res) => {
                    for (let i = 0; i < res.data.Data.ItemList.length; i++) {
                        this.system.push({
                            value: res.data.Data.ItemList[i].Id,
                            label: res.data.Data.ItemList[i].Title
                        })
                    }
                })
            },
            //修改信息详情
            updateUser(id) {
                this.$http.get(this.ApiTransfer("/User/Detail"), {
                    params: this.ApiTransfer("/User/Detail", {
                        id: id
                    })
                }).then((res) => {
                    if (res.data.Success) {
                        //                        console.log(res.data.Data)
                        this.updateUserModal = true
                        this.updateItem = {
                            objectid: res.data.Data.Id,
                            phoneNumber: res.data.Data.MobileNumber,
                            nickName: res.data.Data.NickName,
                            sex: res.data.Data.Sex,
                            age: res.data.Data.Age,
                            UserType: res.data.Data.UserType,
//                            system: res.data.Data.ExtendData && res.data.Data.ExtendData.PlatformProductId ? parseInt(res.data.Data.ExtendData.PlatformProductId) : '',
                            organizationId: res.data.Data.ExtendData && res.data.Data.ExtendData.OrganizationId ? parseInt(res.data.Data.ExtendData.OrganizationId) : '',
                            email: res.data.Data.Email,
                            password: '',
                            passwdCheck: "",
                        }
                    }
                })
            },
            //用户列表
            getlist(type) {
                    this.loadingData = true
                    this.$http.get(this.ApiTransfer("/User/List"), {
                            params: this.ApiTransfer("/User/List", {
                                keyword: this.oldkeyWord.trim(),
                                ps: this.pageSize,
                                cp: this.page,
                                type: 8
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
                                type: 8
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
                    this.$Message.warning('请输入昵称、电话');
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
            //角色分配
            relevanceRole(id, index) {
                this.accountModal = true;
                this.changeId = id
                //用户详情
                this.$http.get(this.ApiTransfer("/UserRole/RoleList"), {
                        params: this.ApiTransfer("/UserRole/RoleList", {
                            id
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            this.account = res.data.Data.ItemList.map((item) => {
                                return item.Id
                            })
                        }
                    })
            },
            //角色改变
            changeRole() {
                //                console.log(this.account,this.changeId)
                var roleIds = ''
                for (var i = 0; i < this.account.length; i++) {
                    if (i == this.account.length - 1) {
                        roleIds += this.account[i]
                    } else {
                        roleIds += (this.account[i] + ',')
                    }
                }
                this.$http.post(this.ApiTransfer("/UserRole/Update"), this.ApiTransfer("/UserRole/Update", {
                        id: this.changeId,
                        roleIds: roleIds,
                    }))
                    .then((res) => {
                        //                    console.log(res.data.Description)
                        if (res.data.Success) {
                            this.$Message.success(res.data.Description);
                            this.accountModal = false;
                        } else {
                            this.$Message.error(res.data.Description);
                        }
                    })
            },
            //新增用户
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http.post(this.ApiTransfer("/User/CreateOrUpdate"), this.ApiTransfer("/User/CreateOrUpdate", {
                                mobileNumber: this.addItem.phoneNumber,
                                password: this.addItem.password.toString(),
                                nickName: this.addItem.nickName.trim(),
                                sex: this.addItem.sex ? this.addItem.sex : '保密',
                                userType: this.addItem.organizationId ? 5 : 1,
                                profession: this.addItem.Profession,
                                email: this.addItem.email,
//                                productId: this.addItem.system,
                                organizationId: this.addItem.organizationId,
                            }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.$Message.success('新增成功');
                                    this.addUserModal = false;
                                    this.addItem = {
                                        objectid: '',
                                        phoneNumber: "",
                                        password: '',
                                        passwdCheck: "",
                                        nickName: "",
                                        sex: '',
                                        email: '',
                                        age: "",
                                        UserType: 1,
                                        system: '',
                                        organizationId: '',
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
            //修改用户
            updateSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data = {}
                        //                                                console.log(this.updateItem.organizationId?5:1)
                        if (!this.updateItem.password) {
                            data = {
                                mobileNumber: this.updateItem.phoneNumber,
                                objectid: this.updateItem.objectid,
                                nickName: this.updateItem.nickName.trim(),
                                sex: this.updateItem.sex ? this.addItem.sex : '保密',
                                age: this.updateItem.age,
                                userType: this.updateItem.organizationId ? 5 : 1,
                                profession: this.updateItem.Profession,
                                email: this.updateItem.email,
//                                productId: this.updateItem.system,
                                organizationId: this.updateItem.organizationId,
                                userId: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id,
                            }
                        } else {
                            data = {
                                mobileNumber: this.updateItem.phoneNumber,
                                objectid: this.updateItem.objectid,
                                password: this.updateItem.password.toString(),
                                nickName: this.updateItem.nickName.trim(),
                                sex: this.updateItem.sex ? this.addItem.sex : '保密',
                                age: this.updateItem.age,
                                userType:this.updateItem.organizationId ? 5 : 1,
                                profession: this.updateItem.Profession,
                                email: this.updateItem.email,
//                                productId: this.updateItem.system,
                                organizationId: this.updateItem.organizationId,
                                userId: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id,
                            }
                        }
                        this.$http.post(this.ApiTransfer("/User/UpdateAdmin"), this.ApiTransfer("/User/UpdateAdmin", {
                                ...data
                            }))
                            .then((res) => {
                                //                                console.log(res.data)
                                if (res.data.Success) {
                                    this.$Message.success('修改成功');
                                    this.updateUserModal = false;
                                    this.updateItem = {
                                        objectid: '',
                                        phoneNumber: "",
                                        password: '',
                                        passwdCheck: "",
                                        nickName: "",
                                        email: "",
                                        sex: '',
                                        age: "",
                                        UserType: '',
                                        system: '',
                                        organizationId: '',
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
