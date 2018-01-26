<template>
  <div class="bg-system-login">
    <div class="login-container">
      <div class="login-text">
      </div>
      <div class="login-main" v-if="loadLoginForm">
      <Form ref="bgSystemLoginForm" :model="loginData" :rules="bgSystemLoginRules">
        <Form-item prop="username" @on-enter="handleSubmitLogin('bgSystemLoginForm')">
          <Input type="text" v-model="loginData.username" placeholder="请输入手机/邮箱" @on-change="isChange = true;">
          </Icon>
          </Input>
        </Form-item>
        <Form-item prop="password">
          <Input type="password" v-model="loginData.password" placeholder="密码" @on-change="isChange = true">
          </Input>
        </Form-item>
        <Form-item>
          <Row>
            <Col span="18">
              <i-switch style="float:left;" v-model="loginData.rememberMe" @on-change="rememberChange">
                <span slot="open">开</span>
                <span slot="close">关</span>
              </i-switch>
              <span class="is-remember">记住密码？</span>
            </Col>
          </Row>
        </Form-item>
        <Form-item>
          <Button class="pull-right login-btn" long :loading="submitLoading" type="primary" @click="handleSubmitLogin('bgSystemLoginForm')">
            <span v-if="!submitLoading">登&nbsp;&nbsp;录</span>
            <span v-else>登录中</span>
          </Button>
        </Form-item>
      </Form>
    </div>
    </div>
    
  </div>
</template>
<script>
import sha1 from 'crypto-js/sha1';
export default {
  data() {
    return {
      loginData: {
        username: window.sessionStorage.getItem('bg_user_info') && JSON.parse(window.sessionStorage.getItem('bg_user_info')).username ? JSON.parse(window.sessionStorage.getItem('bg_user_info')).username : window.localStorage.getItem('bg_user_username') ? window.localStorage.getItem('bg_user_username') : '',
        password: '',
        rememberMe: window.sessionStorage.getItem('bg_user_info') && JSON.parse(window.sessionStorage.getItem('bg_user_info')).rememberMe ? JSON.parse(window.sessionStorage.getItem('bg_user_info')).rememberMe : window.localStorage.getItem('bg_user_rememberMe') == "true" ? true : false,
      },

      userType: 1,

      loadLoginForm: false,
      //用户名或者密码是否更改过
      isChange: false,
      bgSystemLoginRules: {
        username: [{
          required: true,
          message: '请输入手机/邮箱',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请填写密码',
          trigger: 'blur'
        }]
      },
      submitLoading: false,
    }
  },
  mounted() {
    this.getDevice()
  },
  methods: {
    getDevice() {
      this.$http.post(this.ApiTransfer('/Device/Register'), this.ApiTransfer('/Device/Register', {
          title: '建工社运营管理系统',
        }))
        .then((res) => {
          if (res.data.Success) {
            sessionStorage.deviceToken = res.data.Data.DeviceToken
          }
        })
    },
    handleSubmitLogin(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if ((window.sessionStorage.getItem('bg_user_info') && JSON.parse(window.sessionStorage.getItem('bg_user_info')).rememberMe && !this.isChange) || (window.localStorage.getItem('bg_user_rememberMe')) && !this.isChange) {
            if (this.$cookie.get('bg_user_psd')) {
              this.submitLoading = true;
              this.login();
            }
          } else {
            this.submitLoading = true;
            this.login();
          }
        }
      })
    },
    login() {
      this.$http.post(this.ApiTransfer('/Passport/Login'), this.ApiTransfer('/Passport/Login', {
          account: this.loginData.username,
          password: this.loginData.password
        }))
        .then((res) => {
          this.submitLoading = false;
          if (res.data.Code == 200) {
            if (this.loginData.rememberMe) {
              this.$cookie.set('bg_user_psd', this.loginData.password, { expires: 30 });
            }
            window.sessionStorage.setItem('bg_user_info', JSON.stringify(res.data.Data));
            sessionStorage.accessToken = res.data.Data.ExtendData.AccessToken;
            window.localStorage.setItem('bg_user_username', this.loginData.username);
            window.localStorage.setItem('bg_user_rememberMe', this.loginData.rememberMe);
            window.localStorage.setItem('bg_user_isOverdue', false); //cookie的过期时间
            let userType = res.data.Data.UserType;
            window.sessionStorage.setItem('bg_user_type', this.encryption(userType));
            if (userType == 0 || userType == 1 || userType == 5) {
              if (userType == 5) {
                this.$router.push('/system');
              } else {
                this.$router.push('/wrap')
              }
              this.$Message.success('欢迎登录建工社运营管理系统');
            } else {
              this.$Message.warning('您没有登录权限，请更换账号后再试')
            }

          } else {
            this.$Message.warning(res.data.Description)
          }
        })
    },
    //初始化用户名
    initPsd() {
      if ((window.sessionStorage.getItem('bg_user_info') && JSON.parse(window.sessionStorage.getItem('bg_user_info')).username && JSON.parse(window.sessionStorage.getItem('bg_user_info')).rememberMe) || (window.localStorage.getItem('bg_user_username') && window.localStorage.getItem('bg_user_rememberMe')) != "false") {
        let lastPsd = this.$cookie.get('bg_user_psd');
        if (lastPsd && !this.isChange) {
          if (this.loginData.username) {
            this.loginData.password = lastPsd;
          }
        } else {
          if (window.localStorage.getItem('bg_user_isOverdue') == "false") {
            this.$Message.error({
              content: '您记录的登录有效时间已过期，请重新输入密码',
              duration: 4
            });
            window.localStorage.setItem('bg_user_isOverdue', true);
          }
          window.sessionStorage.setItem('bg_user_info', JSON.stringify(Object.assign({}, JSON.parse(window.sessionStorage.getItem('bg_user_info')), {
            rememberMe: false,
          })));
          this.loginData.rememberMe = false;
        }
      }

    },
    rememberChange(value) {
      if (window.sessionStorage.getItem('bg_user_info') && JSON.parse(window.sessionStorage.getItem('bg_user_info')).username && JSON.parse(window.sessionStorage.getItem('bg_user_info')).rememberMe && !this.isChange) {
        if (!value) {
          this.loginData.password = '';
        }
      }
    },
  },
  watch: {
    'loginData.username': function(val, oldVal) {
      if (!val && oldVal) {
        this.loginData.password = '';
      } else if (val.length == 1) {
        this.loginData.password = '';
      }
    }
  },
  created() {
    setTimeout(() => {
      this.loadLoginForm = true;
    }, 0);
    this.initPsd();
    var _this = this;
    window.onkeydown = function(e) {
      if (e.keyCode == 13) {
        _this.handleSubmitLogin('bgSystemLoginForm');
      }
    };

  }
}

</script>
<style lang="less">
.bg-system-login {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url("../../assets/login_bg.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;

  .login-container {
    width: 600px;
    height:500px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-clip: padding-box;

    .login-text {
      width: 100%;
      height: 126px;
      margin-bottom: 75px;
      line-height: 45px;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      background: url('../../assets/bt.png') no-repeat center center;
    }

    .login-main{
      width: 400px;
      height: 300px;
      margin: 0 auto;
    }
    .ivu-input {
      border-color: #fff;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      padding: 5px 20px;
      border-radius: 20px;
    }
    .ivu-form-item-error-tip {
      color: red;
    }
    .ivu-switch {
      background-color: transparent;
      border-color: #fff;
    }
    .ivu-switch-checked {
      background-color: #5bce53;
    }
    .login-btn {
      background-color: #5bce53;
      height: 50px;
      font-size: 18px;
      border-radius: 20px;
    }
    .is-remember{
      display: inline-block;
      font-size: 14px;
      float: left;
      margin-top: -4px;
      margin-left: 10px;
      color: #f0f0f0;
    }
    .title {
      font-size: 16px;
      margin-bottom: 25px;
      text-align: center;
    }
    .sub-title {
      font-size: 12px;
      display: block;
      text-align: center;
      color: #505458;
      margin: 20px 0 5px;
    }
  }
}

</style>
