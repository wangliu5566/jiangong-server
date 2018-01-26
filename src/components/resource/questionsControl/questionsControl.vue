<template>
   <div class="order-form">
    <div class="system-title resource-system-title">
      <span :class="activeSpan==1?'active':''" @click="gopath(1,'/wrap/resource/questionsControl/testPaper')">试卷参数列表</span>
      <span :class="activeSpan==0?'active':''" @click="gopath(0,'/wrap/resource/questionsControl/exercise')">试卷列表</span>
    </div>
    <div class='children-router'>
       <router-view></router-view>
    </div>
 
  </div>
</template>
<script>
    export default {
        data() {
            return {
                activeSpan: 1
            }
        },
        created() {
            var str = location.href
            if (str.indexOf('/wrap/resource/questionsControl/exercise') > 0) {
                this.activeSpan = 0
            } else if (str.indexOf('/wrap/resource/questionsControl/testPaper') > 0) {
                this.activeSpan = 1
            }
        },
        methods: {
            gopath(index, path) {
                this.activeSpan = index;
                this.$router.push(path)
            }
        }
    }

</script>
<style lang="less">


</style>
