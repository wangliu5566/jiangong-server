<template>
   <div class="order-form">
    <div class="system-title resource-system-title">
      <span :class="activeSpan==0?'active':''" @click="gopath(0,'/wrap/resource/yueStudyResourceControl/yueStudyCourses')">课程管理</span>
<!--      <span :class="activeSpan==1?'active':''" @click="gopath(1,'/wrap/resource/yueStudyResourceControl/yueStudyCourseResource')">课程资源管理</span>-->
<!--      <span :class="activeSpan==2?'active':''" @click="gopath(2,'/wrap/resource/yueStudyResourceControl/yueStudyKnowledge')">知识条目列表</span>-->
    </div>
    <div class='children-router'>
       <router-view  @refreshList="changIndex"></router-view>
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
        mounted() {
            var str = location.href
            if (str.indexOf('/wrap/resource/yueStudyResourceControl/yueStudyCourses') > 0) {
                this.activeSpan = 0
            } else if (str.indexOf('/wrap/resource/yueStudyResourceControl/yueStudyCourseResource') > 0) {
                this.activeSpan = 1
            }else{
                 this.activeSpan = 1
            }
        },
        methods: {
            gopath(index, path) {
                this.activeSpan = index;
                this.$router.push(path)
            },
            changIndex(){
                this.activeSpan =1;
            }
        }
    }

</script>
<style lang="less">


</style>
