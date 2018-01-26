<template>
  <div class="add-org">
    <!-- 勾选列表 -->
    <div v-if="changeShow==1">
      <div class="btn-line">
        <Select v-model="ObjectTypes" style="width:340px;" multiple placeholder="请选择类型">
          <Option v-for="item in contentList" :value="item.Type" :key="item.Type">{{ item.TypeDescription }}</Option>
        </Select>
        <Input v-model="keyWord" icon="ios-search" placeholder="请输入内容标题" style="width: 240px;float: right" @on-click="getkeyWordList()" @on-enter="getkeyWordList()"></Input>
      </div>
      <div style="margin-bottom: 15px;">
        <Select v-model="CategoryType" multiple placeholder="分类筛选">
          <Option v-for="item in typeList" :value="item.Id" :key="item.Id">{{ item.Category.Title }}</Option>
        </Select>
      </div>
      <div>
        <Table ref="selection" border :loading="loading" :columns="columns2" :data="datasList" @on-selection-change="selectItem"></Table>
      </div>
      <div class="page">
        <Page :total="parseInt(totalCount)" :current="parseInt(page)" :page-size="pageSize" size="small" show-elevator show-total show-sizer @on-page-size-change='changeSize' @on-change="change"></Page>
      </div>
      <div style="margin-top: 20px;text-align: right;height:100px;">
        <Button type="ghost" @click="childrenEmit(2)">取消</Button>
        <Button type="primary" @click="nextDo(2)">下一步</Button>
      </div>
    </div>
    <!-- 新增订单 -->
    <div v-if="changeShow==2" style='margin-top: 20px;overflow:hidden;'>
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
        <FormItem label="应用名称:">
          <Select v-model="addOrderObj.ProductId">
            <Option v-for="item in productList" :value="item.Id" :key="item.Id">{{ item.Title }}</Option>
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
      loading: false,
      keyWord: "",
      oldkeyWord: "",

      totalCount: 0,
      page: "1",
      pageSize: 10,
      datasList: [],

      IdsArr: [],
      changeShow: 1,

      productList: [],
      contentList: [],
      typeList: [],

      //新增订单
      ObjectTypes: [],
      CategoryType:[],
      dateValue: [],
      addOrderObj: {
        OrganizationTitle: '',
        StartTime: '',
        EndTime: '',
        TotalMoney: '',
        SaleMan: '',
        ProductId: 1,
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
        // ProductId: [
        //   { required: true, message: '请选择产品', trigger: 'change' }
        // ],
      },
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },

      columns2: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '编号',
        key: 'Id',
        width: 100,
      }, {
        title: '内容标题',
        key: 'Title',
        ellipsis: true,
        render: (h, params) => {
          if (!!params.row.Title && params.row.Title.length > 13) {
            return h('div', [
              h("Tooltip", {
                props: {
                  trigger: "hover",
                  content: params.row.Title ? params.row.Title : "-",
                  placement: "top-start"
                },
                style: {
                  width: '100%',
                  textOverflow: 'ellipsis'
                }
              }, params.row.Title ? params.row.Title : "-")
            ])
          } else {
            return h('div', [
              h("span", params.row.Title ? params.row.Title : "-")
            ])
          }
        }
      }, {
        title: '作者',
        key: 'Author',
        ellipsis:true,
        width: 120,
        render: (h, params) => {
          if (!!params.row.Author && params.row.Author.length > 7) {
            return h('div', [
              h("Tooltip", {
                props: {
                  trigger: "hover",
                  content: params.row.Author ? params.row.Author : "-",
                  placement: "top-start"
                },
                style: {
                  width: '100%',
                  textOverflow: 'ellipsis'
                }
              }, params.row.Author ? params.row.Author : "-")
            ])
          } else {
            return h('div', [
              h("span", params.row.Author ? params.row.Author : "-")
            ])
          }
        }
      }, {
        title: '出版社',
        key: 'Publisher',
        width: 160,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Publisher ? params.row.Publisher : "-")
          ])
        }
      }],

    }
  },
  mounted() {
    this.getlist();
    this.getContentList()
    this.getTypeList()
    this.getOrgList()
    this.getProductlist()
  },
  methods: {
    /**
     * [getkeyWordList 搜索关键字]
     * @Author   赵雯欣
     * @DateTime 2017-12-13
     * @return   {[type]}   [description]
     */
    getkeyWordList() {
      if (this.oldkeyWord == this.keyWord.trim() && this.keyWord.trim() == '') {
        this.$Message.warning('请输入内容名称')
        return false;
      }
      this.page = 1;
      this.loading = true;
      this.datasList = []
      this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search", {
          cp: this.page,
          ps: this.pageSize,
          query: JSON.stringify({
            IsPublished:true,
            isOnShelf:true,
            Keyword: this.keyWord.trim(),
            ObjectTypes: this.ObjectTypes.length==0?[104,108,109]:this.ObjectTypes,
            CategoryIds: this.CategoryType.length==0?'':this.CategoryType
          })
        }))
        .then((res) => {
          if (res.data.Success) {
            res.data.Data.ItemList.forEach((item) => {
              item = Object.assign({}, item, { _checked: false })
              this.datasList.push(item)
              if (this.IdsArr.indexOf(item.Id) > -1) {
                item._checked = true;
              }
            })
            this.totalCount = res.data.Data.RecordCount;
            this.oldkeyWord = this.keyWord.trim()
            this.loading = false;
          }
        })
    },
    /**
     * [getlist 获取知识元详情列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   page     [description]
     * @param    {[type]}   pageSize [description]
     * @return   {[type]}            [description]
     */
    getlist() {
      this.loading = true;
      this.datasList = []
      this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search", {
          cp: this.page,
          ps: this.pageSize,
          query: JSON.stringify({
            IsPublished:true,
            isOnShelf:true,
            Keyword: this.oldkeyWord,
            ObjectTypes: this.ObjectTypes.length==0?[104,108,109]:this.ObjectTypes,
            CategoryIds: this.CategoryType.length==0?'':this.CategoryType
          })
        }))
        .then((res) => {
          if (res.data.Success) {
            res.data.Data.ItemList.forEach((item) => {
              item = Object.assign({}, item, { _checked: false })
              this.datasList.push(item)
              if (this.IdsArr.indexOf(item.Id) > -1) {
                item._checked = true;
              }
            })

            localStorage.ObjectTypesLength = this.ObjectTypes.length;
            localStorage.CategoryIdsLength = this.CategoryType.length;

            this.totalCount = res.data.Data.RecordCount;
            this.loading = false;
          }
        })
    },
    /**
     * [changeSize 切换每页条数]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   pageSize [description]
     * @return   {[type]}            [description]
     */
    changeSize(pageSize) {
      this.pageSize = pageSize
      this.page = 1
      this.getlist()
    },
    /**
     * [change 分页切换当前页]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   page [description]
     * @return   {[type]}        [description]
     */
    change(page) {
      this.page = page;
      this.getlist()
    },
    /**
     * [handleChange 处理日期赋值]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   date [description]
     * @return   {[type]}        [description]
     */
    handleChange(date) {
      this.dateValue = date;
    },
    /**
     * [selectItem 全选功能得到ids]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @param    {[type]}   status [description]
     * @return   {[type]}          [description]
     */
    selectItem(status) {
      status.forEach((i) => {
        if (this.IdsArr.indexOf(i.Id) < 0) {
          this.IdsArr.push(i.Id)
        }
      })
    },
    /**
     * [childrenEmit 新增订单]
     * @Author   赵雯欣
     * @DateTime 2017-12-17
     * @param    {[type]}   index [description]
     * @return   {[type]}         [description]
     */
    childrenEmit(index) {
      this.$emit('childrenEmit', index)
    },
    nextDo(index) {
      this.changeShow = index
    },
    /**
     * [getContentList 获取分类]
     * @Author   赵雯欣
     * @DateTime 2017-12-17
     * @return   {[type]}   [description]
     */
    getContentList() {
      this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search", {
          cp: 1,
          ps: 10,
          query: JSON.stringify({
            ObjectTypes: [104,108,109],
          })
        }))
        .then((res) => {
          if (res.data.Success) {
            this.contentList = res.data.Data.Aggregation;
          }
        })
    },
    /**
     * [getTypeList 获取分类2]
     * @Author   赵雯欣
     * @DateTime 2017-12-20
     * @return   {[type]}   [description]
     */
    getTypeList() {
      this.$http.get(this.ApiTransfer("/Hierarchy/GetCategoryList"), {
          params: this.ApiTransfer("/Hierarchy/GetCategoryList", {
            id: '',
            name: 'CabpCourse'
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.typeList = res.data.Data
          }
        })
    },
    /**
     * [getOrgList 获取机构列表]
     * @Author   赵雯欣
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
    getProductlist() {
      this.$http.get(this.ApiTransfer('/Product/List'), {
        params: this.ApiTransfer('/Product/List', {
          keyword: '',
          ps: 999999999,
        })
      }).then((res) => {
        if (res.data.Success) {
          this.productList = res.data.Data.ItemList;
        }
      })
    },
    /**
     * [addOrderFn 新增机构订单]
     * @Author   赵雯欣
     * @DateTime 2017-12-20
     * @param    {[type]}   name [description]
     */
    addOrderFn(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.IdsArr.length == 0) {
            this.$Message.warning('请输入内容')
            return false;
          }
          this.$http.post(this.ApiTransfer("/OrganizationOrder/Create"),
              this.ApiTransfer("/OrganizationOrder/Create", {
                organizationId: this.addOrderObj.OrganizationTitle,
                startTime: this.dateValue[0] ? this.dateValue[0] : '',
                endTime: this.dateValue[1] ? this.dateValue[1] : '',
                totalMoney: this.addOrderObj.TotalMoney,
                objectIds: this.IdsArr.join(','),
                saleMan: this.addOrderObj.SaleMan,
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
  watch: {
    'ObjectTypes': function(val) {
      if(localStorage.ObjectTypesLength !=val.length){
        this.ObjectTypes = val
        this.getlist()
      }
    },
    'CategoryType': function(val) {
      if( localStorage.CategoryIdsLength !=val.length){
        this.CategoryIds = val
        this.getlist()
      }
    }

  }
}

</script>
<style lang="less">
.add-org {
  margin-top: -30px;
  .btn-line {
    height: 45px;
    margin-top: 15px;
  }

  .page {
    height: 50px;
    padding-top: 15px;

    .ivu-page {
      float: right;
    }

    .ivu-select-dropdown {
      position: fixed!important;
    }
  }
}

</style>
