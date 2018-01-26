<template>
    <Form ref="updateStandard" :model="standardData" :label-width="120" :rules="standardDataRules">
      <FormItem label="标准名称" prop='title'>
        <Input v-model="standardData.title" placeholder="请输入标准名称" style="width: 300px"></Input>
      </FormItem>  

      <FormItem label="标准分类" prop='category'>
<!--        <Input v-model="standardData.category" placeholder="请输入标准分类" style="width: 300px"></Input>-->
        <Select v-model="standardData.category" style="width:300px">
            <Option v-for="item in standardClassList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>

      <FormItem label="标准描述" prop='description'>
        <Input v-model="standardData.description" type="textarea" :rows="4" placeholder="请输入标准简介" style="width: 300px"></Input>
      </FormItem> 

      <FormItem label="内容摘要" prop='description'>
        <Input v-model="standardData.abstracts" type="textarea" :rows="4" placeholder="请输入标准简介" style="width: 300px"></Input>
      </FormItem>   

      <FormItem label="销售价格" prop='price'>
        <Input v-model="standardData.price" placeholder="请输入标准销售价格" style="width: 300px"></Input>
      </FormItem>  

    </Form>
</template>
<script>
    import validator from '../../common/validate.js';
    export default {
        data() {
            const priceRules = (rule, value, callback) => {
                 let reg = /^[1-9]{1}\d{0,8}(.\d{1,2})?$|^0.\d{1,2}$/;
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
                standardDataRules: {
                    title: [{
                        required: true,
                        message: '请输入名称',
                        trigger: 'change'
                    }],
                    price: [{
                        validator: priceRules,
                        trigger: 'change'
                    }],
                },
                standardClassList: []
            }
        },
        props: ['standardData', 'updateStandardExecValid'],
        mounted() {
            this.standardClass()
        },
        methods: {
            /**
             * [standardClass 章节列表]
             * @Author   刘启瑞
             * @DateTime 2017-11-16
             * @param    {[type]}   page [description]
             * @return   {[type]}         [description]
             */
            standardClass() {
                this.standardClassList = [],
                    this.$http.get(this.ApiTransfer("/Category/ListByGroupName"), {
                        params: this.ApiTransfer("/Category/ListByGroupName", {
                            groupName: 'standard'
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            res.data.Data.map((item) => {
                                this.standardClassList.push({
                                    value: item.Id,
                                    label: item.Title,
                                })
                            })
                            //                            this.dataList = res.data.Data.ItemList;
                            //                            this.totalCount = res.data.Data.RecordCount;
                        }
                    })
            },
            returnData() {
                this.$emit('setParentData', this.standardData);
            },
            returnValidRes() {
                this.$refs.updateStandard.validate((valid) => {
                    this.$emit('setValidRes', {
                        valid,
                        modelType: 2
                    });
                })
            },
        },

        watch: {
            'standardData': {
                handler: function(nv) {
                    this.returnData();
                },
                deep: true
            },

            'updateStandardExecValid': function(nv) {
                this.returnValidRes();
            }
        }
    }

</script>
<style lang="less">


</style>
