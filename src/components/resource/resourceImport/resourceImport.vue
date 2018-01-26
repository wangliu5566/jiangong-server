<template>
   <div class="order-form">
   
    <div class='children-router'>
       <router-view ></router-view>
    </div>
 
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeSpan:0
    }
  },
//created() {
//            var str = location.href
//            if (str.indexOf('/wrap/resource/resourceImport/fileImport') > 0) {
//                this.activeSpan = 0
//            } else if (str.indexOf('/wrap/resource/resourceImport/schemeImport') > 0) {
//                this.activeSpan = 1
//            }
//        },
  methods:{
    gopath(index,path){
        this.activeSpan = index;
        this.$router.push(path)
      }
   }
}

</script>
<style lang="less">


</style>