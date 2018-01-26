<template>
  <div class="statistic-col no-border">
    <Row type="flex" justify="space-between">
      <div class="countClass no-border">
        <div class="spanText">
          <span class="countTitle">课程学习排行列表</span>
        </div>
        <div class="sale-count-change">
          <Input style="width:300px;" v-model="searchKey" icon="ios-search-strong" placeholder="输入您要查找的关键字" @on-click="searchInfo" @on-enter="searchInfo"></Input>
          </Col>
        </div>
        <!-- <div class="condition-select">
          <span>
            类型：
          </span>
          <span>
            <Select v-model="type" style="width:200px">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </span>
        </div> -->
      </div>
    </Row>
    <Row class="pd5">
      <Table :loading="loadingData" :columns="accountColumns" :data="accountDatas" highlight-row>
      </Table>
    </Row>
    <Row class="tr pt5 pb10">
      <Page :total="tp" :current="cp" :page-size="ep" size="small" show-total show-sizer :page-size-opts='[10,20,30]' @on-change="currentPageChange" @on-page-size-change="eachPageChange"></Page>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: '107',
      searchKey: '',
      typeList: [{
        value: '0',
        label: '全部'
      }],
      //表格配置
      accountColumns: [{
        title: '编号',
        ellipsis: true,
        render: (h, params) => {
          return h('span',{
            attrs: {
              title: params.row.Id ? params.row.Id : ''
            }
          }, params.row.Id ? params.row.Id : '-')
        }
      }, {
        title: '产品名称',
        ellipsis: true,
        render: (h, params) => {
          return h('span',{
            attrs: {
              title: params.row.Title ? params.row.Title : ''
            }
          }, params.row.Title ? params.row.Title : '-')
        }
      }, {
        title: '浏览量',
        key: 'ViewCount',
        ellipsis: true,
        render: (h, params) => {
          return h('span',{
            attrs: {
              title: params.row.ViewCount ? params.row.ViewCount : ''
            }
          }, params.row.ViewCount ? params.row.ViewCount : '0')
        }
      }, {
        title: '阅读量',
        key: 'Id',
        ellipsis: true,
        render: (h, params) => {
          return h('span',{
            attrs: {
              title: params.row.ReadCount ? params.row.ReadCount : ''
            }
          }, params.row.ReadCount ? params.row.ReadCount : '0')
        }
      }
      // , {
      //   title: '个人用户销售量',
      //   ellipsis: true,
      //   render: (h, params) => {
      //     return h('span',{
      //       attrs: {
      //         title: params.row.ReadCount ? params.row.ReadCount : ''
      //       }
      //     }, params.row.ReadCount ? params.row.ReadCount : '0')
      //   }
      // }
      ],

      //表格数据
      accountDatas: [],
      cp: 1,
      ep: 10,
      tp: 100,
      loadingData: false,
    }
  },
  created(){
    this.getListData();
  },
  methods: {
    initTime() {
      let dataRange = this.calculateDate(this.defaultStatus);
      this.startTime = dataRange[0];
      this.endTime = dataRange[1];
    },
    handleChange(date) {
      if (this.checkDateIsClear(date)) {
        this.defaultStatus = 1;
        this.initTime();
        this.getListData();
      } else {
        this.defaultStatus = 999999;
        this.startTime = date[0];
        this.endTime = date[1];
        this.getListData();
      }

    },
    /**
     * [时间状态改变事件]
     * @作者     王柳
     * @日期     2017-10-18
     */
    statusChange(value) {
      this.value = [];
      this.initTime();
      this.getListData();
    },

    /**
     * [获取操作列表]
     * @作者     王柳
     * @日期     2017-10-19
     */
    getListData(isSearch=false) {
      var paramsData = {};
      paramsData = {
        cp: this.cp,
        ps: this.ep,
        query:JSON.stringify({
          Keyword:isSearch?this.searchKey.trim():this.oldKey,
          SearchOrderBy:{
            ColumnName:this.sortType,
            Descending:true,
          },
          ObjectTypes:this.type==0?[]:[this.type]
        })
      }
      this.loadingData = true;
      this.$http.post(this.ApiTransfer('/Content/Search'),this.ApiTransfer('/Content/Search', paramsData)).then((res) => {
        if (res.data.Success) {
          this.loadingData = false;
          this.accountDatas = res.data.Data.ItemList;
          this.tp = parseInt(res.data.Data.RecordCount);

          if (isSearch) {
              this.oldKey = this.searchKey.trim();
            }
        }

      })
    },

    searchInfo() {
      if (this.oldKey == this.searchKey.trim() && this.searchKey.trim() == '') {
        this.$Message.warning('搜索关键字不能为空')
      } else {
        this.cp = 1;
        this.selectItem = [];
        this.getListData(true);
      }
    },
    //分页
    currentPageChange(value) {
      this.cp = value;
      this.getListData();
    },
    eachPageChange(value) {
      this.ep = value;
      this.cp = 1;
      this.getListData();
    },
  }
}

</script>
