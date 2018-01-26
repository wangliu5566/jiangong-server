// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js'

Vue.config.productionTip = false;

import util from './util'
Vue.use(util);

//引入axios
import axios from './http.js'
Vue.prototype.$http = axios;

import iView from 'iview';
import '../theme/index.less'; // 使用 CSS
Vue.use(iView);

import vSelect from 'vue-select'
Vue.component('v-select', vSelect)

import VueCookie from 'vue-cookie'
Vue.use(VueCookie);


// 引入视频播放器
import VueVideoPlayer from 'vue-video-player'
Vue.use(VueVideoPlayer)

// 引入treetable
import 'jquery-treetable'

/* eslint-disable no-new */


Date.prototype.formatDate = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份  
    "d+": this.getDate(), //日  
    "h+": this.getHours(), //小时  
    "m+": this.getMinutes(), //分  
    "s+": this.getSeconds(), //秒  
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度  
    "S": this.getMilliseconds() //毫秒  
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
