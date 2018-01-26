<template>
    <Form ref="setPriceForm" :model="discountsActivityData" :label-width="150" >
      <FormItem label="使用优惠活动" prop='isUseDiscounts'>
        <i-switch v-model="discountsActivityData.isUseDiscounts" @on-change="change"></i-switch>
      </FormItem>

      <FormItem label="活动名称" prop='activityTitle' v-show="discountsActivityData.isUseDiscounts">
<!--
        <Select v-model="discountsActivityData.activityId" style="width:300px">
            <Option value="1">双11返场</Option>
            <Option value="2">新书八折</Option>
            <Option value="3">教师节优惠</Option>
        </Select>
        
-->
        <Select v-model="discountsActivityData.activityId" style="width:300px">
        <Option v-for="item in list" :value="item.value" :key="item.value">{{item.lable}}</Option>
    </Select>
      </FormItem>

      <FormItem label="活动描述" prop='price' v-show="discountsActivityData.isUseDiscounts">
         {{activityDesc}}
      </FormItem>  

    </Form>
</template>
<script>
    export default {
        data() {
            return {
                activityDesc:'',
                list:[]
            }
        },
        props: ['discountsActivityData'],
        mounted() {
            this.getlist()
        },
        methods: {
            /**
             * [getlist 获取列表]
             * @Author   刘启瑞
             * @DateTime 2017-11-19
             * @return   {[type]}   [description]
             */
            getlist() {
                this.$http.get(this.ApiTransfer("/SaleStrategy/List"), {
                        params: this.ApiTransfer("/SaleStrategy/List",{
                            cp: 1,
                            ps: 9999999999999,
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
//                            console.log(res.data.Data.ItemList)
                            res.data.Data.ItemList.map((item)=>{
                                this.list.push({
                                    value:`${item.Id}`,
                                    lable:item.Title,
                                    content:item.Description
                                })
                            })
                        }
                    })
            },
            returnData() {
                this.$emit('setParentData', this.discountsActivityData);
            },

            change(status) {

            },
            changeDescribe(){
                this.activityDesc=''
                for(var i=0;i<this.list.length;i++){
                    if(this.discountsActivityData.activityId==this.list[i].value){
                        
                            this.activityDesc=this.list[i].content
                        
//                        return
                    }
                }
            }
        },

        watch: {
            'discountsActivityData': {
                handler: function(nv) {
                    this.returnData();
                    this.changeDescribe();
                },
                deep: true
            },
        }
    }

</script>
<style lang="less">


</style>
