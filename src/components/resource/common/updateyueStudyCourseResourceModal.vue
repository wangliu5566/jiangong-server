<template>
    <Form ref="updateSection" :model="yueStudyCourseResourceData" :label-width="120" inline :rules="yueStudyCourseResourceDataRules">
      

      <FormItem label="资源名称" prop='title'>
        <Input v-model="yueStudyCourseResourceData.title" placeholder="请输入资源名称" style="width: 300px"></Input>
      </FormItem> 
      <FormItem label="资源类型" prop='category'>
        <Select v-model="yueStudyCourseResourceData.category" style="width:300px">
            <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>  
      <FormItem label="内容摘要" prop='description'>
        <Input v-model="yueStudyCourseResourceData.abstracts" :rows="4"  type="textarea" placeholder="请输入简介" style="width: 300px"></Input>
      </FormItem>  
      <FormItem label="销售价格" prop='price'>
        <Input v-model="yueStudyCourseResourceData.price" placeholder="请输入销售价格" style="width: 300px"></Input>
      </FormItem> 
    </Form>
</template>
<script>
    import validator from '../../common/validate.js';
    export default {
        data() {
            const priceRules = (rule, value, callback) => {
                let reg = /^[1-9]{1}\d{0,8}(.\d{1,2})?$|^0.\d{1,2}$/
                if (value===0) {
                    callback();
                }else if (!value) {
                    callback(new Error('该项不能为空'));
                } else if (reg.test(value) || value == 0) {
                    callback()
                } else {
                    callback(new Error('请输入正确价格，最多有2位小数'));
                }
            };
            return {
                list:[],
                //验证规则
                yueStudyCourseResourceDataRules: {
                    title: [{
                        required: true,
                        message: '请输入标题',
                        trigger: 'change'
                    }],
                    price: [{
                         required: true,
                        validator: priceRules,
                        trigger: 'change'
                    }],
                },
            }
        },
        props: ['yueStudyCourseResourceData', 'updateSectionExecValid'],
        mounted() {
            this.updatayueStudyClass()
        },
        methods: {
             updatayueStudyClass() {
                this.$http.get(this.ApiTransfer("/Dictionary/ObjectTypes"), {
                        params: this.ApiTransfer("/Dictionary/ObjectTypes", {
                            cp: 1,
                            ps: 999999,
                            productId: 3
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                           res.data.Data.map((item) => {
                                this.list.push({
                                    value: parseInt(item.ObjectType),
                                    label: item.Description,
                                })
                               this.allClass+=item.ObjectType+','
                            })
                    this.getlist(1)
                        }
                    })
             },
            returnData() {
                this.$emit('setParentData', this.yueStudyCourseResourceData);
            },
            returnValidRes() {
                this.$refs.updateSection.validate((valid) => {
                    this.$emit('setValidRes', {
                        valid,
                        modelType: 2
                    });
                })
            },
        },

        watch: {
            'yueStudyCourseResourceData': {
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
