<template>
  <div class="menu-wrap1">
    <Menu theme="light" accordion width="100%" :active-name="editUrl1($route.path)" @on-select="gopath" :open-names="[editUrl($route.path)]">
      <template v-for="(item,index) in menuList">
        <template v-if="!item.children.length">
          <Menu-item :name="item.path">
            <Icon :type="item.icon" size="16"></Icon>
            {{ item.label }}
          </Menu-item>
        </template>
        <template v-else>
          <Submenu :name="item.path">
            <template slot="title">
              <Icon :type="item.icon" size="16"></Icon>
              {{ item.label }}
            </template>
            <template v-for="(el,i) in item.children">
              <Menu-item :name="el.path">
                <Icon :type="el.icon" size="16"></Icon>{{ el.label}}
              </Menu-item>
            </template>
          </Submenu>
        </template>
      </template>
    </Menu>
    <!-- <Button @click="haha">haha</Button> -->
  </div>
</template>
<script>
import sha1 from 'crypto-js/sha1';
export default {
  data() {
    return {
      // isSuper: window.sessionStorage.getItem('isSuper')
    }
  },
  props: [
    'menuList'
  ],
  methods: {
    gopath(url) {
      //路由跳转
      let base = url.split('\/')[1];
      this.$router.push('\/'+base+'/blank');
      let _this = this;
      window.setTimeout(()=>{
        _this.$router.push(url)
      },10)

      

      this.$emit('hideSideMenuBySide','set')
      // this.$router.push(url);
    },
    editUrl(url) {
      let urlArr = url.split("\/");
      return '/' + urlArr[1] + '/' + urlArr[2];
    },
    editUrl1(url) {
      let urlArr = url.split("\/");
      if (urlArr[3] != undefined) {
        return '/' + urlArr[1] + '/' + urlArr[2] + '/' + urlArr[3];
      } else {
        return '/' + urlArr[1] + '/' + urlArr[2]
      }
    },

    //sha1加密
    tkip(value) {
      return sha1(value).toString();
    },

    haha() {
      console.log(this.menuList)
    }
  }
}

</script>
<style lang='less'>
.menu-wrap1 {
  .ivu-menu-light {
    background-color: #0c96c4;
    color: #fff;
  }
  .ivu-menu-item {
    border: none;
    padding: 14px 16px!important;
    &:hover {
      background-color: #0b2148;
    }
  }
  .ivu-menu {
    >.ivu-menu-item {
      background-color: #1a417c;
      border-bottom: 1px solid #0561a0!important;

      &:hover{
         background-color: #0b2148!important;
      }
    }

    .ivu-menu-submenu {
      border-bottom: 1px solid #0561a0!important;
      .ivu-menu-item {
        color: #fff;
        background-color: #0c96c4;
        border-bottom: none!important;
        padding: 14px 16px 14px 24px!important;
        &:hover {
          color: #124189;
          background-color: #0c96c4!important;
        }
      }
      .ivu-menu-item-selected {
        color: #124189!important;
        background-color: #0c96c4!important;
      }
      &:hover {
        background-color: #0b2148;
      }
    }
  }

  .ivu-menu-light {
    background-color: transparent;
  }

  .ivu-menu-vertical.ivu-menu-light:after {
    background: none;
  }

  .ivu-menu-submenu-title {
    background-color: #1a417c;
    padding: 14px 16px!important;
    &:hover {
      background-color: #0b2148!important;
    }
  }

  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    border-right: none;
    z-index: 2;
    background-color: #0b2148;
    color: #fff;
  }
}

</style>
