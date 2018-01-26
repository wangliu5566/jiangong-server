<template>
  <div class="bg-system-container">
    <BgHeader v-on:toggleHide="toggleHide"></BgHeader>
    <div class="main">
      <div class="container">
        <div class="router-main" ref="containerMainArea">
          <div class="router-container" @click="hideSideMenu">
            <transition name="router-fade" mode="out-in">
              <router-view :widthData='clientWidth-250'></router-view>
            </transition>
          </div>
          <BgFooter></BgFooter>
        </div>
      </div>
      <div class='sidemenu' v-show="showSideMenu">
        <BgSideMenu :menu-list="userMenu" v-on:hideSideMenuBySide="hideSideMenuBySide"></BgSideMenu>
      </div>
    </div>
  </div>
</template>
<script>
import BgHeader from "@/components/common/BgHeader"
import BgSideMenu from "@/components/common/BgSideMenu"
import BgFooter from "@/components/common/BgFooter"
export default {
  data() {
    return {
      showSideMenu: false,
      sidelist: [{
          label: '角色管理',
          icon: 'person-add',
          path: '/wrap/userMain/role'
        }, {
          label: '普通用户管理',
          icon: 'person-stalker',
          path: '/wrap/userMain/user'
        }, {
          label: '管理员管理',
          icon: 'person',
          path: '/wrap/userMain/admin'
        },
        {
          label: '机构管理',
          icon: 'filing',
          path: '/wrap/userMain/organiza'
        }, {
          label: '资源内容管理',
          icon: 'film-marker',
          path: '/wrap/resource/resourceImport',
        },
        {
          label: '知识体系管理',
          icon: 'android-list',
          path: '/wrap/scheme/knowWarp',
          children: []
        },
        {
          label: '分类体系管理',
          icon: 'ios-medkit',
          path: '/wrap/scheme/typeWrap',
          children: []
        },
        //                 {
        //          label: '课程管理',
        //          icon: 'ios-bookmarks-outline',
        //          path: '/wrap/resource/yueStudyResourceControl',
        //        }, {
        //          label: '试题管理',
        //          icon: 'ios-settings',
        //          path: '/wrap/resource/OAResourceControl',
        //        },
        //        {
        //          label: '试卷管理',
        //          icon: 'ios-toggle',
        //          path: '/wrap/resource/questionsControl',
        //        }, 
        {
          label: '个人纸质订单',
          icon: 'bag',
          path: '/wrap/eBusiness/personal',
          children: []
        }, {
          label: '个人电子订单',
          icon: 'folder',
          path: '/wrap/eBusiness/eleOrder',
          children: []
        }, {
          label: '机构订单',
          icon: 'cash',
          path: '/wrap/eBusiness/organization',
          children: []
        },
        {
          label: '机构订单审核',
          icon: 'social-usd',
          path: '/wrap/eBusiness/shopPay',
          children: []
        },
        {
          label: '销售策略管理',
          icon: 'social-buffer',
          path: '/wrap/eBusiness/salesStrategy',
          children: []
        }, {
          label: '广告商管理',
          icon: 'chatboxes',
          path: '/wrap/advertising/advertiser',
          children: []
        }, {
          label: '广告位管理',
          icon: 'easel',
          path: '/wrap/advertising/advertisingPosition',
          children: []
        }, {
          label: '广告内容管理',
          icon: 'chatbubble-working',
          path: '/wrap/advertising/advertisingContent',
          children: []
        }, {
          label: '管理员操作日志',
          icon: 'chatboxes',
          path: '/wrap/logs/adminLogs',
          children: []
        }, {
          label: '用户操作日志',
          icon: 'easel',
          path: '/wrap/logs/userLogs',
          children: []
        }, {
          label: '用户统计',
          icon: 'android-contacts',
          path: '/wrap/statisticMain/userStatistic',
          children: []
        },
        {
          label: '内容统计',
          icon: 'navicon-round',
          path: '/wrap/statisticMain/content',
          children: []
        },
        {
          label: '知识元阅读统计',
          icon: 'ios-pricetag',
          path: '/wrap/statisticMain/knowledge',
          children: []
        },
        // {
        //   label: '课程学习统计',
        //   icon: 'ios-timer',
        //   path: '/wrap/statisticMain/course',
        //   children: []
        // },
        {
          label: '资源入库报表',
          icon: 'ios-settings-strong',
          path: '/wrap/statisticMain/resource',
          children: []
        },
        {
          label: '交易报表',
          icon: 'ios-cart',
          path: '/wrap/statisticMain/dealStatistic',
          children: []
        }, {
          label: '客户端管理权限',
          icon: 'ios-settings-strong',
          path: '/wrap/statisticMain/resource',
          children: []
        },
        // {
        //   label: '公告管理权限',
        //   icon: 'ios-cart',
        //   path: '/wrap/statisticMain/dealStatistic',
        //   children: []
        // },
        {
          label: '公告管理',
          icon: 'speakerphone',
          path: '/wrap/infoMain/notice',
          children: []
        }, {
          label: '推送消息管理',
          icon: 'android-send',
          path: '/wrap/infoMain/pushMessage',
          children: []
        }, {
          label: '评论管理',
          icon: 'android-hangout',
          path: '/wrap/infoMain/comment',
          children: []
        }
      ],
      userMenu: [],
      clientWidth: document.documentElement.clientWidth
    }
  },
  mounted() {
    this.setWidth()
    this.getMytitle()
    const that = this;
    window.onresize = () => {
      return (() => {
        that.clientWidth = document.body.clientWidth
      })()
    };
  },
  created() {
    this.showSideMenu = document.body.clientWidth >= 1200 ? true : false;

  },
  components: {
    BgHeader,
    BgSideMenu,
    BgFooter
  },
  methods: {
    hideSideMenu() {
      if (this.clientWidth < 1200) {
        this.showSideMenu = false;
      }
    },
    hideSideMenuBySide() {
      if (this.clientWidth < 1200) {
        this.showSideMenu = false;
      }
    },
    toggleHide(value) {
      this.showSideMenu = !this.showSideMenu;
    },
    //获取列表权限
    getMytitle() {
      this.$http.get(this.ApiTransfer("/Permission/ListByUser"), {
          params: this.ApiTransfer("/Permission/ListByUser", {
            userId: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id
          })
        })
        .then((res) => {
          this.userMenu = [{
              label: '首页',
              icon: 'ios-home',
              path: '/wrap/index',
              children: []
            }, {
              label: '用户管理及安全控制',
              icon: 'ios-gear',
              path: '/wrap/userMain',
              children: []
            }, {
              label: '内容资源管理',
              icon: 'android-list',
              path: '/wrap/resource',
              children: []
            }, {
              label: '电子商务',
              icon: 'social-bitcoin',
              path: '/wrap/eBusiness',
              children: []
            }, {
              label: '广告管理',
              icon: 'cube',
              path: '/wrap/advertising',
              children: []
            }, {
              label: '统计分析',
              icon: 'aperture',
              path: '/wrap/statisticMain',
              children: []
            }, {
              label: '操作日志管理',
              icon: 'ios-copy',
              path: '/wrap/logs',
              children: []
            }, {
              label: '客户端管理',
              icon: 'android-upload',
              path: '/wrap/client',
              children: []
            }, {
              label: '消息管理',
              icon: 'android-mail',
              path: '/wrap/Info',
              children: []
            }

          ]
          if (res.data.Success) {
            let mylist = res.data.Data
            for (let i = mylist.length - 1; i >= 0; i--) {
              if (mylist[i].Level == 2) {
                for (let j = 0; j < this.userMenu.length; j++) {
                  if (mylist[i].GroupName == this.userMenu[j].label) {
                    for (let z = 0; z < this.sidelist.length; z++) {
                      if (this.sidelist[z].label == mylist[i].Title) {
                        this.userMenu[j].children.push(this.sidelist[z])
                        continue;
                      }
                    }
                  }
                }
              }
            }
            //            console.log(...this.userMenu)
            for (let x = 1; x < this.userMenu.length; x++) {
              if (this.userMenu[x].children.length < 1) {
                this.userMenu.splice(x, 1);
                x--
              }
            }
            for (let x = 1; x < this.userMenu.length; x++) {
              if (this.userMenu[x].label == '客户端管理') {
                this.userMenu[x].children = []
              }
            }
          }
        })
    },
    setWidth() {
      this.clientWidth = document.documentElement.clientWidth;
    },
  },
  beforeRouteLeave(to, from, next) {
    window.sessionStorage.setItem('bg_user_info', JSON.stringify(Object.assign({}, JSON.parse(window.sessionStorage.getItem('bg_user_info')), {
      password: '',
      id: '',
      realName: ''
    })));
    next();
  },
  watch: {
    '$route': function(val, oldVal) {
      if (val.fullPath != oldVal.fullPath) {
        this.$refs.containerMainArea.scrollTop = 0;
      }
    },
    clientWidth(val) {
      this.clientWidth = val;
      if (val >= 1200) {
        this.showSideMenu = true;
      } else {
        this.showSideMenu = false;
      }
    }
  }
}

</script>
<style lang="less">
/*弹出层的样式*/

.ivu-tooltip {
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ivu-tooltip-inner {
  max-width: 400px!important;
  white-space: normal!important;
  background-color: white;
  border: 1px solid #e9eaec;
  color: #000;
  font-family: '\5FAE\8F6F\96C5\9ED1';
  overflow: hidden;
  word-break: break-all;
}


.bg-system-container {
  background-color: #e9ecf3;
  /*min-width: 1200px;*/
  height: 100%;
  width: 100%;

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .ivu-spin-text {
    padding: 30px 0;
  }

  .p1-right {
    font-size: 16px;
    font-weight: 500;
    position: relative;

    .show-blue {
      color: #5c9acf;
    }

    span {
      cursor: pointer;
    }
  }
  .p1-right1 {
    width: 400px;
    float: right;
    font-size: 16px;
    font-weight: 500;
    position: relative;

    .show-blue {
      color: #5c9acf;
    }

    span {
      cursor: pointer;
    }
  }

  .main {
    width: 100%;
    overflow-y: auto;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
    border-top: 75px solid #7a7674;
    overflow: hidden;

    /* --------- 统一的表格样式和分页 ------------*/
    .btn-line {
      height: 50px;
      margin-top: 25px;
    }

    .tables {
      margin-top: 20px;
    }

    .page {
      height: 50px;
      margin-top: 15px;

      .ivu-page {
        float: right;
      }
    }

    /*蓝色字体的颜色*/
    .show-blue {
      color: #20a0ff;
    }

    .sidemenu {
      height: 100%;
      background-color: #01609a;
      padding: 10px 10px 0;
      width: 240px;
      float: left;
      overflow-y: auto;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9999;

      .side-menu-main {
        width: 100%;
        text-align: center;
      }

      .sidemenu-title {
        padding: 20px 0 15px 20px;
        border-bottom: 1px solid #666;
        color: white;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
      }
    }

    .container {
      height: 100%;

      .router-main {
        height: 100%;
        overflow-y: auto;
      }
      .router-container {
        min-height: 100%;
        margin-bottom: -42px;
        padding-bottom: 42px;
        padding: 20px 20px 42px;
        font-size: 14px!important;

        .ivu-table {
          font-size: 14px;
        }
      }
    }
  }
  .system-title {
    font-size: 18px;
    color: #2cabe3;
    font-weight: bold;
    overflow: hidden;
    padding-bottom: 0px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;

    i,
    a {
      float: left;
      cursor: pointer;
    }
    a {
      padding-left: 6px;
      color: #5c9acf;
      &:hover {
        color: #2d8cf0;
      }
    }
    span {
      padding-left: 6px;
    }
    .pointer {
      font-size: 14px;
      padding-top: 3px;
      display: inline-block;
    }
    .next-title {
      font-size: 16px;
      color: #999;
      padding-top: 2px;
    }
  }
  .ivu-form-item-content {
    font-size: 14px;
  }
}

.check-works-modal {
  .ivu-form-item {
    margin-bottom: 8px;
  }
}

.other-color {
  color: rgba(217, 84, 79, 1);
}

.ivu-select-single {
  position: relative;
}

@media screen and (min-width: 1200px) {
  .bg-system-container {
    .container {
      margin-left: 240px;
    }
    .router-container {
      min-width: 950px;
    }
    .sidemenu {
      display: block;
    }
  }
}

@media screen and (max-width: 1199px) {
  .bg-system-container {
    .router-container {
      min-width: 1199px;
      
    }
  }
}










/***********  上传文件夹 *******/

#modal {
  .modal-word {
    padding-left: 60px;
    line-height: 50px;
    font-size: 14px;
  }
  .ivu-upload {
    padding-left: 60px;
    margin-top: -50px;
  }
  .will-upload {
    padding-left: 60px;
  }

  .will-upload .ivu-btn {
    background-color: #5c9acf;
    color: white;
    padding: 5px 10px;
    margin-left: 15px;
  }
}

</style>
