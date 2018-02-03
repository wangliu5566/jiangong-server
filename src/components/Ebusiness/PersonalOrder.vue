<template>
  <div class="person-order">
    <div class="system-title">
      <Icon type="bag" size="27"></Icon>
      <span>个人纸质订单</span>
    </div>
    <div class="btn-line" style="font-size: 16px;">
      所属子产品：
      <Select v-model="productId" style="width:180px">
        <Option value="0">建工</Option>
        <!-- <Option v-for="item in productList" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
      </Select>
      <span class="p1-right">
        <span @click="changeTime(1)" :class="clickIndex==1?'show-blue':''">最近7天</span>&nbsp;&nbsp;&nbsp;
      <span @click="changeTime(2)" :class="clickIndex==2?'show-blue':''">最近一月</span>&nbsp;&nbsp;&nbsp;
      <DatePicker :value="dateValue" type="daterange" placement="bottom-start" placeholder="请选择订单创建时间" :options="dateOptions" style="width: 240px" confirm @on-change="handleChange" @on-clear="clearData" @on-ok="handleOk"></DatePicker>
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入完整的订单编号" style="width: 180px;margin-left: 10px;" @on-click="getkeyWordList()" @on-enter="getkeyWordList()"></Input>
      </span>
    </div>
    <Table border :loading="loading" :columns="columnsList" :data="dataList" ref="selection"></Table>
    <div class="page">
      <Page :total="parseInt(totalCount)" size="small" show-elevator :current="parseInt(page)" :page-size="pageSize" show-total show-sizer @on-page-size-change='changeSize' @on-change="change"></Page>
    </div>
    <!-- 订单详情 -->
    <Modal v-model="showDetailModal" :mask-closable="false" id="noFooter">
      <p slot="header" style="text-align:center;color:#333;">个人订单详情</p>
      <Row>
        <Col span="8">订单编号：</Col>
        <Col span="16">{{orderObj.ExternalId}}</Col>
      </Row>
      <Row>
        <Col span="8">订单状态：</Col>
        <Col span="16">{{orderObj.IsPaid?'已支付':'未支付'}}</Col>
      </Row>
      <Row>
        <Col span="8">下单用户：</Col>
        <Col span="16">{{orderObj.ExtendData&&orderObj.ExtendData.NickName?orderObj.ExtendData.NickName:'-'}}</Col>
      </Row>
      <Row>
        <Col span="8">下单时间：</Col>
        <Col span="16">{{orderObj.CreateTime?orderObj.CreateTime:'-'}}</Col>
      </Row>
      <Row>
        <Col span="8">支付时间：</Col>
        <Col span="16">{{orderObj.PayTime?orderObj.PayTime:' - '}}</Col>
      </Row>
      <Row>
        <Col span="8">订单金额：</Col>
        <Col span="16">￥{{this.formatPrice(orderObj.TotalMoney?orderObj.TotalMoney:'0', 2)}}</Col>
      </Row>
      <Row>
        <Col span="8">支付金额：</Col>
        <Col span="16">￥{{this.formatPrice(orderObj.ExtendData&&orderObj.ExtendData.PaidMoneyName?orderObj.ExtendData.PaidMoneyName: "0", 2)}}</Col>
      </Row>
      <Row>
        <Col span="8">优惠金额：</Col>
        <Col span="16">￥{{orderObj.ExtendData&&orderObj.ExtendData.DiscountMoneyName?orderObj.ExtendData.DiscountMoneyName:'0'}}</Col>
      </Row>
      <Row>
        <Col span="8">发票信息：</Col>
        <Col span="16">暂无</Col>
      </Row>
      <div class="tables">
        <Table border :columns="columnsDetailList" :data="detailList" ref="selection"></Table>
      </div>
      <div style="text-align: center;margin-top: 15px;">
        <!-- <Button class="btns" type="primary" @click="showDetailModal=false">确定</Button> -->
      </div>
    </Modal>
    <Modal v-model="changeStatusModal" title="修改发货状态" id="noFooter">
      <Form :model="changeStatusObj" :label-width="100" ref="formInline" :rules="ruleValidates">
        <FormItem label='发货状态' prop="AdPositionId">
          <Select v-model="changeStatusObj.status" clearable>
            <Option :value="4">已发货</Option>
          </Select>
        </FormItem>
        <FormItem label="物流公司:" prop="logisticsCompanyName">
          <Input v-model="changeStatusObj.logisticsCompanyName" placeholder="请输入物流公司"></Input>
        </FormItem>
        <FormItem label="运单号:" prop="logisticsCode">
          <Input v-model="changeStatusObj.logisticsCode" placeholder="请输入运单号"></Input>
        </FormItem>
      </Form>
      <div style="text-align: center;margin-top: 15px;">
        <Button type="ghost" @click="changeStatusModal=false">取消</Button>
        <Button type="primary" @click="SetOrderLogisticsInfo('formInline')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: true,
      TotalMoney: 0,
      PaidMoney: 0,
      clickIndex: 1,

      keyWord: "", //搜索关键字
      oldkeyWord: '',

      totalCount: 0,
      page: "1",
      pageSize: 10,

      openDate: false,
      dateValue: '',

      dataList: [], //表格列表
      detailList: [], //详情表格列表

      startTime: "",
      endTime: "",
      timeLong: "-6",
      productId: '0',
      productList: [],
      paidType: 0, // 支付类型 0-全部 1-已经支付 2-未支付

      showDetailModal: false, //订单详情模态框
      orderObj: {}, //订单详情

      changeStatusModal: false,
      changeStatusObj: {
        status: 1,
        logisticsCompanyName: '',
        logisticsCode: '',
      },
      ruleValidates: {
        OrganizationTitle: [
          // { required: true, validator: validateOrg, trigger: 'change' }
          { required: true, message: '请选择发货状态', trigger: 'blur' }
        ],
        logisticsCompanyName: [
          { required: true, message: '请填写物流公司', trigger: 'blur' }
          // { required: true, validator: validateTotalMoney, trigger: 'change' },
        ],
        logisticsCode: [
          { required: true, message: '请填写运单号', trigger: 'blur' }
        ],
      },

      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      // 详情表格
      columnsDetailList: [{
        title: '内容标题',
        key: 'Title',
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Content && params.row.Content.Title ? params.row.Content.Title : "-")
          ])
        }
      }, {
        title: '数量',
        width: 80,
        key: 'Count',
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Count ? params.row.Count : "0")
          ])
        }
      }, {
        title: '单价',
        width: 80,
        key: 'Price',
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Price ? params.row.Price : "0")
          ])
        }
      }, {
        title: '总价',
        width: 80,
        key: 'TotalMoney',
        render: (h, params) => {
          return h('div', [
            h("span", params.row.TotalMoney ? params.row.TotalMoney : "0")
          ])
        }
      }],
      // 页面表格
      columnsList: [{
        title: '订单编号',
        key: 'ExternalId',
        ellipsis: true,
        // width: 100,
      }, {
        title: '用户',
        ellipsis: true,
        key: 'User',
        render: (h, params) => {
          return h('div', [
            h("span", params.row.ExtendData && params.row.ExtendData.NickName ? params.row.ExtendData.NickName : "-")
          ])
        }
      }, {
        title: '支付金额',
        key: 'PaidMoney',
        ellipsis: true,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.ExtendData && params.row.ExtendData.PaidMoneyName ? '¥' + this.formatPrice(params.row.ExtendData.PaidMoneyName, 2) : "¥0.00")
          ])
        }
      }, {
        title: '折扣金额',
        key: 'DiscountMoney',
        ellipsis: true,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.ExtendData && params.row.ExtendData.DiscountMoneyName ? this.formatPrice(params.row.ExtendData.DiscountMoneyName, 2) : "¥0.00")
          ])
        }
      }, {
        title: '购买数量',
        key: 'ContentCount',
        ellipsis: true,
        // width: 100,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.ExtendData && params.row.ExtendData.ContentCount ? params.row.ExtendData.ContentCount : "-")
          ])
        }
      }, {
        title: '下单时间',
        key: 'CreateTime',
        ellipsis: true,
        // width: 180
      }, {
        title: '订单状态',
        key: 'IsPaid',
        ellipsis: true,
        width: 115,
        filters: [{
          label: '未支付',
          value: 6
        }, {
          label: '未发货',
          value: 3
        }, {
          label: '已发货',
          value: 4
        }, {
          label: '已完成',
          value: 1
        }, {
          label: '已取消',
          value: 2
        }, {
          label: '异常订单',
          value: 0
        }, ],
        filterMultiple: false,
        filterRemote: (value, row) => {
          if (value.length == 0) {  //全部
            this.paidType = 0;
            this.status = -1
          } else {
            var val = value[0]
            if (val == 6) {
              this.paidType = 2;
              this.status = -1;
            } else if (val > -1 && val < 6) {
              this.paidType = 1;
              this.status = value[0]
            }
          }
          this.getlist()
        },
        render: (h, params) => {
          return h('div', [
            h("span", !params.row.IsPaid ? '未支付' : params.row.Status == 0 ? '异常订单' : params.row.Status == 1 ? '已完成' : params.row.Status == 2 ? '已取消' : params.row.Status == 3 ? '未发货' : '已发货')
          ])
        }
      }, {
        title: '操作',
        key: 'action',
        width: 188,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.getDetail(params.row.Id)

                }
              }
            }, '查看订单'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small',
                disabled: params.row.Status == 3 ?false:true  ,
              },
              style: {
                display: params.row.IsPaid ? 'inline-block' : "none",
              },
              on: {
                click: () => {
                  if (params.row.IsGenerateInvoice) { //已经生成发货单，显示更改状态
                    if (params.row.Status == 3) {
                      this.changeStatusObj.orderId = params.row.Id
                      this.changeStatusFn()
                    }
                  } else { //生产发货单
                    if (params.row.IsPaid) {
                      this.CreateWordFile(params.row.Id)
                    } else {
                      this.$Message.warning('该订单还未支付，不能生成发货单')
                    }
                  }
                }
              }
            }, !params.row.IsGenerateInvoice ?'生成发货单': params.row.Status == 1?'已完成':params.row.Status == 3 ? '未发货' :params.row.Status == 4 ? '已发货':'已取消'), //订单状态 0-异常订单 1-已完成 2-已取消 3-未发货 4-已发货
          ]);
        }
      }],

    }
  },
  mounted() {
    this.changeTime(1)
    this.getSystemlist()
  },
  methods: {
    /**
     * [getSystemlist 获取系统列表]
     * @Author   王柳
     * @DateTime 2017-12-04
     * @return   {[type]}   [description]
     */
    getSystemlist() {
      this.$http.get(this.ApiTransfer('/Product/List'), {
        params: this.ApiTransfer('/Product/List', {
          keyword: '',
          ps: 999999999,
        })
      }).then((res) => {
        if (res.data.Success) {
          this.productList.push({
            value: 0,
            label: '全部'
          })
          for (let i = 0; i < res.data.Data.ItemList.length; i++) {
            this.productList.push({
              value: res.data.Data.ItemList[i].Id,
              label: res.data.Data.ItemList[i].Title
            })
          }
        }
      })
    },
    /**
     * [getkeyWordList 搜索关键字]
     * @Author   王柳
     * @DateTime 2017-12-13
     * @return   {[type]}   [description]
     */
    getkeyWordList() {
      if (this.oldkeyWord == this.keyWord.trim() && this.keyWord.trim() == '') {
        this.$Message.warning('请输入完整的订单编号')
        return false;
      }
      this.loading = true;
      this.page = 1
      this.$http.get(this.ApiTransfer("/Order/List"), {
          params: this.ApiTransfer("/Order/List", {
            mediaType: 'Entity,POD',
            orderId: this.keyWord.trim(),
            cp: this.page,
            ps: this.pageSize,
            startTime: this.startTime,
            endTime: this.endTime,
            paidType: this.paidType, //支付类型 0-全部 1-已经支付 2-未支付
            status: this.status, //订单状态，0-异常订单，1-已完成，2-已取消 3-正在处理
            auditState: this.auditState, //审核状态，0-审核不通过，1-审核通过，2-还未审核
            productId: this.productId
          })
        })
        .then((res) => {
           this.loading = false;
          if (res.data.Success) {
            this.dataList = res.data.Data.ItemList
            this.totalCount = parseInt(res.data.Data.RecordCount);
            this.oldkeyWord = this.keyWord.trim()
          }else{
            this.dataList = []
            this.totalCount = 0;
            this.$Message.error(res.data.Description)
          }
        })
    },
    /**
     * [getDetail 获取详情]
     * @Author   王柳
     * @DateTime 2017-12-23
     * @param    {[type]}   id [description]
     * @return   {[type]}      [description]
     */
    getDetail(id) {
      this.$http.get(this.ApiTransfer("/Order/Detail"), {
          params: this.ApiTransfer("/Order/Detail", {
            id: id
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.orderObj = res.data.Data;
            this.showDetailModal = true;
            this.detailList = res.data.Data.OrderDetails
          }
        })
    },
    /**
     * [changeTime 得到最近7天和最近一月的天数]
     * @Author   王柳
     * @DateTime 2017-11-19
     * @param    {[type]}   index [description]
     * @return   {[type]}         [description]
     */
    changeTime(index) {
      this.dateValue = [];
      this.clickIndex = index;
      if (index == 1) {
        this.timeLong = -6;
      } else if (index == 2) {
        //判断上月有多少天
        var d = new Date();
        var lastMonthDays = new Date(d.getFullYear(), (d.getMonth()), 0).getDate();
        this.timeLong = -(lastMonthDays - 1);
      }

      this.endTime = new Date().formatDate("yyyy-MM-dd");
      this.startTime = this.addDate(this.endTime, this.timeLong)

      this.getlist()
    },
    /**
     * [addDate 得到最近7天和最近一月的起始时间]
     * @Author   王柳
     * @DateTime 2017-11-19
     * @param    {[type]}   date [description]
     * @param    {[type]}   days [description]
     */
    addDate(date, days) {
      var d = new Date(date);
      d.setDate(d.getDate() + days);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var val = d.getFullYear() + "-" + month + "-" + day;
      return val;
    },
    /**
     * [getlist 个人订单列表]
     * @Author   王柳
     * @DateTime 2017-11-19
     * @param    {[type]}   keyWord  [description]
     * @return   {[type]}            [description]
     */
    getlist() {
      this.loading = true;
      this.$http.get(this.ApiTransfer("/Order/List"), {
          params: this.ApiTransfer("/Order/List", {
            mediaType: 'Entity,POD',
            orderId: this.oldkeyWord,
            cp: this.page,
            ps: this.pageSize,
            startTime: this.startTime,
            endTime: this.endTime,
            paidType: this.paidType, //支付类型 0-全部 1-已经支付 2-未支付
            status: this.status, //订单状态，0-异常订单，1-已完成，2-已取消 3-正在处理
            auditState: this.auditState, //审核状态，0-审核不通过，1-审核通过，2-还未审核
            productId: this.productId
          })
        })
        .then((res) => {
          this.loading = false;
          if (res.data.Success) {
            this.dataList = res.data.Data.ItemList
            this.totalCount = parseInt(res.data.Data.RecordCount);
          }else{
            this.dataList = []
            this.totalCount = 0;
            this.$Message.error(res.data.Description)
          }
        })
    },
    /**
     * [changeSize 切换每页条数]
     * @Author   王柳
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
     * @Author   王柳
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
      this.clickIndex = 3;
      this.getlist()
    },
    // 订单详情
    DetailModal(id) {
      this.showDetailModal = true;
    },
    //清除时间，重新选择最近7天
    clearData() {
      this.openDate = false;
      this.changeTime(1)
    },
    /**
     * [CreateWordFile 生成发货订单]
     * @Author   王柳
     * @DateTime 2017-12-23
     */
    CreateWordFile(id) {
      this.$http.post(this.ApiTransfer("/Order/CreateWordFile"), this.ApiTransfer("/Order/CreateWordFile", {
          id: id
        }))
        .then((res) => {
          if (res.data.Success) {
            this.$Message.success('发货单生成成功')
            var el = document.createElement("a");
            document.body.appendChild(el);
            el.href = res.data.Data //url 是你得到的连接
            el.target = '_new'; //指定在新窗口打开
            el.download = 'true'
            el.click();
            document.body.removeChild(el);
            this.getlist()
          }
        })
    },
    changeStatusFn() {
      this.$refs['formInline'].resetFields()
      this.changeStatusModal = true;
    },
    /**
     * [SetOrderLogisticsInfo 修改发货状态]
     * @Author   王柳
     * @DateTime 2017-12-24
     */
    SetOrderLogisticsInfo(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer("/order/SetOrderLogisticsInfo"),
              this.ApiTransfer("/order/SetOrderLogisticsInfo", {
                orderId: this.changeStatusObj.orderId,
                logisticsCompanyName: this.changeStatusObj.logisticsCompanyName,
                logisticsCode: this.changeStatusObj.logisticsCode,
              })
            )
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success('修改成功')
                this.changeStatusModal = false;
                this.getlist()
              }
            })
        }
      })
    }
  }
}

</script>
<style lang="less">
.person-order {
  .ivu-date-picker {
    position: relative;
  }

  .p1-right {
    float: right;
    font-size: 16px;
    span {
      cursor: pointer;
    }
  }
}

#noFooter {
  .ivu-col {
    line-height: 36px;
    font-size: 15px;
  }
  .ivu-col-span-8 {
    text-align: right;
  }
}

</style>
