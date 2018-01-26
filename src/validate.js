import Vue from 'vue';
export default {
  /**
   * [验证机构名 CheckTitle]
   * @Author   罗文
   * @DateTime 2017-10-18
   * @param    {[Object]}   rule     [这是iview自动传入的规则对象]
   * @param    {[String]}   value    [输入的值]
   * @param    {Function} callback [验证成功或失败的回调函数]
   * @return   {[type]}            [description]
   */
  CheckTitle: (rule, value, callback) => {
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
  },

  CheckAge: (rule, value, callback) => {
    let reg = /\D/g;
    if (reg.test(value)) {
      callback(new Error('年龄只能为正整数'));
    } else if (parseInt(value) >= 120 || parseInt(value) < 0) {
      callback(new Error('年龄只能小于120'));
    } else {
      callback();
    }
  },

  /**
   * [description]
   * @Author   李志明
   * @DateTime 2017-11-02
   * @param    {[type]}   rule     [description]
   * @param    {[type]}   value    [description]
   * @param    {Function} callback [description]
   * @return   {[type]}            [description]
   */
  CheckName: (rule, value, callback) => {
    let reg = /^[\u4E00-\u9FA5]{1,10}$/;
    if (!reg.test(value)) {
      callback(new Error('只能全为中文'))
    } else {
      callback();
    }
  },

  /**
   * [验证机构码，也用作验证是否是数字 CheckCode]
   * @Author   罗文
   * @DateTime 2017-10-18
   */
  CheckCode: (rule, value, callback) => {
    let reg = /\D/g;
    if (reg.test(value)) {
      callback(new Error('只能输入数字'))
    } else {
      callback();
    }
  },

  /**
   * [验证ip字段]
   * @Author    李志明
   * @DateTime  2017-10-24
   */
  CheckIp: (rule, value, callback) => {
    let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if (!reg.test(value)) {
      callback(new Error('输入正确IP地址'))
    } else {
      callback();
    }
  },

  /**
   * [验证非负数 CheckCode]
   * @Author   罗文
   * @DateTime 2017-10-18
   */
  CheckPosNumber: (rule, value, callback) => {
    console.log(value)
    let reg = /\D/g;
    if (reg.test(value) || value <= 0) {
      callback(new Error('只能输入大于0的数'))
    } else {
      callback();
    }
  },

  /**
   * 验证码个数
   * @Author   李志明
   * @DateTime 2017-11-24
   * @param    {[type]}   rule     [description]
   * @param    {[type]}   value    [description]
   * @param    {Function} callback [description]
   * @return   {[type]}            [description]
   */
  CheckCodeNumber: (rule, value, callback) => {
    let reg = /\D/g;
    if (reg.test(value) || value <= 0) {
      callback(new Error('只能输入大于0的数'))
    } else if (value > 500) {
      callback(new Error('只能输入小于等于500的数'));
    } else {
      callback();
    }
  },

  /**
   * [验证手机号 CheckCode]
   * @Author   罗文
   * @DateTime 2017-10-18
   */
  CheckPhone: (rule, value, callback) => {
    let reg = /^1\d{10}$/g;
    if (!reg.test(value)) {
      callback(new Error('请输入正确的手机号'))
    } else {
      callback();
    }
  },

  /**
   * [验证网址]
   * @Author    李志明
   * @DateTime  2017-10-24
   */
  CheckWebsite: (rule, value, callback) => {
    let reg = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/g;

    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的网址'))
    } else {
      callback();
    }
  },

  /**
   * [CheckOldPwd 验证旧密码是否正确]
   * @Author   罗文
   * @DateTime 2017-10-19
   */
  CheckOldPwd(rule, value, callback) {
    Vue.prototype.$http.post('/Passport/Login', {
      account: JSON.parse(window.sessionStorage.getItem('bg_user_info')).MobileNumber,
      password: value
    }).then((res) => {
      if (!res.data.Success) {
        callback(new Error('原始密码错误！'));
      } else {
        callback();
      }
    })
  },

  /**
   * [CheckEmail 验证邮箱]
   * @Author   罗文
   * @DateTime 2017-10-20
   */
  CheckEmail(rule, value, callback) {
    let reg = /^[A-z0-9_]{3,12}@[A-z0-9]{2,12}(\.com|\.cn|\.com\.cn)$/g;

    if (!value) {
      callback();
      return;
    }

    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱'))
    } else {
      callback();
    }
  },

  /**
   * [CheckDate 验证起始时间]
   * @Author   罗文
   * @DateTime 2017-10-20
   */
  CheckDate(rule, value, callback) {
    if (value[0] == '' || value[1] == '' || value[0] == null || value[1] == null) {
      callback(new Error('请选择起始时间'));
    } else {
      callback();
    }
  },

  CheckVersion(rule, value, callback) {
    let reg = /^\d+((\.\d+)|(\.[A-z]+)*)/;
    if (!value) {
      callback(new Error('请填写版本号'))
    } else if (!reg.test(value)) {
      callback(new Error('请填写正确的版本号'));
    } else {
      callback();
    }
  },

  CheckNumber(rule, value, callback) {
    let reg = /^[0-9]*$/;
    if (!value) {
      callback(new Error('请填写版本数字号'))
    } else if (!reg.test(value)) {
      callback(new Error('请填写数字'))
    } else {
      callback();
    }
  },

  /**
   * [CheckPsd 验证密码]
   * @Author   李志明
   * @DateTime 2017-11-15
   */
  CheckPsd(rule, value, callback) {
    let reg = /[\u4E00-\u9FA5]/;
    if (!value) {
      callback(new Error('请输入密码'));
    } else if (value.length < 6 || value.length > 12) {
      callback(new Error('密码长度在6-12位之间'));
    } else if (reg.test(value)) {
      callback(new Error('密码不能含有汉字'));
    } else {
      callback();
    }
  }


}
