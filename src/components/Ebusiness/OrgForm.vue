<template>
  <div class="org-form">
    <!-- 线下导入 -->
    <div v-if="changeShow==1">
      <p slot="header" style="text-align:center;color:#333;">文件导入</p>
      <Row style="margin-top: 15px;">
        <Col span="8" style='text-align: right;line-height: 40px;padding-right: 15px;'>上传文件：</Col>
        <Col span="16">
        <Upload :action="baseUrl+'/Hierarchy/ImportWordData'" :before-upload="handleUpload" :format="['zip','rar']">
          <Button type="ghost" icon="ios-cloud-upload-outline">请上传zip格式的压缩包</Button>
        </Upload>
        <div v-if="file !== null">{{ file.name }}</div>
        </Col>
      </Row>
      <Spin fix v-if="loadingStatus">
        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
      <div style="margin-top: 20px;text-align: right;" v-if="showNextBtn==1">
        <Button type="ghost" @click="childrenEmit(2)">取消</Button>
        <Button type="primary" @click="importData" :loading="loadingStatus">导入</Button>
      </div>
      <div style="margin-top: 20px;text-align: right;" v-if="showNextBtn==2">
        <Button type="ghost" @click="childrenEmit(2)">取消</Button>
        <Button type="primary" @click="nextDo(2)">下一步</Button>
      </div>
    </div>
    <!-- 新增订单 -->
    <div v-if="changeShow==2" style='margin-top: 20px;overflow:hidden;'>
      <p slot="header" style="text-align:center;color:#333;">新增订单</p>
      <Form :model="addOrderObj" :label-width="110" ref="formInline" :rules="ruleInline">
        <FormItem label="购买机构:" prop="OrganizationTitle">
          <Select v-model="addOrderObj.OrganizationTitle">
            <Option v-for="item in organizationList" :value="item.Id" :key="item.Id">{{ item.Title }}</Option>
          </Select>
        </FormItem>
        <FormItem label="授权有效期:" prop="Time">
          <DatePicker :value="dateValue" type="daterange" placement="bottom-start" placeholder="请选择订单创建时间" :options="dateOptions" style="width:100%" @on-change="handleChange"></DatePicker>
        </FormItem>
        <FormItem label="订单总额:" prop="TotalMoney">
          <Input v-model="addOrderObj.TotalMoney" placeholder="请输入订单总额"></Input>
        </FormItem>
        <FormItem label="销售员:" prop="SaleMan">
          <Input v-model="addOrderObj.SaleMan" placeholder="请输入销售员"></Input>
        </FormItem>
        <FormItem label="应用名称:" prop="ProductId">
          <Select v-model="addOrderObj.ProductId">
            <!-- <Option v-for="item in productList" :value="item.Id" :key="item.Id">{{ item.Title }}</Option> -->
            <Option value="1" disabled>i施工</Option>
            <Option value="2">统一APP</Option>
          </Select>
        </FormItem>
      </Form>
      <div style="margin-top: 90px;text-align: center;">
        <Button type="ghost" @click="nextDo(1)">上一步</Button>
        <Button type="primary" @click="addOrderFn('formInline')">确定</Button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const validateTime = (rule, value, callback) => {
      if (this.dateValue.length > 0) {
        callback();
      } else {
        callback(new Error('请选择授权有效期'));
      }
    };

    const validateTotalMoney = (rule, value, callback) => {
      var val = this.addOrderObj.TotalMoney
      if (!value) {
        return callback(new Error('请输入订单金额'));
      } else if (!parseFloat(value) && parseFloat(value) != 0) {
        return callback(new Error('售价请输入阿拉伯数字'));
      } else {
        if (value < 0 || value > 100000) {
          return callback(new Error('请输入0-10万的订单金额'));
        } else if (value.indexOf('.') > 0 && value.split('.')[1].length > 2) {
          return callback(new Error('订单金额最多有两位小数'));
        } else {
          callback();
        }
      }
    };
    const validateSaleMan = (rule, value, callback) => {
      var val = this.addOrderObj.SaleMan
      console.log(val)
      if (!val) {
        return callback(new Error('请填写销售人员'));
      } else if (val.trim() == '') {
        return callback(new Error('请填写销售人员'));
      } else {
        callback()
      }
    };
    const validateOrg = (rule, value, callback) => {
      var val = this.addOrderObj.OrganizationTitle
      console.log(val)
      if (!val) {
        return callback(new Error('请选择机构'));
      } else {
        callback()
      }
    };

    return {
      baseUrl: baseUrl,
      changeShow: 1,

      file: null,
      loadingStatus: false,
      fileObj: {},
      showNextBtn: 1,

      //新增订单
      dateValue: [],
      addOrderObj: {
        OrganizationTitle: '',
        EndTime: '',
        TotalMoney: '',
        SaleMan: '',
        ProductId: '2',
        fileGetData:'',
      },

      organizationList: [],
      ruleInline: {
        OrganizationTitle: [
          { required: true, validator: validateOrg, trigger: 'change' }
        ],
        TotalMoney: [
          { required: true, validator: validateTotalMoney, trigger: 'change' },
        ],
        SaleMan: [
          { required: true, validator: validateSaleMan, trigger: 'change' },
        ],
        Time: [
          { required: true, validator: validateTime, trigger: 'change' },
        ],
        ProductId: [
          { required: true, message: '请选择产品', trigger: 'blur' }
        ],
      },
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
    }
  },
  mounted() {
    this.getOrgList()
    if(this.changeShow==2){
      this.$refs['formInline'].resetFields();
    }
    
  },
  methods: {
    //上传之前的处理函数
    handleUpload(file) {
      if (file.name.indexOf('zip') > 0 || file.name.indexOf('rar') > 0) {
        this.file = file;
        this.fileObj.file = file.name;
        return false;
      } else {
        this.$Message.warning('请上传zip,rar格式的压缩包');
        return false;
      }
    },
    /**
     * [childrenEmit 通知父组件关闭模态框]
     * @Author   王柳
     * @DateTime 2017-12-17
     * @param    {[type]}   index [description]
     * @return   {[type]}         [description]
     */
    childrenEmit(index) {
      this.file = null;
      this.loadingStatus = false;
      this.$emit('childrenEmit', index)
    },
    nextDo(index) {
      this.changeShow = index
    },
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
     * [getOrgList 获取机构列表]
     * @Author   王柳
     * @DateTime 2017-12-20
     * @return   {[type]}   [description]
     */
    getOrgList() {
      this.$http.get(this.ApiTransfer("/Organization/List"), {
          params: this.ApiTransfer("/Organization/List", {
            cp: 1,
            ps: 99999999,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.organizationList = res.data.Data.ItemList
          }
        })
    },
    /**
     * [importData 导入数据]
     * @Author   王柳
     * @DateTime 2017-12-21
     * @return   {[type]}   [description]
     */
    importData() {
      if (this.file) {
        this.loadingStatus = true;
        var _this = this;

        var form = new FormData();
        // form.append("productId", _this.fileObj.productId);
        form.append("file", this.file, this.file.name);
        form.append("BridgePlatformName", transferUrl);
        form.append("ApiName", '/File/UploadExl');

        var xhr = $.ajax({
          url: _this.baseUrl + '/File/UploadExl',
          contentType: false,
          type: 'POST',
          data: form,
          processData: false,
          dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
          success: function(data, textStatus, jqXHR) {
            if (data.Success) {
               _this.loadingStatus = false;
              if(data.Data==''){
                _this.$Message.error('文件里的数据不对')
              }else{
                _this.$Message.success('导入成功')
                _this.file = null;
                _this.showNextBtn = 2;
                _this.fileGetData = data.Data;
              }
             
            } else {
              _this.$Message.error(data.Description)
            }
          }
        })

        //取消请求
        // xhr.abort()
      } else {
        this.$Message.warning('请先选择文件')
      }
    },
    /**
     * [addOrderFn 新增机构订单]
     * @Author   王柳
     * @DateTime 2017-12-20
     * @param    {[type]}   name [description]
     */
    addOrderFn(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer("/OrganizationOrder/Create"),
            this.ApiTransfer("/OrganizationOrder/Create", {
              organizationId: this.addOrderObj.OrganizationTitle,
              startTime: this.dateValue[0] ? this.dateValue[0] : '',
              endTime: this.dateValue[1] ? this.dateValue[1] : '',
              totalMoney: this.addOrderObj.TotalMoney,
              objectIds: this.fileGetData,
              saleMan: this.addOrderObj.saleMan,
            })
          )
          .then((res) => {
            if (res.data.Success) {
              this.$Message.success('新增机构订单成功')
              this.$emit('childrenEmit', 1)
            }
          })
        }
      })
    },
  },
}

</script>
<style lang="less">
.org-form {}

</style>
