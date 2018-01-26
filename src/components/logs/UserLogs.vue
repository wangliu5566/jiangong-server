<template>
  <div class="admin-logs">
    <div class="system-title">
      <Icon type="easel" size="27"></Icon><span>用户操作日志</span>
    </div>

    <Table border :loading="loading" :columns="columns" :data="msgList"></Table>
    
    <div class="page">
      <Page :total="parseInt(totalCount)" size="small" show-elevator :current="parseInt(page)" :page-size="pageSize" show-total show-sizer @on-page-size-change='changeSize' @on-change="change"></Page>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      totalCount: 0,
      page: "1",
      pageSize: 10,
      msgList: [],

      columns: [{
        title: '编号',
        key: 'Id',
        width: 100,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Id)
          ])
        }
      }, {
        title: '用户名',
        key: 'UserName',
        width: 200,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.UserName?params.row.UserName:'暂无')
          ])
        }
      },{
        title: '操作记录',
        key: 'Message',
        ellipsis: true,
        render: (h, params) => {
         return h('div', [
            h("span", params.row.Message ? params.row.Message : "-")
          ])
        }
      }],
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    /**
     * [getlist 获取消息列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-19
     * @return   {[type]}   [description]
     */
    getlist() {
      this.loading = true;
      this.$http.get(this.ApiTransfer("/Log/List"), {
          params: this.ApiTransfer("/Log/List", {
            type: 2,
            cp: this.page,
            ps: this.pageSize,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.msgList = res.data.Data.ItemList
            this.totalCount = parseInt(res.data.Data.RecordCount);
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

  },
}

</script>
<style lang="less">
.admin-logs {
  .page {
    height: 50px;
    padding-top: 15px;

    .ivu-page {
      float: right;
    }
  }
}

</style>
