<template>
  <div class="bg-system-container">
    <BgHeader v-on:toggleHide="toggleHide" ></BgHeader>
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
      <div class='sidemenu'  v-show="showSideMenu">
        <BgSideMenu :menu-list="sideMenu" v-on:hideSideMenuBySide="hideSideMenuBySide"></BgSideMenu>
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
      showSideMenu:false,
      sideMenu: [{
        label: '首页',
        icon: 'ios-home',
        path: '/system/index',
        children: []
      }, {
        label: '机构验证码管理',
        icon: 'ios-search-strong',
        path: '/system/code',
        children: []
      }, {
        label: '机构资源查看',
        icon: 'filing',
        path: '/system/resource',
        children: []
      }, {
        label: '机构订单查看',
        icon: 'clipboard',
        path: '/system/deal/check',
        children: []
      }, {
        label: '机构统计',
        icon: 'stats-bars',
        path: '/system/codestatistic',
        children: []
      }, ],
      clientWidth: document.documentElement.clientWidth
    }
  },
  mounted() {
    this.setWidth()
    const that = this;
    window.onresize = () => {
      return (() => {
        that.clientWidth = document.body.clientWidth
      })()
    }
  },
  created(){
    this.showSideMenu = document.body.clientWidth >= 1200?true:false;

  },
  components: {
    BgHeader,
    BgSideMenu,
    BgFooter
  },
  methods: {
    hideSideMenu(){
      if (this.clientWidth<1200) {
        this.showSideMenu = false;
      }
    },
    hideSideMenuBySide(){
      if (this.clientWidth<1200) {
        this.showSideMenu = false;
      }
    },
    toggleHide(value){
      this.showSideMenu = !this.showSideMenu;
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
      if (val>=1200) {
        this.showSideMenu = true;
      }else{
        this.showSideMenu = false;
      }
    }
  }
}

</script>
<style lang="less">
/*弹出层的样式*/
.col98{
  width: 98%;
}
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
    padding-bottom: 0;
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
    .sidemenu{
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

.header-nav {
  overflow: hidden;
  >li {
    float: left;
    padding: 5px 10px;
    margin-right: 5px;
    font-size: 15px;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #edf1f5;
    &:hover {
      color: #2cabe3;
      border: 1px solid #2cabe3;
    }
  }
  .selected {
    border-color: #2cabe3;
  }
}

.statistic-col {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dddee1;
}

.active {
  color: #20a0ff;
}

.count-class {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: gray;
  width: 100%;
  .spanText {
    float: left;
    height: 100%;
    line-height: 30px;
  }

  .col98 {
    width: 98%;
  }

  .condition-select {
    display: inline-block;
    height: 100%;
    float: right;
    font-size: 14px;
    margin-right: 20px;
  }


  .sale-count-change {
    display: inline-block;
    height: 100%;
    float: right;
    margin-right: 10px;
    .quick-time {
      float: left;
      margin: 5px 0 0 0;
      li {
        float: right;
        font-size: 14px;
        cursor: pointer;
        margin-right: 20px;
      }
    }
    .timePicker {
      float: right;
    }
  }

  .countData {
    font-size: 14px;
    margin-left: 5px;
    .countText {
      margin-left: 0;
    }
  }

  .countTitle {
    font-size: 18px;
    font-weight: bold;
    display: inline-block;
    float: left;
    margin: 10px 0 0 10px;
    .count-sub-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
    }
  }

  .selectBox {
    margin-right: 10px;
    float: right;
  }

  .no-border {
    border: none!important;
  }
}

</style>