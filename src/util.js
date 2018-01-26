import sha1 from 'crypto-js/sha1';
export default {
  install(Vue, options) {
    /**
     * [ApiTransfer 用作网页端开发环境和生产环境的接口转换]
     * @Author   罗文
     * @DateTime 2017-12-05
     * @param    {[String]}   apiname [api接口，必填参数]
     * @param    {[Object]}   data    [请求时的数据]
     * @return  {String|Object} [url地址或含有处理过的数据的地址]
     */

    Vue.prototype.ApiTransfer = function(apiname, data) {
      //必填，可以根据false
      if (!apiname) {
        alert('apiname是必填参数!');
        return;
      };
      if (!data) return baseUrl + apiname
      return Object.assign({}, data, { random: Math.random(), BridgePlatformName: transferUrl, ApiName: apiname, deviceToken: sessionStorage.deviceToken }); //随机数用作清除缓存
    }

    Vue.prototype.dateToSeconds = function(date) {
      let d = new Date(date);
      let formatDate = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
      let seconds = new Date(formatDate).getTime();
      return seconds;
    };
    Vue.prototype.secondsToDate = function(seconds) {
      let d = new Date(parseInt(seconds));
      return d;
    };
    Vue.prototype.secondsToNormalDate = function(seconds) {
      let d = new Date(seconds);
      let formatDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      return formatDate;
    };
    //sha1加密函数
    Vue.prototype.encryption = function(value) {
      return sha1(value.toString()).toString().toUpperCase();
    };
    Vue.prototype.mapArrToArrByKey = function(arrDatas, key, key1) {

      let newArr = [];
      if (arrDatas && arrDatas.length != 0) {
        arrDatas.forEach((item, index) => {
          if (key && key1) {
            newArr.push(parseInt(item[key]) + parseInt(item[key1]));
          } else {
            newArr.push(item[key]);
          }
        })
      }

      return newArr;
    };

    Vue.prototype.mapArrToValueByKey = function(arrDatas, byKey, key) {
      if (arrDatas && arrDatas.length != 0) {
        let data = '';
        arrDatas.forEach((item, index) => {
          if (item.Key == byKey) {
            data = item[key];
          }
        })
        return data;
      }
    };
    Vue.prototype.checkDateIsClear = function(datas) {
      for (var i = 0; i < datas.length; i++) {
        if (datas[i] == '' || !datas[i]) {
          return true;
        }
      }
    };
    Vue.prototype.formatDate = function(value) {
        if (value) {
          return value.split(' ')[0];
        } else {
          return '';
        }
      },
      Vue.prototype.scrollTop = function(el, from = 0, to, duration = 500) {
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
              return window.setTimeout(callback, 1000 / 60);
            }
          );
        }
        const difference = Math.abs(from - to);
        const step = Math.ceil(difference / duration * 50);

        function scroll(start, end, step) {
          if (start === end) return;

          let d = (start + step > end) ? end : start + step;
          if (start > end) {
            d = (start - step < end) ? end : start - step;
          }
          if (el === window) {
            window.scrollTo(d, d);
          } else {
            el.scrollTop = d;
          }
          window.requestAnimationFrame(() => scroll(d, end, step));
        }
        scroll(from, to, step);
      },
      //更新本地筛选条件存储
      Vue.prototype.updateFilter = function(value) {
        let filters = window.sessionStorage.getItem('bg_user_filter');
        let newFilters;
        if (value != '') {
          if (filters != null && filters != '' && filters != {}) {
            newFilters = Object.assign({}, JSON.parse(filters), value)
            window.sessionStorage.setItem('bg_user_filter', JSON.stringify(newFilters));
          } else {
            window.sessionStorage.setItem('bg_user_filter', JSON.stringify(value));
          }
        }
      },

      //快捷计算时间
      Vue.prototype.calculateDate = function(value) {
        let date = new Date();
        let nowDate = this.secondsToNormalDate(date.getTime())
        switch (parseInt(value)) {
          //昨天
          case 0:
            return [this.secondsToNormalDate(date.getTime() - 3600 * 1000 * 24), this.secondsToNormalDate(date.getTime() - 3600 * 1000 * 24)];
            break;
            //今天
          case 1:
            return [nowDate, nowDate];
            break;
            //最近7天
          case 7:
            return [this.secondsToNormalDate(date.getTime() - 3600 * 1000 * 24 * 6), nowDate]
            break;
            //最近1月
          case 30:
            return [this.secondsToNormalDate(date.getTime() - 3600 * 1000 * 24 * 29), nowDate]
          case -1:
            return ['', '']
          default:
            // statements_def
            break;
        }
      },

      //格式化价格
      Vue.prototype.formatPrice = function(s, n) {
        /*
         * 参数说明：
         * s：要格式化的数字
         * n：保留几位小数
         * */
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
          r = s.split(".")[1];
        var t = "";
        for (var i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
      },
      // 确定类型 
      Vue.prototype.confirmType = function(arrrys) {
        var arr = []
        this.allType.forEach((item) => {
          if (arrrys.indexOf(item.value) > -1) {
            arr.push(item.label)
          }
        })
        return arr.join('、')
      },
      // 所有类型
      Vue.prototype.allType = [{
          value: 0,
          label: '全部'
        },
        {
          value: 101,
          label: '知识元'
        },
        {
          value: 102,
          label: '章节'
        },
        {
          value: 112,
          label: '期刊'
        },
        {
          value: 104,
          label: '图书'
        },
        {
          value: 105,
          label: 'OA论文'
        },
        {
          value: 106,
          label: '电子电路包'
        },
        {
          value: 107,
          label: '课程'
        },
        {
          value: 108,
          label: '图片'
        },
        {
          value: 109,
          label: '视频'
        },
        {
          value: 110,
          label: '音频'
        },
        {
          value: 111,
          label: '动画'
        },
        {
          value: 103,
          label: '电子标准'
        }
      ]
  }
}
