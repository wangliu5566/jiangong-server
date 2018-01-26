<template>
    <Form ref="updateSection" :model="yueReadBookData" :label-width="120" inline :rules="yueReadBookDataRules">

      <FormItem label="图书名称" prop='title'>
        <Input v-model="yueReadBookData.title" placeholder="请输入图书名称" style="width: 200px"></Input>
      </FormItem>  

      <FormItem label="作者" prop='author'>
        <Input v-model="yueReadBookData.author" placeholder="请输入作者" style="width: 200px"></Input>
      </FormItem>  

      <FormItem label="其他责任者" prop='other'>
        <Input v-model="yueReadBookData.other" placeholder="请输入其他责任者" style="width: 200px"></Input>
      </FormItem>  

      <FormItem label="出版社" prop='publisher'>
        <Input v-model="yueReadBookData.publisher" placeholder="请输入图书出版社" style="width: 200px"></Input>
      </FormItem>  

      <FormItem label="出版日期" prop='publishTime'>
         <DatePicker   
          v-model="yueReadBookData.publishTime" 
          format="yyyy-MM-dd"
           type="date"
           placeholder="Select date"
            style="width: 200px"></DatePicker>
      </FormItem>  

      <FormItem label="ISBN" prop='ISBN'>
        <Input v-model="yueReadBookData.ISBN" placeholder="请输入ISBN" style="width: 200px"></Input>
      </FormItem>

      <FormItem label="纸书定价(元)" prop='price'>
        <Input v-model="yueReadBookData.price" placeholder="请输入纸书定价" style="width: 200px"></Input>
      </FormItem>  
       <FormItem label="电子版售价(元)" prop='CurrentPrice'>
        <Input v-model="yueReadBookData.CurrentPrice" placeholder="请输入纸书定价" style="width: 200px"></Input>
      </FormItem>   

      <FormItem label="授权时间" prop='authorizeTime'>
        <DatePicker 
         v-model="yueReadBookData.authorizeTime" 
        format="yyyy/MM/dd"
                    type="daterange"
        placeholder="选择授权日期" 
        style="width: 200px"
         >
          
        </DatePicker>
      </FormItem>  
       <FormItem label="纸书购买链接" >
        <Input v-model="yueReadBookData.PaperLink" placeholder="请输入纸书购买链接" style="width: 535px"></Input>
      </FormItem>

      <FormItem label="关键字" prop='keywords'>
        <Input v-model="yueReadBookData.keywords.key1" placeholder="关键字1" style="width: 200px;margin:10px 10px 0 0"></Input>
        <Input v-model="yueReadBookData.keywords.key2" placeholder="关键字2" style="width: 200px;margin:10px 10px 0 0"></Input>
        <Input v-model="yueReadBookData.keywords.key3" placeholder="关键字3" style="width: 200px;margin:10px 10px 0 0"></Input>
        <Input v-model="yueReadBookData.keywords.key4" placeholder="关键字4" style="width: 200px;margin:10px 10px 0 0"></Input>
      </FormItem>  
        <FormItem label="现分类" style="width:450px;" >
        <p>{{yueReadBookData.CategoryPath}}</p>
      </FormItem>
      <FormItem label="修改分类" >
        <Cascader :data="yueReadCalssList" @on-change='selectChange' v-model="yueReadBookData.CategoryId" change-on-select style="width:250px;" :load-data="loadData"></Cascader>
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
            const paperPriceRules = (rule, value, callback) => {
                let reg = /^[1-9]{1}\d{0,8}(.\d{1,2})?$|^0.\d{1,2}$/
//                console.log(value)
                 
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
                yueReadCalssList:[],

                //中图分类数据
                zhongtuCate1: '',
                zhongtuCate2: '',
                zhongtuCate3: '',
                //验证规则
                yueReadBookDataRules: {
                    title: [{
                        required: true,
                        message: '请输入标题',
                        trigger: 'change'
                    }],
                    CurrentPrice: [{
                        validator: priceRules,
                        trigger: 'change'
                    }],
                    price: [{
                        validator: paperPriceRules,
                        trigger: 'change'
                    }],
                },

            }
        },
        mounted() {
            this.yueReadCalss()
        },
        props: ['yueReadBookData', 'updateYueReadBookExecValid'],
        methods: {
             selectChange(value, selectedData) {
//                console.log(selectedData.length)
                this.select = selectedData.length>0?selectedData.pop().__label:''
            },
            returnData() {
                this.$emit('setParentData', this.select);
            },
            returnValidRes() {
                this.$refs.updateSection.validate((valid) => {
                    this.$emit('setValidRes', {
                        valid,
                        modelType: 2
                    });
                })
            },
            yueReadCalss() {
                this.yueReadCalssList = [],
                    this.$http.get(this.ApiTransfer("/Category/ListByGroupName"), {
                        params: this.ApiTransfer("/Category/ListByGroupName", {
                            groupName: 'YueDuBook'
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            res.data.Data.map((item) => {
                                this.yueReadCalssList.push({
                                    value: item.Id,
                                    label: item.Title,
                                    children: [],
                                    loading: false
                                })
                            })
                        }
                    })
            },
            loadData(data, callback) {
                data.loading = true;
                this.$http.get(this.ApiTransfer("/Category/ChildList"), {
                        params: this.ApiTransfer("/Category/ChildList", {
                            parentId: data.value,
                            productId: 2
                        })
                    })
                    .then((res) => {
                        if (res.data.Success) {
                            res.data.Data.ItemList.map((item) => {
                                if (item.ChildCount > 1) {
                                    data.children.push({
                                        value: item.Id,
                                        label: item.Title,
                                        children: [],
                                        loading: false
                                    })
                                } else {
                                    data.children.push({
                                        value: item.Id,
                                        label: item.Title,
                                    })
                                }
                            })
                            data.loading = false;
                            callback();
                        }
                    })
            }
        },

        watch: {
            'yueReadBookData': {
                handler: function(nv) {
                    this.returnData();
                },
                deep: true
            },

            'updateYueReadBookExecValid': function(nv) {
                this.returnValidRes();
            }
        }
    }

</script>
<style lang="less">


</style>
