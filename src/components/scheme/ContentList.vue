<template>
  <div class='type-content'>
    <div class="system-title resource-system-title ">
      <span style="color: #2cabe3;font-weight: 700;">资源内容管理</span>
      <Button type="primary" style='float:right;margin-right:20px' @click="callbackLastPage">返回</Button>
    </div>
    <div class="resource-header">
      分类： 
      <Select v-model="categoryId" style="width:220px" @on-change="changeCategory">
        <Option v-for="item in categoryList" :value="item.Id" :key="item.Id">{{ item.Category.Title }}</Option>
      </Select>
      <Input v-model="keyWord" icon="ios-search" placeholder="请输入内容标题或社书号" style="float: right;width: 280px;" @on-click="searchInfo()" @on-enter="searchInfo()"></Input>
    </div>
    <Table border :loading='loadingData' ref="selection" :columns="codeDetailsColumns" :data="dataList"></Table>
    <Row style="margin-top: 15px">
      <Page style='float: right;margin-top: ' :total="totalCount" :current='detailscp' :page-size="detailsep" size="small" show-total show-sizer :page-size-opts='[10,20,30]' @on-change="detailsPageChange" @on-page-size-change="detailsPagesizeChange"></Page>
    </Row>
    <!--        查看详情-->
    <Modal v-model="detailsModal" :mask-closable="false" width="550">
      <p slot="header" style="text-align:center;color:#333;">详情</p>
      <Form ref="detailsForm" :model="detailsData" :label-width="120">
        <FormItem label="封面">
          <div class='zhanwei'>
            <img :src="detailsData.CoverUrl" style="max-width:280px;height: 200px" alt="">
          </div>
        </FormItem>
        <FormItem label="内容标题">
          <Input v-model="detailsData.Title" placeholder="" style="width: 300px" readonly></Input>
        </FormItem>
        <FormItem label="作者">
          <Input v-model="detailsData.Author" placeholder="" style="width: 300px" readonly></Input>
        </FormItem>
        <FormItem label="出版社">
          <Input v-model="detailsData.Publisher" placeholder="" style="width: 300px" readonly></Input>
        </FormItem>
        <FormItem label="内容简介">
          <Input v-model="detailsData.Abstracts" type="textarea" :rows="4" placeholder="" readonly style="width: 300px"></Input>
        </FormItem>
        <FormItem label="定价">
          <Input v-model="detailsData.MarketPrice" placeholder="" style="width: 300px" readonly></Input>
        </FormItem>
        <FormItem label="载体类型">
          <Input v-model="detailsData.MediaType" placeholder="" style="width: 300px" readonly></Input>
        </FormItem>
        <FormItem label="类型">
          <span style="line-height: 34px;font-size: 14px;">{{confirmType([detailsData.ObjectType])}}</span>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align: center">
        <Button type="ghost" @click="detailsModal=false">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keyWord: '',
      oldkeyWord: '',
      dataList: [],
      detailsData: {
        Title: ""
      },
      loadingData: false,
      detailsModal: false,
      totalCount: 0,
      detailscp: 1,
      detailsep: 10,
      
      categoryId:0,
      categoryList:[],
      count:0,
     
      more: [
        '下架',
        '编辑价格',
      ],
      codeDetailsColumns: [{
          title: '社书号',
          key: 'Id',
          align: 'center',
        },{
          title: '内容标题',
          key: 'Title',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h("Tooltip", {
                props: {
                  trigger: "hover",
                  content: params.row.Title ? params.row.Title.replace(/<.*?>/ig, "") : "-",
                  placement: "top-start"
                },
                style: {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
              }, params.row.Title.replace(/<.*?>/ig, ""))
            ])
          }

        },
        {
          title: '作者',
          key: 'Author',
          align: 'center',
          // width: 140,
          render: (h, params) => {
            return h('div', [
              h("Tooltip", {
                props: {
                  trigger: "hover",
                  content: params.row.Author ? params.row.Author : "-",
                  placement: "top-start"
                },
                style: {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
              }, params.row.Author ? params.row.Author : "-")
            ])
          }
        },
        {
          title: '出版社',
          key: 'Publisher',
          align: 'center',
          // width: 140,
          render: (h, params) => {
            return h('div', [
              h("Tooltip", {
                props: {
                  trigger: "hover",
                  content: params.row.Publisher ? params.row.Publisher : "-",
                  placement: "top-start"
                },
                style: {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
              }, params.row.Publisher ? params.row.Publisher : "-")
            ])
          }
        }, {
          title: '定价',
          // width: 130,
          render: (h, params) => {
            return h('span', {
              style: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }
            }, params.row.MarketPrice?'¥'+this.formatPrice(params.row.MarketPrice, 2):'¥0.00')
          }
        }, {
          title: '销售价格',
          // width: 130,
          render: (h, params) => {
            return h('span', {
              style: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }
            }, params.row.CurrentPrice?'¥'+this.formatPrice(params.row.CurrentPrice, 2):'¥0.00')
          }
        },
        {
          title: '导入时间',
          key: 'ActivationTime',
          align: 'center',
          // width: 180,
          render: (h, params) => {
            return h('div', [
              h("Tooltip", {
                props: {
                  trigger: "hover",
                  content: params.row.CreateTime ? `${params.row.CreateTime}` : "-",
                  placement: "top-start"
                },
                style: {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
              }, params.row.CreateTime ? `${params.row.CreateTime}` : "-")
            ])
          }

        }, {
          title: '资源状态',
          key: 'IsOnShelf',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  type: params.row.IsOnShelf ? 'success' : 'ghost'
                },
                style: {
                  color: params.row.IsOnShelf ? '#19be6b' : '',
                  backgroundColor: "#fff",
                  cursor: 'default'
                }
              }, params.row.IsOnShelf ? '已上架' : '未上架'),
            ]);
          }
        },
        {
          title: '操作',
          width: 110,
          render: (h, params) => {
            let _this = this;
            let aimArr = [];
            this.more.forEach((item, index) => {
              if (item == '下架') {
                aimArr.push(h('DropdownItem', {
                  props: {
                    name: item,
                  }
                }, params.row.IsOnShelf ? '下架' : '上架'))
              } else {
                aimArr.push(h('DropdownItem', {
                  props: {
                    name: item,
                  }
                }, item))
              }
            })
            return h('div', [
              h('Button', {
                props: {
                  type: "primary",
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.goDetail(params.row)
                  }
                }
              }, '查看详情')
            ]);
          }
        }
      ],
    }
  },
  mounted() {
    this.categoryId = this.$route.query.categoryIds
    this.getlist()
    this.getCategoryList()
    
    this.count=0;
  },
  methods: {
    callbackLastPage(){
      history.go(-1)
    },
    titleType(data) {
      if (data.indexOf("</p>") > 0) {
        return data.replace(/<.*?>/ig, "")
      } else {
        return data
      }
    },
    //查看详情
    goDetail(data) {
      this.detailsModal = true
      this.detailsData = data
    },
    //处理分页
    detailsPageChange(value) {
      this.detailscp = value;
      this.getlist(1);
    },
    //处理分页
    detailsPagesizeChange(value) {
      this.detailscp = 1
      this.detailsep = value;
      this.getlist(1);
    },
    /**
     * [getCategoryList 获取分类]
     * @Author   赵雯欣
     * @DateTime 2018-01-17
     * @return   {[type]}   [description]
     */
    getCategoryList(){
      this.$http.get(this.ApiTransfer("/Hierarchy/GetCategoryList"), {
        params: this.ApiTransfer("/Hierarchy/GetCategoryList", {
          id: '',
          name: 'CabpCourse'
        })
      })
      .then((res) => {
        if (res.data.Success) {
          this.categoryList = res.data.Data
        }
      })
    },
    changeCategory(val){
      this.count++;
      console.log(val)
      console.log(this.count)
      if(this.count>2){
        this.getlist()
      }
    },
    searchInfo() {
      if (this.oldkeyWord != this.keyWord || this.keyWord) {
        this.oldkeyWord = this.keyWord
        this.detailscp = 1
        this.loadingData = true
        if (this.keyWord) {
          this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search", {
              ps: this.detailsep,
              cp: this.detailscp,
              query: JSON.stringify({
                CategoryIds:[this.categoryId],
                Keyword: this.keyWord,
              })
            }, ))
            .then((res) => {
              if (res.data.Success) {
                this.oldkeyWord = this.keyWord
                this.totalCount = res.data.Data.RecordCount
                this.dataList = res.data.Data.ItemList
                this.loadingData = false
              }
            })
        } else {
          this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search", {
              ps: this.detailsep,
              cp: this.detailscp,
              query: JSON.stringify({
                "SearchOrderBy": {
                  "ColumnName": "CreateTime",
                  "Descending": true
                },
                CategoryIds:[this.categoryId],
                Keyword: this.keyWord,
              })
            }, ))
            .then((res) => {
              if (res.data.Success) {
                this.oldkeyWord = this.keyWord
                this.totalCount = res.data.Data.RecordCount
                this.dataList = res.data.Data.ItemList
                this.loadingData = false
              }
            })
        }
      } else {
        this.$Message.warning('请输入内容标题或社书号');
      }
    },
    /**
     * [getlist 机构详情]
     * @Author   刘启瑞
     * @DateTime 2017-11-30
     * @param    {[type]}   id [description]
     * @return   {[type]}      [description]
     */
    getlist() {
      this.loadingData = true
      if (this.oldkeyWord) {
        this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search", {
            ps: this.detailsep,
            cp: this.detailscp,
            query: JSON.stringify({
              CategoryIds:[this.categoryId],
              Keyword: this.oldkeyWord,
            })
          }))
          .then((res) => {
            if (res.data.Success) {
              this.loadingData = false
              this.totalCount = res.data.Data.RecordCount
              this.dataList = res.data.Data.ItemList
            }
          })
      } else {
        this.$http.post(this.ApiTransfer("/Content/Search"), this.ApiTransfer("/Content/Search", {
            ps: this.detailsep,
            cp: this.detailscp,
            query: JSON.stringify({
              "SearchOrderBy": {
                "ColumnName": "CreateTime",
                "Descending": true
              },
              CategoryIds:[this.categoryId],
              Keyword: this.oldkeyWord,
            })
          }))
          .then((res) => {
            if (res.data.Success) {
              this.loadingData = false
              this.totalCount = res.data.Data.RecordCount
              this.dataList = res.data.Data.ItemList
            }
          })
      }
    },
  },
}

</script>
<style lang="less">
.resource-header {
  height: 50px;
}

.zhanwei {
  background: url('../../assets/zhanwei.jpg');
  background-size: 135px 200px;
  background-repeat: no-repeat;
  height: 200px;
}

.file-down {
  margin-top: 10px;
  p {
    font-size: 16px;
    span {
      color: #e75151;
      cursor: pointer;
    }
  }
}

</style>
