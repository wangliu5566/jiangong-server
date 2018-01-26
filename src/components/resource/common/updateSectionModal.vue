<template>
    <Form ref="updateSection" :model="sectionData" :label-width="120" :rules="sectionDataRules">
      <FormItem label="章节名称" prop='title'>
        <Input v-model="sectionData.title" placeholder="请输入章节名称" style="width: 300px"></Input>
      </FormItem>  

      <FormItem label="内容摘要" prop='description'>
        <Input v-model="sectionData.description" :rows="4" type="textarea" placeholder="请输入章节简介" style="width: 300px"></Input>
      </FormItem>  

      <FormItem label="分类" prop='category'>
        <Select v-model="sectionData.category" style="width:300px">
            <Option v-for="item in chapterClassList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
<!--        <Input v-model="sectionData.category" placeholder="请输入章节分类" style="width: 300px"></Input>-->
      </FormItem>  

      <FormItem label="销售价格" prop='price'>
        <Input v-model="sectionData.price" placeholder="请输入章节销售价格" style="width: 300px"></Input>
      </FormItem>  

      <FormItem label="来源" prop='resource'>
        <Input v-model="sectionData.resource" disabled placeholder="" style="width: 300px"></Input>
      </FormItem>  
<!--

      <FormItem label="图书名称" prop='bookName'>
        <Input v-model="sectionData.bookName" placeholder="请输入图书名称" style="width: 300px"></Input>
      </FormItem>  
-->

      <FormItem label="书号" prop='bookNumber'>
        <Input v-model="sectionData.bookNumber" disabled placeholder="" style="width: 300px"></Input>
      </FormItem>  

    </Form>
</template>
<script>
    import validator from '../../common/validate.js';
    export default {
        data() {
            const priceRules = (rule, value, callback) => {
                let reg = /^[1-9]{1}\d{0,8}(.\d{1,2})?$|^0.\d{1,2}$/
//                console.log(value)
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
                sectionDataRules: {
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
                chapterClassList: []
            }
        },
        mounted() {
            this.chapterClass()
        },
        props: ['sectionData', 'updateSectionExecValid'],
        methods: {
            /**
             * [chapterClass 章节列表]
             * @Author   刘启瑞
             * @DateTime 2017-11-16
             * @param    {[type]}   page [description]
             * @return   {[type]}         [description]
             */
            chapterClass() {
                this.chapterClassList = [],
                    this.$http.get(this.ApiTransfer("/Category/ListByGroupName"), {
                        params: this.ApiTransfer("/Category/ListByGroupName", {
                            groupName: 'learning'
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            res.data.Data.map((item) => {
                                this.chapterClassList.push({
                                    value: item.Id,
                                    label: item.Title,
                                })
                            })
                        }
                    })
            },
            returnData() {
                this.$emit('setParentData', this.sectionData);
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
            'sectionData': {
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
