<template>
  <div class="ad-content-form">
    <Form :model="formItem" :label-width="100" ref="formValidate" :rules="ruleValidates">
      <FormItem label="所属广告位:" prop="AdPositionId">
        <Select v-model="formItem.AdPositionId" clearable>
          <Option v-for="item in adPositionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="图片:" prop="CoverUrl">
        <Upload ref="upload" :data="ApiTransfer('/File/Upload',fileObj)" :default-file-list="formItem.defaultList" :on-success="handleSuccess"  :before-upload="handleBeforeUpload" :action="ApiTransfer('/File/Upload')" style="display: inline-block;width:60px;">
          <div class="img-wrap" v-if="formItem.CoverUrl==''">
            <Icon type="plus-circled"></Icon>
          </div>
          <div class="wraps1" v-if="formItem.CoverUrl!=''">
            <img :src="formItem.CoverUrl">
          </div>
        </Upload>
        <p style="float: right;margin-right: 100px;line-height: 80px;">请上传JPG、PNG、GIF格式的图片</p>
      </FormItem>
      <FormItem label="标题:" prop="Title">
        <Input v-model="formItem.Title" placeholder="请输入标题"></Input>
      </FormItem>
      <FormItem label="广告描述:" prop="Contents">
        <Input v-model="formItem.Contents" placeholder="请输入广告描述" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
      </FormItem>
      <FormItem label="时间:" prop="Time">
        <DatePicker type="daterange" format='yyyy/MM/dd' :value="formItem.Time" confirm placement="bottom-end" placeholder="请选择时间" :editable=false @on-change="handleChange" @on-ok="handleOk"></DatePicker>
      </FormItem>
      <FormItem label="链接:" prop="Url">
        <Input v-model="formItem.Url" placeholder="请输入 广告链接"></Input>
      </FormItem>
      <FormItem label="所属广告商:" prop="AdvertiserId">
        <Select v-model="formItem.AdvertiserId">
          <Option v-for="item in advertiserList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
    </Form>
    <div style="text-align: center;">
      <Button class="btns" type="primary" v-if="type==1" @click="addAd('formValidate')">确定</Button>
      <Button class="btns" type="primary" v-if="type==2" @click="updateAd('formValidate')">确定</Button>
      <Button class="btns" @click="$emit('childrenClick','close')">取消</Button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const validateTime = (rule, value, callback) => {
      if (value.length == 0 || value[0] == '') {
        return callback(new Error('请选择时间'));
      } else {
        callback()
      }
    };

    const validateAdvertiserId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择广告商'));
      } else {
        callback()
      }
    };

    const validateAdPositionId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择广告商'));
      } else {
        callback()
      }
    };
    const validateTitle = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('请填写广告标题'));
      } else if (value.trim().length > 60) {
        return callback(new Error('广告标题长度不能超过60'));
      } else {
        callback()
      }
    };
    const validateContent = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('请填写广告描述'));
      } else if (value.trim().length > 200) {
        return callback(new Error('广告描述长度不能超过200'));
      } else {
        callback()
      }
    };

    return {
      baseUrl: baseUrl,
      adId: '',
      userId: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id,
      adPositionList: [], //广告位列表
      advertiserList: [],
      formItem: {
        defaultList: [],
        Time: ''
      },
      ruleValidates: {
        Title: [
          { required: true, validator: validateTitle, trigger: 'change' }
        ],
        CoverUrl: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        Contents: [
          { required: true, validator: validateContent, trigger: 'change' }
        ],
        AdPositionId: [
          { required: true, validator: validateAdPositionId, trigger: 'blur' },
        ],
        AdvertiserId: [
          { required: true, validator: validateAdvertiserId, trigger: 'blur' }
        ],
        Url: [
          { required: true, message: '请填写广告链接', trigger: 'blur' }
        ],
        Time: [
          { required: true, validator: validateTime, trigger: 'blur' }
        ],
      },
      file: {},
      fileObj: {
        file: '', //name
        userid: this.userId,
        objectId: 0,
        customType: 0, //文件自定义类型，默认两种：cover-封面，content-文件内容
      }
    }
  },
  props: ['type'], //type:1是新增，2是修改
  mounted() {
    this.getAdvertiserList()
    this.getAdPositionList()
    if (this.type == 1) {
      this.formItem = {
        AdvertiserId: 1,
        AdPositionId: 2,
        Contents: '',
        CoverUrl: '',
        Time: [],
        Title: '',
        Url: ''
      }
    } else if (this.type == 2) {
      this.formItem = JSON.parse(localStorage.adContent);
      this.adId = JSON.parse(localStorage.adContent).Id;

      this.formItem.Time = [this.formItem.StartTime.slice(0, 10), this.formItem.EndTime.slice(0, 10)]
    }
  },
  methods: {
    /**
     * [getAdPositionList 获取广告位]
     * @Author   赵雯欣
     * @DateTime 2017-11-28
     * @return   {[type]}   [description]
     */
    getAdPositionList() {
      this.$http.get(this.ApiTransfer('/AdPosition/List'), {
        params: this.ApiTransfer('/AdPosition/List', {
          cp: 1,
          ps: 999999999,
          productId: 0
        })
      }).then((res) => {
        if (res.data.Success) {
          for (let i = 0; i < res.data.Data.ItemList.length; i++) {
            this.adPositionList.push({
              value: res.data.Data.ItemList[i].Id,
              label: res.data.Data.ItemList[i].Title
            })
          }
        }
      })
    },
    /**
     * [getAdvertiserList 获取广告商列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-28
     * @return   {[type]}   [description]
     */
    getAdvertiserList() {
      this.$http.get(this.ApiTransfer('/Advertiser/List'), {
        params: this.ApiTransfer('/Advertiser/List', {
          type: 0, //所属行业类型0全部1教育2医疗3金融4互联网
          keyword: '',
          ps: 999999999,
          cp: 1
        })
      }).then((res) => {
        if (res.data.Success) {
          for (let i = 0; i < res.data.Data.ItemList.length; i++) {
            this.advertiserList.push({
              value: res.data.Data.ItemList[i].Id,
              label: res.data.Data.ItemList[i].Title
            })
          }
        }
      })
    },
    /**
     * [addAd 新增广告]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     */
    addAd(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer("/Ad/Create"), this.ApiTransfer("/Ad/Create", {
              adPositionId: this.formItem.AdPositionId, //广告位编号
              advertiserId: this.formItem.AdvertiserId, //广告商编号
              contents: this.formItem.Contents, //广告内容
              coverUrl: this.formItem.CoverUrl, //广告图片地址
              startTime: this.formItem.Time[0],
              endTime: this.formItem.Time[1],
              title: this.formItem.Title, //标题
              url: this.formItem.Url, //广告链接
              productId: 0,
              isDefaultAd:false
            }))
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success("新增成功")
                this.$emit('childrenClick', 'ok')
              }
            })
        }
      })
    },
    /**
     * [updateAd 修改广告商信息]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   id [description]
     * @return   {[type]}      [description]
     */
    updateAd(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer("/Ad/Update"), this.ApiTransfer("/Ad/Update", {
              id: this.adId,
              adPositionId: this.formItem.AdPositionId, //广告位编号
              advertiserId: this.formItem.AdvertiserId, //广告商编号
              contents: this.formItem.Contents, //广告内容
              coverUrl: this.formItem.CoverUrl, //广告图片地址
              startTime: this.formItem.Time[0],
              endTime: this.formItem.Time[1],
              title: this.formItem.Title, //标题
              url: this.formItem.Url, //广告链接
              productId: 0,
            }))
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success("修改成功")
                this.$emit('childrenClick', 'ok')
              }
            })
        }
      })
    },
    /**
     * [handleBeforeUpload 上传图片之前的处理]
     * @Author   赵雯欣
     * @DateTime 2017-11-28
     * @return   {[type]}   [description]
     */
    handleBeforeUpload(file) {
      var names = file.name.toLocaleUpperCase()
      if (names.indexOf('.PNG') > 0 || names.indexOf('.JPG') > 0 || names.indexOf('.GIF') > 0) {
        this.file = file;
        this.fileObj.file = file.name;
      } else {
        this.$Message.warning('请上传JPG、PNG、GIF格式的图片');
        return false;
      }
    },
    /**
     * [getlist 上传图片]
     * @Author   刘启瑞
     * @DateTime 2017-11-22
     * @return   {[type]}   [description]
     */
    handleSuccess(res, file) {
      this.$refs.upload.fileList=[]
      if (res.Success) {
        this.formItem.CoverUrl = res.Data.Url
      }
    },
    /**
     * [handleChange 赋值已选择的日期]
     * @Author   赵雯欣
     * @DateTime 2017-11-28
     * @param    {[type]}   date [description]
     * @return   {[type]}        [description]
     */
    handleChange(date) {
      this.formItem.Time = date;
    },
    /**
     * [handleOk 选择日期]
     * @Author   赵雯欣
     * @DateTime 2017-11-28
     * @return   {[type]}   [description]
     */
    handleOk() {
      console.log(this.formItem.Time)
      // this.open = false;
    }
  }
}

</script>
<style lang='less'>
.ad-content-form {
  .ivu-date-picker {
    width: 100%
  }
  /*上传图片*/
  .img-wrap {
    width: 60px;
    height: 60px;
    border: 1px dashed #ddd;
    line-height: 60px;
    text-align: center;
    font-size: 30px;
    cursor: pointer;
  }

   .ivu-upload-list{
    width: 380px;
  }

  .wraps1 {
    width: 80px;
    height: auto;

    img {
      width: 100%;
      cursor: pointer;
    }
  }
}

</style>
