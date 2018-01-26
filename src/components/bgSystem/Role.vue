<template>
  <div class="bg-system-user">
    <div class="system-title">
      <span>角色管理</span>
    </div>
    <div class="btn-line">
      <Button type="primary" icon="plus-round" @click="addUserModal=true">新增角色</Button>
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入角色名称" style="width: 300px;float: right" 
      @on-click="searchInfo()"
      @on-enter="searchInfo()"
      ></Input>
    </div>
    
    
    
    <div class="tables">
     
      <Table border :loading='loadingData' :columns="columns2" :data="userList" ref="selection" @on-selection-change="selectItem"></Table>
      <Row>
      <Col  style='float:left'>
<!--
      <Button class="btns" @click="handleSelectAll(true)">全选</Button>
      <Button class="btns" @click="handleSelectAll(false)">取消</Button>
-->
<!--      <Button class="btns btns1" @click="DeleteGroup(true)">批量删除</Button>-->
       </Col>
        <Col class="page">
           <Page :total="parseInt(totalCount)" :current='parseInt(page)' :page-size="pageSize" size="small" show-total show-sizer show-elevator :page-size-opts='[10,20,30]' @on-change="change" @on-page-size-change="eachPageChange"></Page>
        </Col>
        </Row>
    </div>
    
    
    
    
    
    <!-- 新增用户 -->
    <Modal v-model="addUserModal" ref="addModal" :mask-closable="false"  id="addUsermodal" width="430"   @on-cancel="handleReset('formIn')" >
      <p slot="header" style="text-align:center;color:#333;">新增角色</p>
      <Form ref="formIn" :model="addItem" :rules="ruleInline" :label-width="90">
        <FormItem label="角色名称:" prop="title" class="test">
          <Input v-model="addItem.title" placeholder="请输入角色名称"></Input>
        </FormItem>
        <FormItem label="角色描述:" prop="description">
           <Input v-model="addItem.description" type="textarea" :autosize="{minRows: 6, maxRows:6}" placeholder="请输入角色描述"></Input>
        </FormItem>
        <FormItem style="text-align: center;margin-top: 20px;">
          <Button type="primary" @click="handleSubmit('formIn')">确定</Button>
          <Button type="ghost" @click="handleReset('formIn')">取消</Button>
        </FormItem>
      </Form>
    </Modal>
      
      
      
       <!-- 修改角色 -->
    <Modal v-model="updataUserModal" :mask-closable="false" id="updataUserModal" width="430">
      <p slot="header" style="text-align:center;color:#333;">修改角色</p>
      <Form ref="formInline" :model="updataItem" :rules="ruleInline" :label-width="90">
        <FormItem label="角色名称:" prop="title" class="test">
          <Input v-model="updataItem.title" placeholder="请输入角色名称"></Input>
        </FormItem>
        <FormItem label="角色描述:" prop="description">
           <Input v-model="updataItem.description" type="textarea" :autosize="{minRows: 6, maxRows:6}" placeholder="请输入角色描述"></Input>
        </FormItem>
          <FormItem style="text-align: center;margin-top: 20px;">
          <Button type="primary" @click="updataSubmit('formInline')">确定</Button>
          <Button type="ghost" @click="updataUserModal = false">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 关联权限 -->
    <Modal v-model="accountModal" :mask-closable="false"  width="630">
      <p slot="header" style="text-align:center;color:#333;">权限分配</p>
      <table class='list-title'>
          <td >可操作的频道</td>
          <td >具体权限</td>
      </table>
      <Tree ref="tree" :data="baseData" show-checkbox ></Tree>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="competence">确定</Button>
        <Button type="ghost" @click="accountModal=false">取消</Button>
      </div>
    </Modal>
    <!-- 查看权限 -->
    <Modal v-model="lookaccountModal" class='look-modal' width="630">
      <p slot="header" style="text-align:center;color:#333;">权限列表</p>
      <p style='font-size:16px;'>已拥有权限：{{roleRecordCount}}</p>
      <table class='list-title'>
          <td >可操作的频道</td>
          <td >具体权限</td>
      </table>
      <Tree ref="tree" :data="baseData" ></Tree>
       <div slot="footer">
        </div>
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
            const validatenum = (rule, value, callback) => {
                if (value.trim().length>200) {
                    return callback(new Error('输入的描述超过200字'));
                }else {
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
            return {
                ruleInline: {
                    phoneNumber: [{
                        validator: validatePhones,
                        trigger: 'blur'
                    }, ],
                    title: [{
                        validator: validateName,
                        trigger: 'blur'
                    }, ],
                    description:[{
                        validator: validatenum,
                        trigger: 'change'
                    }, ],
                },
                roleRecordCount: '',
                baseData: [],
                selectedId: '',
                loadingData: false, //loading开关
                keyWord: "",
                oldkeyWord: "",
                authorityId: "",
                totalCount: 0,
                page: "1",
                pageSize: 20,
                addUserModal: false, //新增角色
                updataUserModal: false, //修改角色
                accountModal: false, //关联权限
                lookaccountModal: false, //查看权限
                resPsdValue: "",
                account: [],
                childList: [], //所有权限
                columns2: [
                    {
                        title: '编号',
                        key: 'Id',
                        width: 120,
                    }, {
                        title: '角色名称',
                        key: 'Title',
                        ellipsis: true
                    }, {
                        title: '角色描述',
                        key: 'Description',
                        render: (h, params) => {
                            return h('span', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.Description ? params.row.Description : "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Description ? params.row.Description : "-")
                            ])
                        }
                    }, {
                        title: '权限列表',
                        width: 100,
                        key: 'PermissionCount',
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
                                            this.relevanceAccount(params.row.Id, true)
                                        }
                                    }
                                }, '查看')
                            ])
                        }
                    }, {
                        title: '创建时间',
                        width: 180,
                        key: 'CreateTime',
                    }, {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: "primary",
                                        size: 'small'
                                    },

                                    on: {
                                        //关联权限
                                        click: () => {
                                            this.relevanceAccount(params.row.Id, false)
                                        }
                                    }
                                }, '关联权限'),
                                h('Dropdown', {
                                    props: {
                                        trigger: "click",
                                    },

                                    on: {
                                        "on-click": (name) => {
                                            if (name == "update") {
                                                //修改
                                                this.UpdateGroup(params.row)
                                            } else if (name == "del") {
                                                //删除
                                                this.DeleteGroup(false, params.row.Id)
                                            }
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: "info",
                                            size: 'small'
                                        },
                                        style:{
                                            marginLeft:"6px"
                                        }
                                    }, [
                                        h('span', '更多 '),
                                    ]),
                                    h('DropdownMenu', {
                                        slot: 'list'
                                    }, [
                                        h('DropdownItem', {
                                            props: {
                                                name: 'update'
                                            }
                                        }, '修改'),
                                        h('DropdownItem', {
                                            props: {
                                                name: 'del'
                                            }
                                        }, '删除')
                                    ])
                                ])
                            ]);
                        }
                    }
                ],
                userList: [],
                addItem: {
                    title: '',
                    description: ''
                },
                updataItem: {
                    title: '',
                    description: ''
                },
                selectIds: "", //批量操作的ids
                selectedChild: [],
            }
        },
        mounted() {
            this.getlist(1)
            this.allCompetence()
        },
        methods: {
            //取消重置
            handleReset(name) {
                this.addUserModal = false
                this.addItem.title = ''
                this.addItem.description = ''
                this.$refs[name].resetFields();
            },
            //角色所有权限
            allCompetence() {
                this.$http.get(this.ApiTransfer("/Permission/List"), {
                        params: this.ApiTransfer("/Permission/List", {})
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            this.childList = res.data.Data.ChildList
                        }
                    })
            },
            //更改权限
            competence() {
                var arr = this.$refs.tree.getCheckedNodes()
                var str = ''
                for (var i = 0; i < arr.length; i++) {
                    if (i == arr.length - 1) {
                        str += arr[i].id
                    } else {
                        str += arr[i].id + ','
                    }
                }
                this.$http.post(this.ApiTransfer("/RolePermission/Update"),
                        this.ApiTransfer("/RolePermission/Update", {
                            roleId: this.selectedId,
                            permissionIds: str
                        }))
                    .then((res) => {
                        if (res.data.Success) {
                            this.selectedId = ''
                            this.getlist(1)
                            this.accountModal = false;
                        }
                    })
            },
            //角色列表
            getlist(type) {
               
                    this.loadingData = true
                    this.$http.get(this.ApiTransfer("/Role/List"), {
                            params: this.ApiTransfer("/Role/List", {
                                keyword: this.oldkeyWord.trim(),
                                ps: this.pageSize,
                                cp: this.page
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
            //角色列表
             searchInfo(type) {
                if (type == 1 || this.oldkeyWord != this.keyWord || this.keyWord) {
                    this.oldkeyWord = this.keyWord
                    this.loadingData = true
                    this.page=1
                    this.$http.get(this.ApiTransfer("/Role/List"), {
                            params: this.ApiTransfer("/Role/List", {
                                keyword: this.keyWord.trim(),
                                ps: this.pageSize,
                                cp: this.page,
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
                    this.$Message.warning('请输入角色名称');
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
            //过滤全部权限列表
            fi(list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].ChildList.length > 0) {
                        list[i].children = list[i].ChildList;
                        //                        list[i] = Object.assign({}, list[i], {
                        //                            expand: true
                        //                        })
                        delete list[i].ChildList;
                        this.fi(list[i].children)
                    }
                    list[i].id = list[i].Id;
                    list[i].title = list[i].Name;
                    delete list[i].Id;
                    delete list[i].Name;
                }
            },
            //权限分配
            relevanceAccount(id, index) {
                this.selectedId = id
                this.allCompetence()
                //                var list = this.childList
                this.fi(this.childList)
                this.baseData = this.childList
                //                console.log(this.baseData)
                this.$http.get(this.ApiTransfer("/UserRole/RolePermissonList"), {
                        params: this.ApiTransfer("/UserRole/RolePermissonList", {
                            id: id
                        })
                    })
                    .then((res) => {
                        this.roleRecordCount = res.data.Data.RecordCount
                        this.filterLimits(res.data.Data.ItemList, index)
                        if (index) {
                            this.lookaccountModal = true;
                        } else {
                            this.accountModal = true;
                        }
                    })
            },
            //子类权限过滤(array子数组，data选中的值)
            shju(array, data) {
                for (var j = 0; j < array.length; j++) {
                    var obj = array[j]
                    obj.expand = true
                    if (obj.id == data.Id) {
                        obj.checked = true
                        obj = Object.assign({}, obj, {
                            expand: true
                        })
                    }
                    if (!!array[j].children) {
                        this.shju(array[j].children, data)
                    }
                }
            },
            /*过滤权限*/
            filterLimits(data, index) {
                if (data.length == 0) {
                    data = [{
                        Id: 'akjfhasjhf'
                    }]
                }
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < this.baseData.length; j++) {
                        var seldata = data[i]
                        if (this.baseData[j].id == data[i].Id) {
                            this.baseData[j].checked = true
                        }
                        if (this.baseData[j].children.length > 0) {
                            //                            this.baseData[j] = Object.assign({}, this.baseData[j], {
                            //                                expand: true
                            //                            })
                            this.shju(this.baseData[j].children, seldata)
                        }
                    }
                }
                this.baseData = [...this.baseData].reverse()
                //                console.log(this.baseData)
                if (index) {
                    this.readAccess(this.baseData)
                }
            },
            //展示权限列表
            readAccess(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].children.length > 0) {
                        for (var j = 0; j < data[i].children.length; j++) {
                            for (var z = 0; z < data[i].children[j].children.length; z++) {
                                if (!data[i].children[j].children[z].checked) {
                                    //                                    data[i].children[j].children.splice(z, 1)
                                    //                                    z--
                                    data[i].children[j].children[z].title = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                                }
                            }
                        }
                    }
                }
            },
            //新增用户
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http.post(this.ApiTransfer("/Role/Create"),
                                this.ApiTransfer("/Role/Create", {
                                    title: this.addItem.title.trim(),
                                    description: this.addItem.description.trim(),
                                }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.$Message.success('新增成功');
                                    this.addUserModal = false;
                                    this.addItem = {
                                            title: "",
                                            description: '',
                                        },
                                        this.getlist(1);
                                } else {
                                    this.$Message.error(res.data.Description);
                                }
                            })
                    } else {
                       
                    }
                })
            },
            //更新用户
            updataSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http.post(this.ApiTransfer("/Role/Update"), this.ApiTransfer("/Role/Update", {
                                id: this.updataItem.id,
                                title: this.updataItem.title.trim(),
                                description: this.updataItem.description.trim(),
                            }))
                            .then((res) => {
                                if (res.data.Success) {
                                    this.$Message.success('修改成功');
                                    this.updataUserModal = false;
                                    this.updataItem = {
                                            id: '',
                                            title: "",
                                            description: '',
                                        },
                                        this.getlist(1);
                                } else {
                                    this.$Message.error(res.data.Description);
                                }
                            })
                    } else {
                       
                    }
                })
            },
            //修改
            UpdateGroup(val) {
                this.updataUserModal = true,
                    this.updataItem.title = val.Title
                this.updataItem.id = val.Id
                this.updataItem.description = val.Description
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
                //                console.log(this.selectIds, id)
                this.$Modal.confirm({
                    title: '删除提示',
                    content: '<p>确定删除该角色？</p>',
                    onOk: () => {
                        this.$http.post(this.ApiTransfer("/Role/Delete"), this.ApiTransfer("/Role/Delete", {
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
    .ivu-tree>.ivu-tree-children>li>.ivu-tree-children i {
        display: none;
    }

    .list-title {
        td {
            width: 300px;
            text-align: center;
            border: 1px solid rgb(215, 215, 215);
            padding: 5px
        }
    }

    .look-modal .ivu-checkbox-inner {
        display: none;
    }
    .look-modal {
        .ivu-tree{
            width: 550px
        }
    }

    .ivu-tree li ul ul>li {
        float: right;
        margin-top: -18px;
        margin-right: 20px
    }

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
            color: #ed3f14;
        }
    }

    #updataUserModal {
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
            color: #ed3f14;
        }
    }

    #relevanceModal {
        .ivu-checkbox-group {
            border-radius: 10px;
            margin-left: 60px
        }
        .ivu-checkbox-wrapper {
            /*
    display: block;
    line-height: 28px;
*/
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
