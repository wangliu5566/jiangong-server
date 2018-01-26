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
	CheckTitle:(rule, value, callback) => {
	  if(value.length > 50) {
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

    	/**
	 * [验证机构码，也用作验证是否是数字 CheckCode]
	 * @Author   罗文
	 * @DateTime 2017-10-18
	 */
	CheckNumber:(rule, value, callback) => {
      let reg = /\D/g;
      if (reg.test(value)) {
        callback(new Error('只能输入数字'))
      } else {
        callback();
      }
    },

 /**
   * [验证非负数 CheckPosNumber]
   * @Author   罗文
   * @DateTime 2017-10-18
   */
  CheckPosNumber:(rule, value, callback) => {
      let reg = /\D/g;
      if (reg.test(value) || value <= 0) {
        callback(new Error('只能输入大于0的数'))
      } else {
        callback();
      }
    },  

    	/**
	 * [验证手机号 CheckPhone]
	 * @Author   罗文
	 * @DateTime 2017-10-18
	 */
	CheckPhone:(rule, value, callback) => {
      let reg = /^(13[0-9]|14[5|7]|15[0-9]|18[0-9])\d{8}$/g;
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback();
      }
    },

        	/**
	 * [验证网址 CheckWebsite]
	 * @Author   罗文
	 * @DateTime 2017-10-18
	 */
	CheckWebsite:(rule, value, callback) => {
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
        account: localStorage.bg_user_username,
        password: hex_sha1(value)
      }).then((res) => {
          if(res.data.Code !== 200) {
             callback(new Error('原始密码错误！'));
          }else {
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

      if(!value) {
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
      if(value[0] === '' || value[1] === '') {
        callback(new Error('请选择订单起始时间'));
        return;
      }
      
      if(!(value[0] instanceof Date)) {
        callback(new Error('起始时间有误，请重新选择起始时间'));
        return;
      }

      callback();
   },


}