<template>
  <div class="add-activity">
    <h3 v-if="addUpdate==1">新建策略</h3>
    <h3 v-if="addUpdate==2">修改策略</h3>
    <!-- <span @click="goBack" class="float-right"><Icon type="android-close" ></Icon></span> -->
    <!-- 新增活动 -->
    <Form :model="addNewActivity" :label-width="110" ref="formInline" :rules="ruleInline">
      <FormItem label="策略名称:" prop="Title">
        <Input v-model="addNewActivity.Title" placeholder="请输入策略名称"></Input>
      </FormItem>
      <FormItem label="策略描述:" prop="Description">
        <Input v-model="addNewActivity.Description" type="textarea" :autosize="{minRows: 2,maxRows: 7}" placeholder="请输入策略描述"></Input>
      </FormItem>
      <FormItem label="策略时间:" prop="Time">
        <DatePicker type="daterange" placement="bottom-start" :value="dateValue" placeholder="请输入策略时间" confirm @on-change="handleChange" @on-clear="openDate = false" @on-ok="handleOk"></DatePicker>
      </FormItem>
      <FormItem label="策略规则:" prop="Strategy">
        <Select v-model="addNewActivity.StrategyType">
          <Option v-for="item in strategy" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
      </FormItem>
      <FormItem label="">
        <div v-if="addNewActivity.StrategyType==1">
          <Form ref="formDynamic" :model="formDynamic" style="margin-top: 0">
            <div v-for="(item,index) in formDynamic.Content" key='index' class="case-row">
              <Row>
                <Col span="2"> 满：
                </Col>
                <Col span="8">
                <FormItem :prop="'Content.' + index + '.x'" :rules="checkPrice">
                  <Input v-model="item.x" placeholder="请输入价格"></Input>
                </FormItem>
                </Col>
                <Col span="4" style="text-align:center">- 减：</Col>
                <Col span="8">
                <FormItem :prop="'Content.' + index + '.y'" :rules="checkPrice">
                  <Input v-model="item.y" placeholder="请输入价格"></Input>
                </FormItem>
                </Col>
                <Col span='1'>
                <Icon color='red' style='margin-left: 10px;cursor:pointer;' type="close-round" @click.native="delcase(index)"></Icon>
                </Col>
              </Row>
            </div>
            <Row>
              <Col span='6'>
              <Button type="info" long @click="addcase('add')">
                <Icon type="plus-round" size='20'></Icon>
              </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div v-if="addNewActivity.StrategyType==2">
          <Form ref="formDynamic1" :model="formDynamic1" :label-width="80" style="margin-top: 0">
            <div v-for="(item,index) in formDynamic1.Content" key='index' class="case-row">
              <Row>
                <Col span="2"> 满：
                </Col>
                <Col span="9">
                <FormItem :prop="'Content.' + index + '.x'" :rules="checkPrice">
                  <Input v-model="item.x" placeholder="请输入价格"></Input>
                </FormItem>
                </Col>
                <Col span="3" style="text-align:center">- 打折：</Col>
                <Col span="9">
                <FormItem :prop="'Content.' + index + '.y'" :rules="Percentage">
                  <Input v-model="item.y" placeholder="请输入折扣，如95折=0.95"></Input>
                </FormItem>
                </Col>
                <Col span='1'>
                <Icon color='red' style='margin-left: 10px;cursor:pointer;' type="close-round" @click.native="delcase(index)"></Icon>
                </Col>
              </Row>
            </div>
            <Row>
              <Col span='6'>
              <Button type="info" long @click="addcase('add')">
                <Icon type="plus-round" size='20'></Icon>
              </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div v-if="addNewActivity.StrategyType==3">
          <Row>
            <Col span="2"> 折 扣:
            </Col>
            <Col span='22'>
            <FormItem prop="formPercentage">
              <Input v-model="addNewActivity.Content1[0].y" placeholder="请输入折扣，比如：95折=0.95"></Input>
            </FormItem>
            </Col>
          </Row>
        </div>
      </FormItem>
    </Form>
    <div style="text-align: center;width:90%">
      <Button class="btns" type="primary" @click="handleSubmit('formInline')">确定</Button>
      <Button type="ghost" @click="goBack()">取消</Button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const validateStrategy = (rule, value, callback) => {
      if (!!this.addNewActivity.StrategyType) {
        callback();
      } else {
        callback(new Error('请选择规则'));
      }
    };
    const validateTime = (rule, value, callback) => {
      if (this.dateValue.length > 0) {
        callback();
      } else {
        callback(new Error('请选择时间'));
      }
    };

    const validatePrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入价格'));
      } else if (!parseFloat(value) && parseFloat(value) != 0) {
        return callback(new Error('售价请输入阿拉伯数字'));
      } else {
        if (value < 0 || value > 100000) {
          return callback(new Error('请输入0-10万的售价'));
        } else if (value.indexOf('.') > 0 && value.split('.')[1].length > 2) {
          return callback(new Error('售价最多有两位小数'));
        } else {
          callback();
        }
      }
    };
    const validatePercentage = (rule, value, callback) => {
      value = value.trim();
      var valNumber = value * 1
      if (value == '') {
        return callback(new Error('请输入折扣'));
      } else if (value == 0) {
        callback();
      } else {
        if (!valNumber) {
          return callback(new Error('请输入正确的折扣'));
        } else {
          if (valNumber < 0 || valNumber > 1) {
            return callback(new Error('请输入0-1的折扣'));
          } else if (value.indexOf('.') > 0 && value.split('.')[1].length > 2) {
            return callback(new Error('折扣最多有两位小数'));
          } else {
            callback();
          }
        }
      }
    };
    const validateformPercentage = (rule, value, callback) => {
      var val = this.addNewActivity.Content1[0].y
      val = val.trim();
      var valNumber = val * 1
      if (val == '') {
        return callback(new Error('请输入折扣'));
      } else if (val == 0) {
        callback();
      } else {
        if (!valNumber) {
          return callback(new Error('请输入正确的折扣'));
        } else {
          if (valNumber < 0 || valNumber > 1) {
            return callback(new Error('请输入0-1的折扣'));
          } else if (val.indexOf('.') > 0 && val.split('.')[1].length > 2) {
            return callback(new Error('折扣最多有两位小数'));
          } else {
            callback();
          }
        }
      }
    };
    const validateTitle = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('请填写策略名称'));
      } else if (value.trim().length > 60) {
        return callback(new Error('策略名称长度不能超过60'));
      } else {
        callback()
      }
    };
    const validateContent = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('请填写策略描述'));
      } else if (value.trim().length > 200) {
        return callback(new Error('策略描述长度不能超过200'));
      } else {
        callback()
      }
    };
    return {
      dateValue: '',
      startTime: '',
      endTime: "",
      strategy: [],
      index: 1,
      addNewActivity: {
        Title: '',
        Description: '',
        StrategyType: 1,
        Content: [{ x: '', y: '' }],
        Content1: [{ x: '', y: '' }] //折扣
      },
      formDynamic: {
        Content: [{ x: '', y: '' }] //满减
      },
      formDynamic1: {
        Content: [{ x: '', y: '' }] //满折扣
      },
      ruleInline: {
        Title: [
          { required: true, validator: validateTitle, trigger: 'change' },
        ],
        Description: [
          { required: true, validator: validateContent, trigger: 'change' },
        ],
        Time: [
          { required: true, validator: validateTime, trigger: 'change' },
        ],
        Strategy: [
          { required: true, validator: validateStrategy, trigger: 'blur' },
        ],
        formPercentage: [
          { required: true, validator: validateformPercentage, trigger: 'change' }
        ],
      },
      checkPrice: [
        { required: true, validator: validatePrice, trigger: 'blur' }
      ],
      Percentage: [
        { required: true, validator: validatePercentage, trigger: 'blur' }
      ],
    }
  },
  props: ['addUpdate', 'activeObj'],
  mounted() {
    this.strategylist()
    this.addNewActivity = this.activeObj

    if (this.addUpdate == 2) { //修改
      var arr = []
      arr.push(this.addNewActivity.StartTime.slice(0, 10))
      arr.push(this.addNewActivity.EndTime.slice(0, 10))
      this.dateValue = arr
      if (typeof this.addNewActivity.Content != 'object') {
        this.addNewActivity.Content = JSON.parse(this.addNewActivity.Content)
      }
      this.addNewActivity = Object.assign({}, this.addNewActivity, {
        Content1: [{ x: '', y: '' }],
      })

      if (this.addNewActivity.StrategyType == 1) {
        this.formDynamic.Content = this.addNewActivity.Content
      } else if (this.addNewActivity.StrategyType == 2) {
        this.formDynamic1.Content = this.addNewActivity.Content
      } else if (this.addNewActivity.StrategyType == 3) {
        this.addNewActivity.Content1 = this.addNewActivity.Content
      }
    } else if (this.addUpdate == 1) { //新增
      this.addNewActivity = {
        Title: '',
        Description: '',
        StrategyType: 1,
        Content: [{ x: '', y: '' }],
        Content1: [{ x: '', y: '' }],
      }
    }
  },
  methods: {
    /**
     * [handleChange 处理日期赋值]
     * @Author   王柳
     * @DateTime 2017-11-19
     * @param    {[type]}   date [description]
     * @return   {[type]}        [description]
     */
    handleChange(date) {
      this.dateValue = date;
    },
    /**
     * [handleOk 处理日期值，请求数据]
     * @Author   王柳
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    handleOk() {
      this.openDate = false;
      this.startTime = this.dateValue[0];
      this.endTime = this.dateValue[1];
    },
    /**
     * [addcase 新增策略框]
     * @Author   刘启瑞
     * @DateTime 2017-11-24
     * @param    {[type]}   name [description]
     * @return   {[type]}        [description]
     */
    addcase(type) {
      if (this.addNewActivity.StrategyType == 1) {
        this.formDynamic.Content.push({
          x: '',
          y: ''
        })
      } else if (this.addNewActivity.StrategyType == 2) {
        this.formDynamic1.Content.push({
          x: '',
          y: ''
        })
      } else if (this.addNewActivity.StrategyType == 3) {
        this.addNewActivity.Content1.push({
          x: '',
          y: ''
        })
      }
    },
    /**
     * [delcase 删除策略框]
     * @Author   刘启瑞
     * @DateTime 2017-11-24
     * @param    {[type]}   name [description]
     * @return   {[type]}        [description]
     */
    delcase(index) {
      if (this.addNewActivity.StrategyType == 1) {
        if (this.formDynamic.Content.length == 1) {
          this.formDynamic.Content.splice(index, 1);
          this.formDynamic.Content.push({
            x: '',
            y: '',
          })
        } else {
          this.formDynamic.Content.splice(index, 1)
        }
      } else if (this.addNewActivity.StrategyType == 2) {
        if (this.formDynamic1.Content.length == 1) {
          this.formDynamic1.Content.splice(index, 1);
          this.formDynamic1.Content.push({
            x: '',
            y: '',
          })
        } else {
          this.formDynamic1.Content.splice(index, 1)
        }
      } else if (this.addNewActivity.StrategyType == 3) {
        if (this.addNewActivity.Content1.length == 1) {
          this.addNewActivity.Content1.splice(index, 1);
          this.addNewActivity.Content1.push({
            x: '',
            y: '',
          })
        } else {
          this.addNewActivity.Content1.splice(index, 1)
        }
      }
    },
    /**
     * [strategylist 策略列表]
     * @Author   刘启瑞
     * @DateTime 2017-11-24
     * @param    {[type]}   name [description]
     * @return   {[type]}        [description]
     */
    strategylist() {
      this.$http.get(this.ApiTransfer("/StrategyType/List"), {
          params: this.ApiTransfer("/StrategyType/List", {})
        })
        .then((res) => {
          if (res.data.Success) {
            this.strategy = res.data.Data.map((item) => {
              return {
                id: item.Id,
                title: item.Title
              }
            })
          }
        })
    },
    /**
     * [Create 新增的函数]
     * @Author   王柳
     * @DateTime 2017-12-05
     */
    Create() {
      this.$http.post(this.ApiTransfer("/SaleStrategy/Create"), this.ApiTransfer("/SaleStrategy/Create", {
          title: this.addNewActivity.Title,
          description: this.addNewActivity.Description,
          startTime: this.dateValue[0],
          endTime: this.dateValue[1],
          strategyType: this.addNewActivity.StrategyType,
          content: this.addNewActivity.StrategyType == 1 ? JSON.stringify(this.formDynamic.Content) : this.addNewActivity.StrategyType == 2 ? JSON.stringify(this.formDynamic1.Content) : JSON.stringify(this.addNewActivity.Content1)
        }))
        .then((res) => {
          if (res.data.Success) {
            this.$Message.success('策略增加成功');
            this.goBack()
          }
        })
    },
    /**
     * [handleSubmit 新增或修改]
     * @Author   王柳
     * @DateTime 2017-11-19
     * @param    {[type]}   name [description]
     * @return   {[type]}        [description]
     */
    handleSubmit(name) {
      if (this.addUpdate == 1) {
        if (this.addNewActivity.StrategyType == 1) {
          this.$refs['formDynamic'].validate()
        } else if (this.addNewActivity.StrategyType == 2) {
          this.$refs['formDynamic1'].validate()
        }

        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.addNewActivity.StrategyType == 3) {
              this.Create()
            } else if (this.addNewActivity.StrategyType == 1) {
              this.$refs['formDynamic'].validate((valid) => {
                if (valid) {
                  this.Create()
                }
              })
            } else if (this.addNewActivity.StrategyType == 2) {
              this.$refs['formDynamic1'].validate((valid) => {
                if (valid) {
                  this.Create()
                }
              })
            }
          }
        })
      } else if (this.addUpdate == 2) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.addNewActivity.StrategyType == 3) {
              this.update()
            } else if (this.addNewActivity.StrategyType == 1) {
              this.$refs['formDynamic'].validate((valid) => {
                if (valid) {
                  this.update()
                }
              })
            } else if (this.addNewActivity.StrategyType == 2) {
              this.$refs['formDynamic1'].validate((valid) => {
                if (valid) {
                  this.update()
                }
              })
            }
          }
        })
      }
    },
    /**
     * [update 修改策略]
     * @Author   王柳
     * @DateTime 2017-12-05
     * @return   {[type]}   [description]
     */
    update() {
      this.$http.post(this.ApiTransfer("/SaleStrategy/Update"), this.ApiTransfer("/SaleStrategy/Update", {
          id: this.addNewActivity.Id,
          title: this.addNewActivity.Title,
          description: this.addNewActivity.Description,
          startTime: this.dateValue[0],
          endTime: this.dateValue[1],
          strategyType: this.addNewActivity.StrategyType,
          content: this.addNewActivity.StrategyType == 1 ? JSON.stringify(this.formDynamic.Content) : this.addNewActivity.StrategyType == 2 ? JSON.stringify(this.formDynamic1.Content) : JSON.stringify(this.addNewActivity.Content1)
        }))
        .then((res) => {
          if (res.data.Success) {
            this.$Message.success('策略修改成功');
            this.goBack()
          }
        })
    },
    /**
     * [goBack 关闭模态框和重新请求数据]
     * @Author   王柳
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    goBack() {
      this.$emit('returnListPage')
    },
  },
  watch: {
    'addNewActivity.StrategyType': function(val, old) {
      if (this.addUpdate == 1) { //新增的时候有这个bug
        if (val == 1 && old == 2) {
          this.$refs['formDynamic1'].resetFields();
        } else if (val == 2 && old == 1) {
          this.$refs['formDynamic'].resetFields();
        }
      }
    }
  }
}

</script>
<style lang="less">
.add-activity {

  h3 {
    font-size: 18px;
  }
  .case-row {
    margin-bottom: 25px
  }
  .call-back {
    float: left;
    margin: 12px 45px;
  }

  .float-right {
    float: right;
    margin-top: -60px;
    font-size: 25px;
    margin-right: 20px;
    cursor: pointer;
    .ivu-icon {
      font-weight: 700;
    }
  }

  .ivu-form {
    margin-top: 40px;
  }

  .ivu-date-picker {
    display: block;
  }
  .ivu-modal-footer {
    display: none;
  }
}

</style>
