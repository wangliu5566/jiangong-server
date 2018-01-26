<template>
    <Form :model="exerciseDetailData" :label-width="120" >
<!--
      <FormItem label="所在学科：" >
        {{exerciseDetailData.subject}}
      </FormItem>
       <FormItem label="题型：">
        {{exerciseDetailData.testQuestionType}}
      </FormItem>
       <FormItem label="分值：" >
        {{exerciseDetailData.score}} 分
      </FormItem>
-->

      <FormItem label="题干：" >
        <span v-html='exerciseDetailData.title'></span>
      </FormItem>
<!--

       <FormItem label="习题内容：" prop='content'>
        <p v-for="(item,index) in keys">{{item}}:{{keyValue[index]}}</p>    
      </FormItem>
-->
      <FormItem label="正确答案：" prop='content'>
<!--        <p v-for="(item,index) in keys">{{item}}:{{keyValue[index]}}</p>    -->
      </FormItem>
    <FormItem label="答案解析：" prop='content'>
<!--        <p v-for="(item,index) in keys">{{item}}:{{keyValue[index]}}</p>    -->
      </FormItem>


    </Form>
</template>
<script>
    export default {
        data() {
            return {
                keys: [], //定义一个数组用来接受key  
                keyValue: [], //定义一个数组用来接受value  
            }
        },
        props: ['exerciseDetailData'],
        methods: {
            compile() {
//                                console.log(this.exerciseDetailData)        
                this.keys = []; //定义一个数组用来接受key  
                var values = []; //定义一个数组用来接受value  
                var dataObject = this.exerciseDetailData.content
                for (var key in dataObject) {
                    this.keys.push(key);
                    values.push(dataObject[key]); //取得value   
                }
                this.keyValue=values.map((item) => {
                  return  item.replace(/<.*?>/ig, "")
                })
//                                console.log( this.keys , this.keyValue)
            }
        },
        watch: {
            'exerciseDetailData': {
                handler: function(nv) {
//                    this.compile();
                },
                deep: true
            },

        }
    }

</script>
<style lang="less">


</style>
