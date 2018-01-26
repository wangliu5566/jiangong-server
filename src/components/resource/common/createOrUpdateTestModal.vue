<template>
    <Form ref="createUpdateTestData" :model="createUpdateTestData" :label-width="120" :rules="createUpdateTestDataRules">
<!--
      <FormItem label="科目" prop='category'>
        <Select v-model="createUpdateTestData.category" style="width:85%">
            <Option :value="item.value" :key="item.value" v-for="item in category">{{item.title}}</Option>
        </Select>
      </FormItem> 
-->

       <FormItem label="试卷标题" prop='title'>
        <Input v-model="createUpdateTestData.title" placeholder="请输入试卷标题" style="width: 85%"></Input>
      </FormItem>  
        <Row>
                <Col span="10">
                <FormItem label="单选"  prop="radio">
                    <Input type="text" style="width:100px" v-model="createUpdateTestData.radio.num" ></Input>
                 </FormItem>
               </Col>
               <Col span="8">
                <FormItem label="分值"  >
                    <Select v-model="createUpdateTestData.radio.score" style="width:100px" :on-change="setTotalNumAndScore()">
                          <Option  v-for="(citem,cindex) in testTypeData[0].score" :value="citem" :key="cindex">{{citem}}</Option>
                      </Select>
                 </FormItem>
               </Col>
         </Row>
      <Row>
                <Col span="10">
                <FormItem label="多选"  prop="multiple">
                    <Input type="text" style="width:100px" v-model="createUpdateTestData.multiple.num" ></Input>
                 </FormItem>
               </Col>
               <Col span="8">
                <FormItem label="分值"  >
                    <Select v-model="createUpdateTestData.multiple .score" style="width:100px" :on-change="setTotalNumAndScore()">
                          <Option  v-for="(citem,cindex) in testTypeData[1].score" :value="citem" :key="cindex">{{citem}}</Option>
                      </Select>
                 </FormItem>
               </Col>
         </Row>
         <Row>
                <Col span="10">
                <FormItem label="判断"  prop="judge">
                    <Input type="text" style="width:100px" v-model="createUpdateTestData.judge.num" ></Input>
                 </FormItem>
               </Col>
               <Col span="8">
                <FormItem label="分值"  >
                    <Select v-model="createUpdateTestData.judge.score" style="width:100px" :on-change="setTotalNumAndScore()">
                          <Option  v-for="(citem,cindex) in testTypeData[2].score" :value="citem" :key="cindex">{{citem}}</Option>
                      </Select>
                 </FormItem>
               </Col>
         </Row>
         <Row>
                <Col span="10">
                <FormItem label="问答"  prop="question">
                    <Input type="text" style="width:100px" v-model="createUpdateTestData.question.num" ></Input>
                 </FormItem>
               </Col>
               <Col span="8">
                <FormItem label="分值"  >
                    <Select v-model="createUpdateTestData.question.score" style="width:100px" :on-change="setTotalNumAndScore()">
                          <Option  v-for="(citem,cindex) in testTypeData[3].score" :value="citem" :key="cindex">{{citem}}</Option>
                      </Select>
                 </FormItem>
               </Col>
         </Row>
       
      <!-- 分值 -->
      <FormItem label="总分值" >
            &nbsp;&nbsp; {{createUpdateTestData.totalNumAndScore}} 分
      </FormItem>  
      <!-- 考试时长 -->
<!--
      <FormItem label="考试时长" prop='time'>
              <Input v-model="createUpdateTestData.time"   placeholder="考试时长" style="width: 100px"></Input>&nbsp;&nbsp;分钟
      </FormItem>  
-->

 
    </Form>
</template>
<script>
    import validator from '../../common/validate.js';
    export default {
        data() {
            const timeRules = (rule, value, callback) => {
                let reg = /^\+?[1-9][0-9]*$/
                if (reg.test(value) || value == 0) {
                    callback()
                } else {
                    callback(new Error('请输入正确数字'));
                }
            };
            const radioRules = (rule, value, callback) => {
                let reg = /^\+?[1-9][0-9]*$/
                if (!value.num) {
                    callback(new Error('该项不能为空'));
                } else if (reg.test(parseFloat(value.num)) || value.num == 0) {
                    callback()
                } else {
                    callback(new Error('请输入正确数字'));
                }
            };
            const multipleRules = (rule, value, callback) => {
                let reg = /^\+?[1-9][0-9]*$/
                if (!value.num) {
                    callback(new Error('该项不能为空'));
                } else if (reg.test(parseFloat(value.num)) || value.num == 0) {
                    callback()
                } else {
                    callback(new Error('请输入正确数字'));
                }
            };
            const judgeRules = (rule, value, callback) => {
                let reg = /^\+?[1-9][0-9]*$/
                if (!value.num) {
                    callback(new Error('该项不能为空'));
                } else if (reg.test(parseFloat(value.num)) || value.num == 0) {
                    callback()
                } else {
                    callback(new Error('请输入正确数字'));
                }
            };
            const questionRules = (rule, value, callback) => {
                let reg = /^\+?[1-9][0-9]*$/
                if (!value.num) {
                    callback(new Error('该项不能为空'));
                } else if (reg.test(parseFloat(value.num)) || value.num == 0) {
                    callback()
                } else {
                    callback(new Error('请输入正确数字'));
                }
            };
            
            return {
                //科目数据
                category: [{
                    title: '科目1',
                    value: '科目1',
                }, {
                    title: '科目2',
                    value: '科目2',
                }],

                //题型数据
                testTypeData: [{
                        title: '单选',
                        prop: 'radio',
                        num: '0',
                        score: ['1', '2', '3', '4']
                    },
                    {
                        title: '多选',
                        prop: 'multiple',
                        num: '0',
                        score: ['1', '2', '3', '4']
                    },
                    {
                        title: '判断',
                        prop: 'judge',
                        num: '0',
                        score: ['1', '2', '3', '4']
                    },
                    {
                        title: '问答',
                        prop: 'question',
                        num: '0',
                        score: ['5', '10']
                    }
                ],
                //验证规则
                createUpdateTestDataRules: {
                    title: [{
                        required: true,
                        message: '请输入试卷标题',
                        trigger: 'blur'
                    }],
                    radio: [{
                        validator: radioRules,
                        trigger: 'change'
                    }],
                    multiple: [{
                        validator: multipleRules,
                        trigger: 'change'
                    }],
                    judge: [{
                        validator: judgeRules,
                        trigger: 'change'
                    }],
                    question: [{
                        validator: questionRules,
                        trigger: 'change'
                    }],
                    time: [{
                        required: true,
                        message: '该项不能为空',
                        trigger: 'change'
                    }, {
                        validator: timeRules,
                        trigger: 'change'
                    }],
                },
            }
        },
        props: ['createUpdateTestData', 'createOrUpdateTestValid'],
        methods: {
            returnData() {
                this.$emit('setParentData', this.createUpdateTestData);
            },
            returnValidRes() {
                this.$refs.createUpdateTestData.validate((valid) => {
                    this.$emit('setValidRes', {
                        valid,
                        modelType: 2
                    });
                })
            },

            /**
             * [setTotalNumAndScore 每次任一select框值改变，都会触发总分值和数量发生更新]
             * @Author   罗文
             * @DateTime 2017-11-19
             */
            setTotalNumAndScore() {
                let countTest = 0;
                let countScore = 0;
                let keys = ['radio', 'multiple', 'judge', 'question'];

                keys.forEach((item, index) => {
                    countTest += this.createUpdateTestData[item].num;
                    countScore += this.createUpdateTestData[item].num * this.createUpdateTestData[item].score;
                })

                this.createUpdateTestData.totalNumAndScore = countScore;
            }
        },
        watch: {
            'createUpdateTestData': {
                handler: function(nv) {
                    this.returnData();
                },
                deep: true
            },

            'createOrUpdateTestValid': function(nv) {
                this.returnValidRes();
            }
        }
    }

</script>
<style lang="less">
    .test-num-score {
        display: inline-block;
        margin-left: 100px;
    }

</style>
