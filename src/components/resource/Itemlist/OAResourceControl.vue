<template>
   <div class="order-form">
    <div class="system-title resource-system-title">
      <span :class="activeSpan==0?'active':''" @click="gopath(0,'/wrap/resource/OAResourceControl/OAPeriodical')">试题管理</span>
<!--      <span :class="activeSpan==1?'active':''" @click="gopath(1,'/wrap/resource/OAResourceControl/OAThesis')">论文管理</span>-->
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
                activeSpan: 0
            }
        },
        created() {
            var  str=location.href
            if(str.indexOf('/wrap/resource/OAResourceControl/OAPeriodical')>0){
                this.activeSpan=0
            }else{
                this.activeSpan=1
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
