<template>
    <Form ref="updateOAPeriodical" :model="OAPeriodicalData" :label-width="120" inline :rules="OAPeriodicalDataRules">
      
      <FormItem style="width: 300px;float:left">
        <div style="width:100px;height:100px;" ><img :src="OAPeriodicalData.CoverUrl" style="width:100px;height:100px;"  alt=""></div>
      </FormItem>

      <FormItem :label="item.title" :prop='item.model' style="width: 300px;float:left" v-for="(item,index) in OAInputs" :key="index">
        <Input v-model="OAPeriodicalData[item.model]"  :placeholder="'请输入'+item.title" ></Input>
      </FormItem> 
       
      <FormItem label="期刊特色" prop=''>
        <Input placeholder="请输入期刊特色" v-model='OAPeriodicalData.Feature' style="width: 490px"></Input>
      </FormItem>  

      <FormItem label="简介摘要" prop=''>
        <Input placeholder="简介摘要" :rows="4" v-model='OAPeriodicalData.Abstracts' type="textarea" style="width: 490px"></Input>
      </FormItem> 
      <FormItem label="投稿指南" prop=''>
        <Input placeholder="请输入投稿指南" :rows="4" v-model='OAPeriodicalData.GuideLines' type="textarea" style="width: 490px"></Input>
      </FormItem>  
 
    </Form>
</template>
<script>
import validator from '../../common/validate.js';
export default {
  data() {
    return {
      OAInputs:[
         {
          title:'资源名称',
          model:'title',
         },
          {
          title:'出版载体',
          model:'PublishedVector',
         },
          {
          title:'英文名称',
          model:'EnglishName',
         },
          {
          title:'发行范围',
          model:'Bkintroduction',
         },
          {
          title:'创刊时间',
          model:'CreateTime',
         },
          {
          title:'主管单位',
          model:'ChargeUnit',
         },
          {
          title:'ISSN',
          model:'Issn',
         },
          {
          title:'主办单位',
          model:'HostUnit',
         },
          {
          title:'CN',
          model:'CN',
         },
          {
          title:'出版宗旨',
          model:'PublishingPurpose',
         },
          {
          title:'唯一标识',
          model:'UniqueIdentification',
         },

          {
          title:'订阅方法',
          model:'SubscribeMethod',
         },
          {
          title:'期刊类型',
          model:'Period',
         },
//          {
//          title:'邮箱',
//          model:'title',
//         },
//          {
//          title:'网刊',
//          model:'title',
//         },
//          {
//          title:'电话',
//          model:'title',
//         },
//         {
//          title:'地址',
//          model:'title',
//         },
//         {
//          title:'网址',
//          model:'title',
//         },
      ],
      
      //验证规则
      OAPeriodicalDataRules: {
        title: [{
          required: true,
          message: '请输入资源名称',
          trigger: 'blur'
        },{
          validator: validator.CheckTitle,
          trigger: 'blur'
        }],
      }, 
    }
  },
  props:['OAPeriodicalData','updateOAPeriodicalExecValid'],
  methods:{
  	returnData() {
       this.$emit('setParentData',this.OAPeriodicalData);
  	},
  	returnValidRes() {
       this.$refs.updateOAPeriodical.validate((valid) => {
          this.$emit('setValidRes',{
                        valid,
                        modelType: 2
                    });
       })
  	},
  },

  watch:{
  	'OAPeriodicalData':{
  		handler:function(nv) {
           this.returnData();
  		},
  		deep:true
  	},

  	'updateOAPeriodicalExecValid':function(nv) {
  		   this.returnValidRes(); 
  	}
  }
}
</script>
<style lang="less">


</style>