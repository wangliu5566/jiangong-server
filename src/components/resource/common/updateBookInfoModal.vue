<template>
    <Form ref="bookinfoData" :model="bookinfoData" :label-width="120" :rules="bookinfoDataRules">
      <FormItem label="图书名称" prop='title'>
        <Input v-model="bookinfoData.title" placeholder="请输入图书名称" style="width: 300px"></Input>
      </FormItem> 

      <FormItem label="书号" prop='author'>
        <Input v-model="bookinfoData.author" placeholder="请输入书号" style="width: 300px"></Input>
      </FormItem>  

      <FormItem label="ISBN" prop='category'>
        <Input v-model="bookinfoData.category" placeholder="请输入ISBN" style="width: 300px"></Input>
      </FormItem>

      <FormItem label="出版社" prop='price'>
        <Input v-model="bookinfoData.price" placeholder="请输入出版社" style="width: 300px"></Input>
      </FormItem>  

    </Form>
</template>
<script>
import validator from '../../common/validate.js';
export default {
  data() {
    return {
       //验证规则
      bookinfoDataRules: {
        title: [{
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        },{
          validator: validator.CheckTitle,
          trigger: 'blur'
        }],
      }, 
    }
  },
  props:['bookinfoData','bookinfoDataExecValid'],
  methods:{
    returnData() {
       this.$emit('setParentData',this.bookinfoData);
    },
    returnValidRes() {
       this.$refs.bookinfoData.validate((valid) => {
          this.$emit('setValidRes',valid);
       })
    },
  },

  watch:{
    'bookinfoData':{
      handler:function(nv) {
           this.returnData();
      },
      deep:true
    },

    'bookinfoDataExecValid':function(nv) {
         this.returnValidRes(); 
    }
  }
}
</script>
<style lang="less">


</style>