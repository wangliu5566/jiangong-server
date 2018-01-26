<template>
  <div class="statistic-container">
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  }
}

</script>
<style lang="less">
.statistic-container {
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
    .selected{
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
  .countClass {
    height: 50px;
    padding: 10px 20px 0;
    font-size: 16px;
    color: gray;
    width: 100%;
    border-bottom: 1px solid #dddee1;
  }

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

  .no-border{
    border: none!important;
  }
}

</style>
