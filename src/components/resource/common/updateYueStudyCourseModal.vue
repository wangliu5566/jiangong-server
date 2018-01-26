<template>
    <Form ref="updateSection" :model="yueStudyCourseData" :label-width="120" inline :rules="yueStudyCourseDataRules">

<!--
      <FormItem label="课程名称" prop='title'>
        <Input v-model="yueStudyCourseData.title" placeholder="请输入课程名称" style="width: 300px"></Input>
      </FormItem>  

      <FormItem label="简介" prop='description'>
        <Input v-model="yueStudyCourseData.description" :rows="4" type="textarea" placeholder="请输入章节简介" style="width: 300px"></Input>
      </FormItem>  

      <FormItem label="分类"  prop='category'>
        <Select v-model="yueStudyCourseData.category" style="width:300px">
            <Option v-for="item in yueXueSubjectClassList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>  

      <FormItem label="其他责任者" prop='other'>
        <Input v-model="yueStudyCourseData.other" placeholder="请输入其他责任者" style="width: 300px"></Input>
      </FormItem>  
-->

   <FormItem label="销售价格" prop='price'>
        <Input v-model="yueStudyCourseData.price" placeholder="请输入销售价格" style="width: 300px"></Input>
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
                yueXueSubjectClassList:[],
                //验证规则
                yueStudyCourseDataRules: {
                     price: [{
                        validator: priceRules,
                        trigger: 'change'
                    }],
                },
            }
        },
        props: ['yueStudyCourseData', 'updateSectionExecValid'],
        mounted() {
//            this.yueXueSubjectClass()
        },
        methods: {
            /**
             * [packageClass 种类列表]
             * @Author   刘启瑞
             * @DateTime 2017-11-16
             * @param    {[type]}   page [description]
             * @return   {[type]}         [description]
             */
//            yueXueSubjectClass() {
//                this.yueXueSubjectClassList = [],
//                    this.$http.get(this.ApiTransfer("/Category/ListByGroupName"), {
//                        params: this.ApiTransfer("/Category/ListByGroupName", {
//                            groupName: 'YueXueSubject'
//                        })
//                    })
//                    .then((res) => {
//                        if (res.data.Success) {
//                            res.data.Data.map((item) => {
//                                this.yueXueSubjectClassList.push({
//                                    value: item.Id,
//                                    label: item.Title,
//                                })
//                            })
//                        }
//                    })
//            },
            returnData() {
                this.$emit('setParentData', this.yueStudyCourseData);
            },
            returnValidRes() {
                this.$refs.updateSection.validate((valid) => {
                    this.$emit('setValidRes', {
                        valid
                    });
                })
            },
        },

        watch: {
            'yueStudyCourseData': {
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
