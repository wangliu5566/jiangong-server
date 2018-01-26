<template>
  <div class="bg-knowledge-list">
    <!-- <Input v-model="keyword" icon="ios-search" placeholder="请输入知识体系" style="width: 300px;margin:15px 0 10px;" @on-click="getkeyWordList()" @on-enter="getkeyWordList()"></Input> -->
    <Table border :loading="loading" :columns="columns2" :data="dataList" @on-selection-change="selectItem"></Table>
    <div class="page">
      <Page :total="parseInt(totalCount)" :current="parseInt(page)" :page-size="pageSize" size="small" show-elevator show-total show-sizer @on-page-size-change='changeSize' @on-change="change"></Page>
    </div>
    <div style="text-align: right;margin-top: 50px;">
      <Button type="ghost" @click="$emit('childrenEmit',2)">取消</Button>
      <Button type="primary" :loading="loadingStatus" @click="importFn">导入</Button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      loadingStatus: false,
      keyword: "",
      oldkeyWord: "",
      totalCount: 0,
      page: "1",
      pageSize: 10,

      dataList: [],
      IdsArr: [],

      columns2: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '编号',
        key: 'Id',
        width: 120,
      }, {
        title: '知识体系名称',
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
        title: '版本号',
        key: 'action',
        width: 120,
        render: (h, params) => {
          return h('div', [
            h("span", params.row.Version ? params.row.Version : "-")
          ])
        }
      }],
    }
  },
  mounted() {
    this.getlist();
  },
  methods: {
    /**
     * [getkeyWordList 搜索关键字]
     * @Author   赵雯欣
     * @DateTime 2017-12-13
     * @return   {[type]}   [description]
     */
    getkeyWordList() {
      if (this.oldkeyWord == this.keyword.trim() && this.keyword.trim() == '') {
        this.$Message.warning('请输入知识元名称')
        return false;
      }
      this.page = 1;
      this.loading = true;
      this.dataList = []
      this.$http.get(this.ApiTransfer("/EukBuildWord/List"), {
          params: this.ApiTransfer("/EukBuildWord/List", {
            // keyWord: this.keyword.trim(),
            cp: this.page,
            ps: this.pageSize,
            // id: this.$route.query.knowledgeId,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            res.data.Data.ItemList.forEach((item) => {
              item = Object.assign({}, item, { _checked: false })
              this.dataList.push(item)
              if (this.IdsArr.indexOf(item.Id) > -1) {
                item._checked = true;
              }
            })

            this.loading = false;
            this.totalCount = parseInt(res.data.Data.RecordCount);
            this.oldkeyWord = this.keyword.trim()
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
      this.dataList = []
      this.$http.get(this.ApiTransfer("/EukBuildWord/List"), {
          params: this.ApiTransfer("/EukBuildWord/List", {
            // keyWord: this.oldkeyWord,
            cp: this.page,
            ps: this.pageSize,
            // id: this.$route.query.knowledgeId,
          })
        })
        .then((res) => {
          if (res.data.Success) {
            res.data.Data.ItemList.forEach((item) => {
              item = Object.assign({}, item, { _checked: false })
              this.dataList.push(item)
              if (this.IdsArr.indexOf(item.Id) > -1) {
                item._checked = true;
              }
            })
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
     * [importFn 导入知识体系]
     * @Author   赵雯欣
     * @DateTime 2018-01-19
     * @return   {[type]}   [description]
     */
    importFn(){
      this.loadingStatus = true;
      this.$http.post(this.ApiTransfer("/EukBuildWord/ImportWord"), 
         this.ApiTransfer("/EukBuildWord/ImportWord", {
            id: this.IdsArr.join(',')
        }))
        .then((res) => {
           this.loadingStatus = false;
          if (res.data.Success) {
            this.loading = false;
            this.$Message.success('导入成功')
            this.$router.push('/wrap/scheme/knowWarp/knowImport')
          }else{
            this.$Message.error(res.data.Description)
          }
        })
    },

  },
}

</script>
<style lang="less">
.bg-knowledge-list {
  margin-top: 15px;

  .btn-line {
    height: 50px;
    margin-top: 25px;
  }

  .page {
    height: 50px;
    padding-top: 15px;

    .ivu-page {
      float: right;
    }
  }
}

</style>
