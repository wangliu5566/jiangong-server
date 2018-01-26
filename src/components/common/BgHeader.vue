<template>
  <div class="bg-common-header">
    <Row>
      <Col span="12" class="ovh">
      <div class="title">
        <div class="title-logo" @click="goIndex">
        </div>
        <Poptip trigger="hover"placement="right" class="side-menu-btn">
          <div slot="content">
            点击展开/收起菜单栏
          </div>
          <Icon type="navicon-round" size="40" style="margin-left: 10px;cursor:pointer;" @click.native.stop="toggleSideMenu"></Icon>
        </Poptip>
      </div>
      </Col>
      <Col span="12" class="tr">
      <ul class="header-list">
        <li class="other" @click="exitSystem">
          <span>[ 退出 ]</span>
        </li>
        <li>
          <span>您好：</span>
          <Dropdown @on-click="changeItem">
            <a href="javascript:void(0)" style="color:#fff;clear: both;">  
              <span>{{systemUsername}}</span>
              <Icon type="arrow-down-b"></Icon>
            </a>
            <Dropdown-menu slot="list">
              <!-- <Dropdown-item name="1">编辑资料</Dropdown-item> -->
              <Dropdown-item name="2">修改密码</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
        </li>
      </ul>
      </Col>
    </Row>
    <!-- 修改资料
    <!-- <Modal v-model="editInfoModal" :mask-closable="false" width="600" title="修改资料">
      <div class="exam-model-body">
        <div class="edit-info-main">
          <Form :model="infoFormDatas" :label-width="80" ref="editUserInfoForm" :rules="editUserInfoFormRules">
            <Form-item label="用户名" prop="username">
              <Input v-model="infoFormDatas.username" placeholder="请输入用户名"></Input>
            </Form-item>
            <Form-item label="性别" prop="haha">
              <Radio-group v-model="infoFormDatas.gender">
                <Radio label="1">男</Radio>
                <Radio label="2">女</Radio>
                <Radio label="3">保密</Radio>
              </Radio-group>
            </Form-item>
            <Form-item label="年龄" prop="haha">
              <Input v-model="infoFormDatas.age" placeholder="请输入年龄"></Input>
            </Form-item>
            <Form-item label="职业" prop="haha">
              <Input v-model="infoFormDatas.profession" placeholder="请输入职业"></Input>
            </Form-item>
          </Form>
        </div>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="editInfoModal=false" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="handleEditInfo('editUserInfoForm')">确认修改</Button>
      </div>
    </Modal> -->
    <!-- 修改密码 -->
    <Modal v-model="editPsdModal" :mask-closable="false" width="600" title="修改密码">
      <div class="exam-model-body">
        <div class="edit-info-main">
          <Form :model="psdFormDatas" :label-width="80" ref="editUserPsdForm" :rules="editUserPsdFormRules">
            <Form-item label="旧密码" prop="oldpass">
              <Input type="password" v-model="psdFormDatas.oldpass" placeholder="请输入旧密码"></Input>
            </Form-item>
            <Form-item label="新密码" prop="password">
              <Input type="password" v-model="psdFormDatas.password" placeholder="请输入6-32位的新密码,可以包含A-Z,a-z,0-9和特殊字符"></Input>
            </Form-item>
            <Form-item label="确认密码" prop="repass" required>
              <Input type="password" v-model="psdFormDatas.repass" placeholder="请再次输入新密码"></Input>
            </Form-item>
          </Form>
        </div>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="editPsdModal=false" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="handleEditPsd('editUserPsdForm')">确认修改</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import sha1 from 'crypto-js/sha1';
export default {
  data() {
    const chechPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.psdFormDatas.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    const verifyPassword = (rule, value, callback) => {
      // this.$http.post(this.ApiTransfer('/Passport/Login'),this.ApiTransfer('/Passport/Login',{
      //   account: JSON.parse(window.sessionStorage.getItem('bg_user_info')).NickName,
      //   password: this.psdFormDatas.oldpass
      // })).then((res) => {
      //   if (res.data.Success) {
      callback();
      //   } else {
      //     callback(new Error('密码错误'));
      //   }
      // })
    };
    const validatePass = (rule, value, callback) => {
      var reg = /^[^\u4e00-\u9fa5]{0,}$/
      if (value == '') {
        callback(new Error('请输入6-32位的密码,可以包含A-Z,a-z,0-9和特殊字符'));
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

    return {
      editInfoModal: false,
      editPsdModal: false,

      systemUsername: JSON.parse(window.sessionStorage.getItem('bg_user_info')).NickName ? JSON.parse(window.sessionStorage.getItem('bg_user_info')).NickName : JSON.parse(window.sessionStorage.getItem('bg_user_info')).MobileNumber ? JSON.parse(window.sessionStorage.getItem('bg_user_info')).MobileNumber : JSON.parse(window.sessionStorage.getItem('bg_user_info')).Email,

      isFullScreen: false,

      //修改资料
      infoFormDatas: {
        username: '',
        gender: '1',
        age: '',
        profession: '',
      },
      //修改密码
      psdFormDatas: {
        oldpass: '',
        password: '',
        repass: '',
        userId: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id
      },

      //修改资料验证规则
      editUserInfoFormRules: {
        username: [{
          required: true,
          message: '用户名不能为空',
          trigger: 'blur',
        }]
      },

      //修改密码验证规则
      editUserPsdFormRules: {
        oldpass: [{
          required: true,
          validator: verifyPassword,
          trigger: 'blur',
        }],
        password: [{
          required: true,
          validator: validatePass,
          trigger: 'blur',
        }],
        repass: [{
          validator: chechPassword,
          trigger: 'blur',
        }]
      }
    }
  },
  methods: {
    toggleSideMenu(){
      this.$emit('toggleHide','set')
    },
    //点击logo
    goIndex() {
      if (this.$route.fullPath.indexOf('/wrap') != -1) {
        this.$router.push('/wrap');
      } else {
        this.$router.push('/system');
      }

    },

    //开启/退出浏览器全屏
    toggleFullScreen() {
      if (this.isFullscreenEnabled() == true) {
        if (!document.fullscreenElement &&
          !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
          this.isFullScreen = true;
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
          } else if (document.documentElement.oRequestFullscreen) {
            document.documentElement.oRequestFullscreen();
          }
        } else {
          this.isFullScreen = false;
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.oRequestFullscreen) {
            document.oCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      } else {
        this.$Message.error('您的浏览器不支持该功能')
      }
    },

    quitFullScreen() {
      this.isFullScreen = false;
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.oRequestFullscreen) {
        document.oCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },

    isFullscreenEnabled() {
      return document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled || false;
    },

    //顶部下拉菜单
    changeItem(name) {
      switch (parseInt(name)) {
        case 1:
          this.editInfoModal = true;
          break;
        case 2:
          this.editPsdModal = true;
          break;
        default:
          break;
      }
    },

    // //确认修改资料
    // handleEditInfo(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       this.$Message.success('提交成功!');
    //     } else {
    //       return false;
    //     }
    //   })
    // },

    //确认修改密码
    handleEditPsd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer('/Passport/UpdatePassword'), this.ApiTransfer('/Passport/UpdatePassword', {
            account: JSON.parse(window.sessionStorage.getItem('bg_user_info')).NickName,
            oldPassword: this.psdFormDatas.oldpass,
            password: this.psdFormDatas.password,
            type: 3 //2-忘记密码3-修改密码
          })).then((res) => {
            if (res.data.Success) {
              this.editPsdModal = false;
              this.$Message.success({
                content: '密码修改成功',
                duration: 3
              })
            } else if (res.data.status == 1005) {
              this.$Message.error({
                content: res.data.message,
                duration: 3
              });
              this.psdFormDatas.oldpass = '';
            }
          })
        } else {
          return false;
        }
      })
    },

    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    //退出系统
    exitSystem() {
      this.$Modal.confirm({
        title: '操作确认',
        content: '<h3>此操作将退出系统，确认是否退出？</h3>',
        onOk: () => {
          this.$http.post(this.ApiTransfer("/Passport/Logout"), this.ApiTransfer("/Passport/Logout", {}))
            .then((res) => {
              if (res.data.Success) {
                this.$router.push('/login');
                this.quitFullScreen();
              }
            })
        }
      });
    }
  },
  watch: {
    'editInfoModal': function(val, oldValue) {
      if (!val) {
        this.infoFormDatas = {
          username: '',
          gender: '1',
          age: '',
          profession: '',
        }
      }
    },
    'editPsdModal': function(val, oldValue) {
      if (!val) {
        this.resetForm('editUserPsdForm');
      }
    },

  },
  mounted() {}
}

</script>
<style lang="less">

@media screen and (min-width: 1200px){
  .bg-common-header{
    .side-menu-btn{
      display: none;
    }
  }
}
.bg-common-header {
  min-height: 70px;
  min-width: 980px;
  font-size: 14px;
  color: #fff;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  background-image: url('/static/images/bg_header.jpg');
  background-repeat: repeat-x;
  .title-logo {
    width: 230px;
    height: 54px;
    background-image: url('/static/images/logo_bg.png');
    background-repeat: no-repeat;
    cursor: pointer;
    display: inline-block;
  }
  .bg-logo {
    display: inline-block;
    cursor: pointer;
    width: 170px;
    height: 70px;
    background: url('/static/img/bg_logo.png') no-repeat;
    background-size: 100% 100%;
  }

  .title {
    font-size: 20px;
    margin-top: 8px;
    color: #2cabe3;
    padding-left: 5px;
    overflow: hidden;
    font-weight: 700;
    padding-left: 15px;
    span {
      padding-left: 6px;
      font-size: 16px;
    }
  }

  .header-list {
    >li {
      display: inline-block;
      float: right;
      padding: 28px 15px 0;

      .ivu-dropdown-item {
        font-size: 14px!important;
      }
    }
    .other {
      i,
      span {
        cursor: pointer;
        float: left;
      }
      span {
        padding-left: 5px;
      }
      &:hover {
        color: #5c9acf;
      }
    }
  }
}

.edit-info-main {
  padding: 0 30px;
}

</style>
