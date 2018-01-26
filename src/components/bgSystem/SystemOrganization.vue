<template>
  <div class="academy-main">
    <div class="system-title">
      <span>机构管理</span>
    </div>
    <Row style='height: 50px;'>
      <Col span='6'>
      <Button type="primary" @click="addNewAcademy">
        <Icon type="plus-round"></Icon> 新增机构</Button>
      
<!--
      <Button type="error" @click="deleteAcademyByBatches">
        <Icon type="close-round"></Icon> 批量删除</Button>
      <Button type="primary" @click="toValidataList">
        <Icon type="search"></Icon> 查看激活码列表</Button>
-->
      </Col>
      <Input v-model="keyWord" style="width: 300px; float: right;" icon="ios-search-strong" placeholder="请输入机构名称" @on-click="searchInfo" @on-enter="searchInfo"></Input>
<!--     <Button type="primary" @click="allCode" style="float: right;margin-right:10px" >验证码总览</Button>-->
<!--      </Col>-->
    </Row>
    <Row class="maintable">
      <Table :loading='loadingData' border :columns="accountColumns" :data="accountDatas" @on-select="tableSelectCurrent" @on-select-all='tableSelectAll' @on-select-cancel="tableCancelCurrent" @on-selection-change="tableChange" highlight-row >
      </Table>
    </Row>
    <Row class="tr pt5 pb10">
      <Page :total="tp" :current='cp' :page-size="ep" size="small" show-total show-sizer show-elevator :page-size-opts='[10,20,30]' @on-change="currentPageChange" @on-page-size-change="eachPageChange"></Page>
    </Row>
    <!-- 验证码总览modal -->
    <Modal v-model="allCodeModal" :mask-closable="false" width="800">
      <p slot="header" style="text-align:center;color:#333;">机构包</p>
<!--          <Orgpackage :detailsbag='detailsbag'></Orgpackage>-->
      <div slot="footer">
      </div>
    </Modal>
    <!-- 新增机构modal -->
    <Modal v-model="addNewAcademyModel" :mask-closable="false" width="600" title="新增机构"  @on-cancel="handleReset('addNewAcademyForm')">
       <p slot="header" style="text-align:center;color:#333;">新增机构</p>

      <div class="editAcademy-model-body">
        <Form ref="addNewAcademyForm" :model="addNewAcademyDatas" :rules="addNewAcademyRules" :label-width="140" >
          <FormItem label="机构名称" prop="title">
            <Input v-model="addNewAcademyDatas.title" placeholder="请输入机构名称"></Input>
          </FormItem>
          <FormItem label="机构类型" prop="type">
          <Select v-model="addNewAcademyDatas.type" >
                <Option value="1">学校</Option>
                <Option value="2">企业</Option>
                <Option value="3">事业单位</Option>
                <Option value="4">研究机构</Option>
          </Select>
          </FormItem>
          <FormItem label="联系人" prop='contactPerson'>
            <Input v-model="addNewAcademyDatas.contactPerson" placeholder="请输入机构联系人"></Input>
          </FormItem>
          <FormItem label="联系电话" prop='mobileNumber'>
            <Input v-model="addNewAcademyDatas.mobileNumber" placeholder="请输入机构联系人电话"></Input>
          </FormItem>
          <FormItem label="邮箱" prop='email'>
            <Input v-model="addNewAcademyDatas.email" placeholder="请输入机构邮箱"></Input>
          </FormItem>
          <FormItem label="传真号" prop='fax'>
            <Input v-model="addNewAcademyDatas.fax" placeholder="请输入机构传真号"></Input>
          </FormItem>
          <FormItem label="所在省份" prop='province'>
            <Select v-model="addNewAcademyDatas.province" clearable style="width:200px">
              <Option v-for="item in regionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="详细地址" prop='address'>
            <Input v-model="addNewAcademyDatas.address" placeholder="请输入机构详细地址"></Input>
          </FormItem>
          <FormItem label="网址" prop='website'>
            <Input v-model="addNewAcademyDatas.website" placeholder="请输入机构网址,如 http://www.baidu.com"></Input>
          </FormItem>
<!--           <FormItem label="管理员账号" prop='manageraccount'>
            <Input v-model="addNewAcademyDatas.manageraccount" placeholder="请输入管理员账号"></Input>
          </FormItem>

          <FormItem label="管理员账号密码" prop='managerpassword'>
            <Input v-model="addNewAcademyDatas.managerpassword" type="password" placeholder="请输入管理员账号"></Input>
          </FormItem>       -->
            </Form>
      </div>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="submitAddNewAcademy('addNewAcademyForm')">新增</Button>
        <Button type="ghost" @click="handleReset('addNewAcademyForm')">取消</Button>
      </div>
    </Modal>
    <!-- 修改机构modal -->
    <Modal v-model="editAcademyModel" :mask-closable="false" width="600" title="修改机构">
       <p slot="header" style="text-align:center;color:#333;">修改机构</p>

      <div class="editAcademy-model-body">
        <Form ref="editNewAcademyForm" :model="editAcademyDatas" :label-width="120" :rules="addNewAcademyRules">
          <FormItem label="机构名称" prop="title">
            <Input v-model="editAcademyDatas.title" placeholder="请输入机构名称"></Input>
          </FormItem>
          <FormItem label="机构类型" prop="type">
          <Select v-model="editAcademyDatas.type" >
                 <Option v-for="item in classType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          </FormItem>
          <FormItem label="联系人" prop='contactPerson'>
            <Input v-model="editAcademyDatas.contactPerson" placeholder="请输入机构联系人"></Input>
          </FormItem>
          <FormItem label="联系电话" prop='mobileNumber'>
            <Input v-model="editAcademyDatas.mobileNumber" placeholder="请输入机构联系人电话"></Input>
          </FormItem>
          <FormItem label="邮箱" prop='email'>
            <Input v-model="editAcademyDatas.email" placeholder="请输入机构邮箱"></Input>
          </FormItem>
          <FormItem label="传真号" prop='fax'>
            <Input v-model="editAcademyDatas.fax" placeholder="请输入机构传真号"></Input>
          </FormItem>
          <FormItem label="所在省份" prop='province'>
            <Select v-model="editAcademyDatas.province" clearable style="width:200px">
              <Option v-for="item in regionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="详细地址" prop='address'>
            <Input v-model="editAcademyDatas.address" placeholder="请输入机构详细地址"></Input>
          </FormItem>
          <FormItem label="网址" prop='website'>
            <Input v-model="editAcademyDatas.website" placeholder="请输入机构网址,如 http://www.baidu.com"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="submitEditAcademy('editNewAcademyForm')">修改</Button>
        <Button type="ghost" @click="editAcademyModel=false">取消</Button>
      </div>
    </Modal>
<!--        机构权限控制-->
        <Modal v-model="controlState" :mask-closable="false" width="500">
            <p slot="header" style="text-align:center;color:#333;">机构权限控制</p>
             <div class="editAcademy-model-body">
            <Form ref="addJurisdiction" :model="addNewAcademyDatas" :label-width="140" :rules="addNewAcademyRules">
          <FormItem label="验证码控制" prop='CheckCode'>
                <Input v-model='validateCodeCount' placeholder="请输入数值"></Input>
            </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="submitAddNewcontrol('addJurisdiction')">确定</Button>
        <Button type="ghost" @click="controlState=false">取消</Button>
      </div>
    </Modal>
        
        <Modal v-model="detailsModal" :mask-closable="false" width="800">
           <p slot="header" style="text-align:center;color:#333;">机构码详情</p>
<!--
           <Table border :columns="codeDetailsColumns" :data="ValidateCodeListdate"></Table>
           <Row>
           <Page 
               :total="detailstp" 
               :current='detailscp' 
               :page-size="detailsep" 
               size="small" 
               show-total show-sizer  
               :page-size-opts='[10,20,30]' 
               @on-change="detailsPageChange" 
               @on-page-size-change="detailsPagesizeChange"></Page>
               </Row>
-->
         <Orgdetails :orgid='detailsOrganizationid' :orgzt='detailsOrganizationzt'></Orgdetails>
          <div slot="footer">
          </div>
    </Modal>
        
        
  </div>
</template>
<script>
    import Orgdetails from "./Orgdetails.vue"
    import Orgpackage from "./Orgpackage.vue"
    export default {
        components: {
            'Orgdetails': Orgdetails,
            'Orgpackage': Orgpackage,
        },
        data() {
            const filters = window.sessionStorage.getItem('bg_user_filter');

            //验证机构码，也用作验证是否是数字 CheckCode
            const CheckCode = (rule, value, callback) => {
                let reg = /\D/g;
                if (reg.test(value)) {
                    callback(new Error('只能输入数字'))
                } else {
                    callback();
                }
            };
            //验证机构名
            const CheckTitle = (rule, value, callback) => {
                if (value.length > 50) {
                    callback(new Error('超出50个字符'));
                    return;
                }
                let reg = /[^a-zA-Z0-9_\u4e00-\u9fa5]/g;
                if (reg.test(value)) {
                    callback(new Error('不能存在特殊字符'))
                } else {
                    callback();
                }
            };
            const CheckPhone = (rule, value, callback) => {
                let reg = /^1\d{10}$/g;
                if (!reg.test(value)) {
                    callback(new Error('请输入正确的手机号'))
                } else {
                    callback();
                }
            };
            const CheckWebsite = (rule, value, callback) => {
                let reg = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/g;

                if (!reg.test(value) && value !== '') {
                    callback(new Error('请输入正确的网址'))
                } else {
                    callback();
                }
            };
            //验证网址
            const CheckName = (rule, value, callback) => {
                let reg = /^[\u4E00-\u9FA5]{1,10}$/;
                if (!reg.test(value)) {
                    callback(new Error('只能为中文'))
                } else {
                    callback();
                }
            };
            const CheckDepartment = (rule, value, callback) => {
                let reg = /^[\u4E00-\u9FA5]{1,10}$/;
                if (!reg.test(value)) {
                    callback(new Error('只能为中文'))
                } else {
                    callback();
                }
            };
            const CheckSeller = (rule, value, callback) => {
                let reg = /^[\u4E00-\u9FA5]{2,4}(?:·[\u4E00-\u9FA5]{2,5})*$/;
                if (!reg.test(value)) {
                    callback(new Error('输入销售者真实姓名'))
                } else {
                    callback();
                }
            };
            const CheckIp = (rule, value, callback) => {
                let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if (!reg.test(value)) {
                    callback(new Error('输入正确IP地址'))
                } else {
                    callback();
                }
            };
            const CheckUserNum = (rule, value, callback) => {
                let reg = /^[0-9]*$/
                if (!reg.test(value)) {
                    callback(new Error('只能为数字'))
                } else {
                    callback();
                }
            };
            return {
                //包id
                detailsbag:'',
                dataCode: {
                    ValidataCountList: []
                },
                allCodeModal: false, //验证码总览模态框
                controlState: false,
                detailsModal: false,
                regionList: [
                    {
                        value: '北京',
                        label: '北京'
                    },
                    {
                        value: '天津',
                        label: '天津'
                    },
                    {
                        value: '河北',
                        label: '河北'
                    },
                    {
                        value: '山西',
                        label: '山西'
                    },
                    {
                        value: '内蒙古',
                        label: '内蒙古'
                    },
                    {
                        value: '辽宁',
                        label: '辽宁'
                    },
                    {
                        value: '吉林',
                        label: '吉林'
                    },
                    {
                        value: '黑龙江',
                        label: '黑龙江'
                    },
                    {
                        value: '上海',
                        label: '上海'
                    },
                    {
                        value: '江苏',
                        label: '江苏'
                    }, {
                        value: '浙江',
                        label: '浙江'
                    },
                    {
                        value: '安徽',
                        label: '安徽'
                    },
                    {
                        value: '福建',
                        label: '福建'
                    },
                    {
                        value: '江西',
                        label: '江西'
                    },
                    {
                        value: '山东',
                        label: '山东'
                    },
                    {
                        value: '河南',
                        label: '河南'
                    },
                    {
                        value: '湖北',
                        label: '湖北'
                    },
                    {
                        value: '湖南',
                        label: '湖南'
                    },
                    {
                        value: '广东',
                        label: '广东'
                    },
                    {
                        value: '广西',
                        label: '广西'
                    },
                    {
                        value: '海南',
                        label: '海南'
                    },
                    {
                        value: '重庆',
                        label: '重庆'
                    },
                    {
                        value: '四川',
                        label: '四川'
                    },
                    {
                        value: '贵州',
                        label: '贵州'
                    },
                    {
                        value: '云南',
                        label: '云南'
                    },
                    {
                        value: '西藏',
                        label: '西藏'
                    },
                    {
                        value: '陕西',
                        label: '陕西'
                    },
                    {
                        value: '甘肃',
                        label: '甘肃'
                    },
                    {
                        value: '青海',
                        label: '青海'
                    },
                    {
                        value: '宁夏',
                        label: '宁夏'
                    },
                    {
                        value: '新疆',
                        label: '新疆'
                    },
                    {
                        value: '香港',
                        label: '香港'
                    },
                    {
                        value: '澳门',
                        label: '澳门'
                    },
                    {
                        value: '台湾',
                        label: '台湾'
                    }

                ],
                
                filter: {
                    region: filters != null && filters != '' && JSON.parse(filters) != {} && JSON.parse(filters).region ? JSON.parse(filters).region : '0',
                    searchKey: filters != null && filters != '' && JSON.parse(filters) != {} && JSON.parse(filters).searchKey ? JSON.parse(filters).searchKey : '',
                },

                addNewAcademyModel: false,
                editAcademyModel: false,
                detailsOrganizationzt: false,
                
                validateCodeCount: '',
                tp: 0,
                cp: 1,
                ep: 20,
                //机构的机构码详情页数
//                detailstp: 0,
//                detailscp: 1,
//                detailsep: 10,

                loadingData: false,
                classType: [{
                    value: 1,
                    label: '学校'
                }, {
                    value: 2,
                    label: '企业'
                }, {
                    value: 3,
                    label: '事业单位'
                }, {
                    value: 4,
                    label: '研究机构'
                }, ],

                //每个机构的验证码
                detailsOrganizationid: '',


                accountColumns: [{
                    title: '编号',
                    key: 'Id',
                    ellipsis: true,
                    width: 100
                }, {
                    title: '机构名称',
                    key: 'Title',
                   render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.Title ? params.row.Title: "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Title)
                            ])
                        }
                }, {
                    title: '联系人',
                    key: 'ContactPerson',
                    render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.ContactPerson ? params.row.ContactPerson: "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.ContactPerson)
                            ])
                        }
                }, {
                    title: '手机号',
                    key: 'MobileNumber',
                     render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.MobileNumber ? params.row.MobileNumber: "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.MobileNumber)
                            ])
                        }
                }, {
                    title: '邮箱',
                    render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.Email ? params.row.Email: "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Email)
                            ])
                        }
                }, {
                    title: '传真号码',
                    render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.Fax ? params.row.Fax: "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Fax)
                            ])
                        }
                }, {
                    title: '省份',
                   
                      render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.Province ? params.row.Province: "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.Province)
                            ])
                        }
                }, {
                    title: '类型',
                    width:100,
                    render: (h, params) => {
                        return h('div', [
                            h("span", params.row.Type ? this.classTitle(params.row.Type) : "-")
                        ])
                    }
                }, {
                    title: '验证码数量',
                    width1:100,
                      render: (h, params) => {
                            return h('div', [
                                h("Tooltip", {
                                    props: {
                                        trigger: "hover",
                                        content: params.row.ValidateCodeCount ? params.row.ValidateCodeCount: "-",
                                        placement: "top-start"
                                    },
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }, params.row.ValidateCodeCount ? params.row.ValidateCodeCount : "0")
                            ])
                        }
                }, {
                    title: '创建时间',
                    ellipsis: true,
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
                }, {
                    title: '操作',
                    key: 'action',
                    width: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.control(params.row)
                                    }
                                }
                            }, '生成验证码'),
                            h('Dropdown', {
                                props: {
                                    trigger: "click",
                                },

                                on: {
                                    "on-click": (name) => {
                                        if (name == "update") {
                                            this.editAcademy(params.row, params.index)
                                        } else if (name == "del") {
                                            this.deleteAcademy(params.row, params.index)
                                        } else if (name == "detailsModal") {
//                                            
                                            this.detailsOrganizationid = params.row.Id
                                             this.detailsOrganizationzt=!this.detailsOrganizationzt
                                            this.detailsOrganization()
                                        } else if (name == "bag") {
                                            //机构包详情
                                            this.detailsbag = params.row.Id
                                            this.allCode(params.row.Id)
                                        }
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
                                    h('DropdownItem', {
                                        props: {
                                            name: 'bag'
                                        }
                                    }, '机构包详情'),
                                    h('DropdownItem', {
                                        props: {
                                            name: 'detailsModal'
                                        }
                                    }, '机构码详情'),
                                    h('DropdownItem', {
                                        props: {
                                            name: 'update'
                                        }
                                    }, '修改机构信息'),
                                    h('DropdownItem', {
                                        props: {
                                            name: 'del'
                                        }
                                    }, '删除机构信息')
                                ])
                            ])
                        ]);
                    }
                }],

                //表格数据
                accountDatas: [],
                keyWord: "",
                oldkeyWord: "",
                selectItem: [],
                selectOrganization: {
                    ExtendData: {
                        ContentCountName: 0
                    }
                },
                //新增机构数据
                addNewAcademyDatas: {
                    title: '',
                    contactPerson: '',
                    mobileNumber: '',
                    email: '',
                    fax: '',
                    telephone: '',
                    province: '',
                    address: '',
                    type: '2',
                    website: '',
                    role: '',
                    state: '1',
                    manageraccount: '',
                    managerpassword: '',
                    remark: '',
                    ips: [{
                        startIp: '',
                        endIp: '',
                    }],
                    ipRange: ''
                },

                //修改机构数据
                editAcademyDatas: {},

                //验证规则
                addNewAcademyRules: {
                    title: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'blur'
                    }, {
                        validator: CheckTitle,
                        trigger: 'blur'
                    }],
                    contactPerson: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'blur'
                    }],
                    mobileNumber: [{
                        required: true,
                        message: '请输入联系人手机号',
                        trigger: 'blur'
                    }, {
                        validator: CheckPhone,
                        trigger: 'blur'
                    }],
                    address: [{
                        required: true,
                        message: '请输入地址',
                        trigger: 'blur'
                    }],
                    email: [{
                        required: true,
                        type: 'email',
                        message: '请输入正确的邮箱格式',
                        trigger: 'blur'
                    }],
                    telephone: [{
                        validator: CheckCode,
                        trigger: 'blur'
                    }],

                    fax: [{
                        validator: CheckCode,
                        trigger: 'blur'
                    }],

                    province: [{
                        required: true,
                        message: '请选择机构所在省份',
                        trigger: 'change'
                    }],

                    website: [{
                        validator: CheckWebsite,
                        trigger: 'blur'
                    }],

                    role: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'blur'
                    }, {
                        validator: CheckUserNum,
                        trigger: 'blur'
                    }],

                    manageraccount: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'blur'
                    }, {
                        validator: CheckUserNum,
                        trigger: 'blur'
                    }],

                    managerpassword: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'blur'
                    }, {
                        validator: CheckUserNum,
                        trigger: 'blur'
                    }]
                },
                ipCheckRules: [{
                    required: true,
                    message: '该项不能为空',
                    trigger: 'blur'
                }, {
                    validator: CheckIp,
                    trigger: 'blur'
                }]
            }
        },
        methods: {
            /**
             * [detailsOrganization 机构详情]
             * @Author   刘启瑞
             * @DateTime 2017-11-30
             * @param    {[type]}   id [description]
             * @return   {[type]}      [description]
             */
            detailsOrganization() {
                this.detailsModal = true;

            },
            //验证码总览
            allCode(id) {
//                this.allCodeModal = true
                this.$router.push({
                    path: "/wrap/userMain/Orgpackage",
                    query: {
                        knowledgeId: id,
                    }
                })
            },
            //取消重置
            handleReset(name) {
                this.addNewAcademyModel = false
                this.addNewAcademyDatas = {
                    title: '',
                    contactPerson: '',
                    mobileNumber: '',
                    email: '',
                    fax: '',
                    telephone: '',
                    province: '',
                    address: '',
                    type: '2',
                    website: '',
                    role: '',
                    state: '1',
                    manageraccount: '',
                    managerpassword: '',
                    remark: '',
                    ips: [{
                        startIp: '',
                        endIp: '',
                    }],
                    ipRange: ''
                }
            },
            //获取机构列表
            getListData(type) {
                this.loadingData = true
                this.$http.get(this.ApiTransfer('/Organization/List'), {
                    params: this.ApiTransfer('/Organization/List', {
                        keyword: this.oldkeyWord.trim(),
                        ps: this.ep,
                        cp: this.cp
                    })
                }).then((res) => {
                    this.accountDatas = res.data.Data.ItemList;
                    this.tp = parseInt(res.data.Data.RecordCount)
                    this.loadingData = false;
                })
            },
            //获取机构列表
            searchInfo(type) {
                if (type == 1 || this.oldkeyWord != this.keyWord || this.keyWord) {
                    this.oldkeyWord = this.keyWord
                    this.cp = 1
                    this.loadingData = true
                    this.$http.get(this.ApiTransfer('/Organization/List'), {
                        params: this.ApiTransfer('/Organization/List', {
                            keyword: this.keyWord.trim(),
                            ps: this.ep,
                            cp: this.cp
                        })
                    }).then((res) => {
                        this.oldkeyWord = this.keyWord
                        this.accountDatas = res.data.Data.ItemList;
                        this.tp = parseInt(res.data.Data.RecordCount)
                        this.loadingData = false;
                    })
                } else {
                    this.$Message.warning('请输入机构名称');
                }
            },
            //分页
            currentPageChange(value) {
                this.cp = value;
                this.updateFilter({
                    'cp': this.cp
                });
                this.getListData(1);
            },

            eachPageChange(value) {
                this.ep = value;
                this.updateFilter({
                    'ep': this.ep
                });
                this.getListData(1);
            },
//            //机构验证码分页
//            detailsPageChange(value) {
//                this.detailscp = value;
//                this.detailsOrganization(1);
//            },
//
//            detailsPagesizeChange(value) {
//                this.detailsep = value;
//                this.detailsOrganization(1);
//            },

            //新建机构
            addNewAcademy() {
                this.addNewAcademyModel = true;
            },

            //    [submitAddNewAcademy 新增机构]
            submitAddNewAcademy(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addNewAcademyDatas = this.dealFormData(this.addNewAcademyDatas);
                        this.$http.post(this.ApiTransfer('/Organization/Create'),
                            this.ApiTransfer('/Organization/Create', this.addNewAcademyDatas)).then((res) => {
                            if (res.data.Success) {
                                this.addNewAcademyModel = false;
                                this.$refs[formName].resetFields();
                                this.$Message.success('新增成功');
                                this.getListData(1);
                            } else {
                                console.log(res.data);
                            }
                        })
                    } else {

                    }
                })
            },
            //    [机构权限控制]
            submitAddNewcontrol(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post(this.ApiTransfer('/ValidateCode/AddValidateCode'), this.ApiTransfer('/ValidateCode/AddValidateCode', {
                            organizationId:this.changeid,
                            //                            ipRange: JSON.stringify(this.addNewAcademyDatas.ips),
                            activatedAmount: this.validateCodeCount
                        })).then((res) => {
                            if (res.data.Success) {
                                 this.changeid='';
                                this.validateCodeCount=''
                                this.controlState = false;
                                this.$refs[formName].resetFields();
                                this.$Message.success('成功');
                                this.getListData(1);
                            } else {
                                this.$refs[formName].resetFields();
                            }
                        })
                    } else {

                    }
                })
            },
            //处理ip段
            disposeIp(data) {
                if (data) {
                    return JSON.parse(data)
                }
            },
            //机构类型转义
            classTitle(data) {
                switch (data) {
                    case 1:
                        return '学校'
                        break;
                    case 2:
                        return '企业'
                        break;
                    case 3:
                        return '事业单位'
                        break;
                    case 4:
                        return '研究机构'
                        break;
                    default:
                        break;
                }
            },
            //机构权限控制窗口
            control(data) {
                //                console.log(data.IpRange)
                if (!!data.IpRange) {
                    this.addNewAcademyDatas.ips = JSON.parse(data.IpRange)
                } else {
                    this.addNewAcademyDatas.ips = [{
                        "startIp": '',
                        "endIp": ""
                    }]
                }
                this.validateCodeCount = data.ValidateCodeCount
                this.changeid = data.Id
                this.controlState = true
            },
            /**
             * [dealFormData 处理新增或修改的表单数据，符合接口需要]
             * @Author   罗文
             * @DateTime 2017-10-18
             * @param    {[Object]}   data [要验证的表单数据]
             * @return   {[Object]}   [处理过的数据]
             */
            dealFormData(data) {
                //处理机构类型

                //                if (data.ips.length !== 0) {
                //                    let arr = [];
                //                    data.ips.forEach((item, index) => {
                //                        let str = '';
                //                        str = item.startIp + '-' + item.endIp;
                //                        arr.push(str);
                //                    });
                //
                //                    data.ipRange = arr.join(';');
                //                }

                return data;

            },

            /**
             * [reDealFormData 在修改数据时，将数据处理成表单展示]
             * @Author   罗文
             * @DateTime 2017-10-18
             * @param    {[Object]}   data [要修改的这一行的数据]
             * @return   {[Object]}        [修改后的数据]
             */
            reDealFormData(data) {
                //                switch (data.Type) {
                //                    case 1:
                //                        data.Type = '学校';
                //                        break;
                //                    case 2:
                //                        data.Type = '企业';
                //                        break;
                //                    case 3:
                //                        data.Type = '事业单位';
                //                        break;
                //                    case 4:
                //                        data.Type = '研究机构';
                //                        break;
                //                    default:
                //                        break;
                //                }

                //处理ip段
                //                if (data.IpRange) {
                ////                    console.log(data.IpRange)
                ////                    data.Ips =JSON.parse(data.IpRange);
                //                    let arr = [];
                //                    if (data.IpRange.indexOf(';') !== -1) {
                //                        arr = data.IpRange.split(';');
                //                    } else {
                //                        arr.push(data.IpRange);
                //                    }
                //
                //                    arr.forEach((item, index) => {
                //                        let temArr = [];
                //                        let obj = {};
                //                        temArr = item.split('-');
                //                        obj.startIp = temArr[0];
                //                        obj.endIp = temArr[1];
                //
                //                        data.Ips.push(obj);
                //                    })
                //                }

                let newObj = {};

                for (let k in data) {
                    let str = k;
                    let tmpArr = [];
                    tmpArr = str.split('');
                    tmpArr[0] = tmpArr[0].toLowerCase();
                    newObj[tmpArr.join('')] = data[k];
                }
                return newObj;
            },

            //新增IP段
            addNewIp(type) {
                switch (type) {
                    case 'add':
                        this.addNewAcademyDatas.ips.push({
                            startIp: '',
                            endIp: ''
                        })
                        break;
                    case 'edit':
                        this.editAcademyDatas.ips.push({
                            startIp: '',
                            endIp: ''
                        })
                        break;
                    default:
                        break;
                }

            },

            //编辑
            editAcademy(row, index) {
                this.editAcademyDatas = this.reDealFormData(row);
                this.editAcademyModel = true;
            },

            //确认修改
            submitEditAcademy(formName) {
                //                console.log(this.editAcademyDatas)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editAcademyDatas = this.dealFormData(this.editAcademyDatas);
                        this.$http.post(this.ApiTransfer('/Organization/Update'), this.ApiTransfer('/Organization/Update', this.editAcademyDatas)).then((res) => {
                            if (res.data.Success) {
                                this.editAcademyModel = false;
                                this.$refs[formName].resetFields();
                                this.$Message.success('修改成功!');
                                this.getListData(1);
                            } else {
                                this.$Message.error(res.data.Description);
                            }
                        })
                    }
                })
            },



            //表格单选/单选
            tableSelectCurrent(selection) {
                this.selectItem = selection;
            },
            tableSelectAll(selection) {
                this.selectItem = selection;
            },
            tableCancelCurrent(selection, row) {
                this.selectItem = selection;
            },
            tableChange(selection) {
                this.selectItem = selection;
            },


            //删除机构
            deleteAcademy(row, index) {
                setTimeout(() => {
                    //手动改变弹出框的位置
                    let confirm = document.querySelector('.ivu-modal-confirm').parentNode.parentNode.parentNode;
                    confirm.style.top = '50%';
                    confirm.style.marginTop = '-100px';
                }, 0)

                this.$Modal.confirm({
                    title: '操作提示',
                    content: '<h3>该操作将删除机构，请确认操作？</h3>',
                    onOk: () => {
                        this.$http.post(this.ApiTransfer('/Organization/Delete'), this.ApiTransfer('/Organization/Delete', {
                            ids: row.Id
                        })).then((res) => {
                            if (res.data.Code == 200) {
                                this.$Message.success('删除操作成功');
                                this.getListData(1);
                            } else if (res.data.Code == 22) {
                                this.$Message.success(res.data.Description);
                            }
                        })
                    },
                });
            },

            //批量删除机构
            deleteAcademyByBatches() {
                if (this.selectItem.length) {
                    let selectedAcademyId = [];
                    this.selectItem.forEach((item, index) => {
                        selectedAcademyId.push(item.Id);
                    });

                    this.$Modal.confirm({
                        title: '操作提示',
                        content: '<h3>该操作将批量删除机构，请确认操作？</h3>',
                        onOk: () => {
                            this.$http.post(this.ApiTransfer('/Organization/Delete'),
                                this.ApiTransfer('/Organization/Delete', {
                                    ids: selectedAcademyId.join(',')
                                })).then((res) => {
                                if (res.data.Code == 200) {
                                    this.$Message.success('批量删除操作成功');
                                    this.getListData(1);
                                }
                            })
                        },
                    });
                } else {
                    this.$Message.warning('请至少勾选一个机构后再试！')
                }
            },

            //删除单行IP段
            deleteNowIps(index) {
                if (this.addNewAcademyDatas.ips.length == 1) {
                    this.addNewAcademyDatas.ips.splice(index, 1);
                    this.addNewAcademyDatas.ips.push({
                        startIp: '',
                        endIp: '',
                    })
                } else {
                    this.addNewAcademyDatas.ips.splice(index, 1)
                }
            },
            deleteEditNowIps(index) {
                if (this.editAcademyDatas.ips.length == 1) {
                    this.editAcademyDatas.ips.splice(index, 1);
                    this.editAcademyDatas.ips.push({
                        startIp: '',
                        endIp: '',
                    })
                } else {
                    this.editAcademyDatas.ips.splice(index, 1)
                }
            },

            deleteNowEditIps(index) {
                if (this.editAcademyDatas.ips.length == 1) {
                    this.editAcademyDatas.ips.splice(index, 1);
                    this.editAcademyDatas.ips.push({
                        startIp: '',
                        endIp: '',
                    })
                } else {
                    this.editAcademyDatas.ips.splice(index, 1)
                }
            },
        },
        beforeRouteLeave(to, from, next) {
            window.sessionStorage.setItem('bg_user_filter', '')
            next();
        },
        created() {
            this.getListData(1);
        },
        watch: {
            'filter.searchKey': function(val, oldVal) {
                if (!val && oldVal) {
                    this.cp = 1;
                    this.updateFilter({
                        'searchKey': ''
                    })
                    this.getListData(1);
                }
            },
            'addNewAcademyModel': function(val, oldVal) {
                if (!val && oldVal) {
                    this.$refs.addNewAcademyForm.resetFields();
                    this.addNewAcademyDatas.ips = [{
                        startIp: '',
                        endIp: '',
                    }]
                };
            },
            'editAcademyModel': function(val, oldVal) {
                if (!val && oldVal) {
                    this.$refs.editNewAcademyForm.resetFields();

                }
            }
        },

    }

</script>
<style lang="less">
    .system-title {
        margin-bottom: 30px
    }

    .academy-main {
        /* min-width: 1575px; */
    }

    .edit-ip-row {
        margin-bottom: 2px;
    }

    .all-code-modal {
        p {
            text-align: center
        }
        .title {
            border: 1px solid #ccc;
            padding: 6px;
            margin-bottom: 15px
        }
    }

    .editAcademy-model-body {
        width: 90%;
        .ivu-date-picker {
            width: 100%;
        }
    }

</style>
