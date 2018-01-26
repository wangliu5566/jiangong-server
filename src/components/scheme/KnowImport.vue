<template>
  <div class="know-import">
     <div class="system-title">
      <Icon type="ios-copy-outline" size="27"></Icon>
      <span @click="$router.push('/wrap/scheme/knowWarp')" style="cursor: pointer">知识体系管理 &gt;</span>
      <span class="other-color">导入报表</span>
      <Button type="primary" style='float:right;margin-right:20px' @click="brack">返回</Button>
    </div>
    <Table :loading='loading' border :columns="columnsSuccess" :data="importData"></Table>
    <div class="page">
      <Page :total="parseInt(totalCount)" :current='parseInt(page)' :page-size="pageSize" size="small" show-total show-sizer show-elevator :page-size-opts='[10,20,30]' @on-change="change" @on-page-size-change="eachPageChange"></Page>
    </div>
   <!--  <div class='aggregation'>
      <p>已入库资源：{{GetCateogryTotalCount}}</p>
    </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading:false,
      totalCount: 0,
      page: 1,
      pageSize: 10,
      importData: [],
      GetCateogryTotalCount:0,
      columnsSuccess: [{
        title: '入库时间',
        key: 'CreateTime',
      }, {
        title: '知识元总量',
        key: 'TotalAmount',
      }, {
        title: '成功入库资源总量',
        key: 'SuccessAmount',
      }, {
        title: '异常入库资源总量',
        key: 'FailAmount',
      }, {
        title: '入库清单下载',
        key: 'ExcelFilePath',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  var el = document.createElement("a");
                  document.body.appendChild(el);
                  el.href = params.row.ExcelFilePath; //url 是你得到的连接
                  el.target = '_new'; //指定在新窗口打开
                  el.download = 'true'
                  el.click();
                  document.body.removeChild(el);
                }
              }
            }, '清单下载'),
          ]);
        }
      }],
    }
  },
  mounted() {
    this.getlist()
    // this.getTotalCount()
  },
  methods: {
    //返回上一页
    brack() {
      this.$router.push({
        path: "/wrap/scheme/knowWarp/knowledge",
      })
    },
    //分页切换当前页
    change(page) {
      this.page = page;
      this.getlist()
    },
    //分页数量
    eachPageChange(pageSize) {
      this.page = 1;
      this.pageSize = pageSize;
      this.getlist()
    },
    getlist() {
      this.loading = true
      this.$http.get(this.ApiTransfer("/ImportReport/List"), {
          params: this.ApiTransfer("/ImportReport/List", {
            type: 3,
            cp: this.page,
            ps: this.pageSize,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.importData = res.data.Data.ItemList
            this.totalCount = parseInt(res.data.Data.RecordCount);
            this.loading = false
          }
        })
    },
     getTotalCount(){
       this.$http.get(this.ApiTransfer("/ImportReport/GetTotalCount"), {
          params: this.ApiTransfer("/ImportReport/GetTotalCount", {
            type:3,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            this.GetCateogryTotalCount = res.data.Data;
          }
        })
    }
  }
}

</script>
<style lang="less">
.know-import{

}

</style>
