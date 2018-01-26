<template>
  <div id="app" class="app-container">
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import './assets/Product.less';
export default {
  name: 'app',
}

</script>
<style lang='less'>
.system-static {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dddee1;
}

.echarts-each-two{
  width: 49%;
  border: 1px solid #dddee1;
  border-radius: 4px;
  background-color: #fff
}

.edit-model-body{
  padding-right: 30px;
}

.rel {
  position: relative;
}

.chart-no-data {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  text-align: center;
  font-size: 20px;
  color: #dddee1;
  font-weight: bold;
  background-color: #fff;
  z-index: 888;
  >span {
    position: relative;
    width: 80%;
    height: auto;
    top: 50%;

    -webkit-transform: translateX(-50%) translateY(-50%);
    -moz-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
  }
}

</style>
