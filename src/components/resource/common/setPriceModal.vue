<template>
    <Form ref="setPriceForm" :model="priceData" :label-width="120" :rules="setPriceRules">
<!--
      <FormItem label="选择销售策略" prop='strategyType'>
        <Select v-model="priceData.strategyType" style="width:300px">
            <Option value="满减">满减</Option>
            <Option value="满打折">满打折</Option>
        </Select>
      </FormItem>
-->

<!--
      <FormItem label="选择销售方式" prop='strategy'>
        <RadioGroup v-model="priceData.strategy">
  	        <Radio label="1">满减一：满500减100</Radio>
  	        <Radio label="2">满减二：满200减40</Radio>
  	    </RadioGroup>

 	    <RadioGroup v-model="priceData.strategy">
	        <Radio label="满打折一：满500打7折"></Radio>
	        <Radio label="满打折二：满200打9折"></Radio>
	    </RadioGroup> 
      </FormItem>
-->

      <FormItem label="销售价格" prop='price'>
        <Input v-model="priceData.price" placeholder="请输入整数" style="width: 300px"></Input>
      </FormItem>  

    </Form>
</template>
<script>
import validator from '../../common/validate.js';
export default {
  data() {
    return {
       //验证规则
      setPriceRules: {
        strategy: [{
          required: true,
          message: '该项不能为空',
          trigger: 'blur'
        }],
        price: [{
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        },{
          validator: validator.CheckNumber,
          trigger: 'blur'
        }],
      }, 
    }
  },
  props:['priceData','setPriceExecValid'],
  methods:{
  	returnData() {
       this.$emit('setParentData',this.priceData);
  	},
  	returnValidRes() {
       this.$refs.setPriceForm.validate((valid) => {
         this.$emit('setValidRes',{valid,modelType:1});
       })
  	},
  },

  watch:{
  	'priceData':{
  		handler:function(nv) {
           this.returnData();
  		},
  		deep:true
  	},

  	'setPriceExecValid':function(nv) {
  		 this.returnValidRes(); 
  	}
  }
}
</script>
<style lang="less">


</style>