<template>
    <Form ref="electricData" :model="electricData" :label-width="120" :rules="electricDataRules">
      <FormItem label="电路包名称" prop='title'>
        <Input v-model="electricData.title" placeholder="请输入电路包名称" style="width: 300px"></Input>
      </FormItem> 

      <FormItem label="电路包作者" prop='author'>
        <Input v-model="electricData.author" placeholder="请输入电路包作者" style="width: 300px"></Input>
      </FormItem>  

      <FormItem label="电路包分类" prop='category'>
<!--        <Input v-model="electricData.category" placeholder="请输入电路包分类" style="width: 300px"></Input>-->
        <Select v-model="electricData.category" style="width:300px">
            <Option v-for="item in packageClassList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>

      <FormItem label="销售价格" prop='price'>
        <Input v-model="electricData.price" placeholder="请输入电路包销售价格" style="width: 300px"></Input>
      </FormItem>  

    </Form>
</template>
<script>
    import validator from '../../common/validate.js';
    export default {
        data() {
             const priceRules = (rule, value, callback) => {
                let reg = /^[1-9]{1}\d{0,8}(.\d{1,2})?$|^0.\d{1,2}$/
                console.log(value)
                if (value===0) {
                    callback();
                }else if (!value) {
                    callback(new Error('该项不能为空'));
                }else if (reg.test(value) || value == 0) {
                    callback()
                } else {
                    callback(new Error('请输入正确价格，最多有2位小数'));
                }
            };
            return {
                //验证规则
                electricDataRules: {
                    title: [{
                        required: true,
                        message: '请输入标题',
                        trigger: 'change'
                    }],
                    price: [{
                        validator: priceRules,
                        trigger: 'change'
                    }],
                },
                packageClassList:[]
            }
        },
        props: ['electricData', 'updateSectionExecValid'],
        mounted() {
            this.packageClass()
        },
        methods: {
              /**
             * [packageClass 种类列表]
             * @Author   刘启瑞
             * @DateTime 2017-11-16
             * @param    {[type]}   page [description]
             * @return   {[type]}         [description]
             */
            packageClass(){
                this.packageClassList=[],
                this.$http.get(this.ApiTransfer("/Category/ListByGroupName"), {
                        params: this.ApiTransfer("/Category/ListByGroupName",{
                          groupName:'package'
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            res.data.Data.map((item)=>{
                                this.packageClassList.push({
                                    value:item.Id,
                                    label:item.Title,
                                })
                            })
                        }
                    })
            },
            returnData() {
                this.$emit('setParentData', this.electricData);
            },
            returnValidRes() {
                this.$refs.electricData.validate((valid) => {
                    this.$emit('setValidRes', {
                        valid,
                        modelType: 2
                    });
                })
            },
        },

        watch: {
            'electricData': {
                handler: function(nv) {
                    this.returnData();
                },
                deep: true
            },

            'updateSectionExecValid': function(nv) {
                this.returnValidRes();
            }
        }
    }

</script>
<style lang="less">


</style>
