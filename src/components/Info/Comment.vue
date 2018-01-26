<template>
  <div class="message-container">
    <Row>
      <div class="system-title">
        <Icon type="android-hangout" size="24"></Icon>
        <span>评论管理</span>
      </div>
    </Row>
    <Row>
      <Col span='8'>
      <span>&nbsp;</span>
      </Col>
      <Col span="8">
      <span>&nbsp;</span>
      </Col>
      <Col span="8">
      <Input v-model="filter.searchKey" icon="ios-search-strong" placeholder="请输入评论内容" @on-click="searchInfo" @on-enter="searchInfo"></Input>
      </Col>
    </Row>
    <Row class="pt10 pb10">
      <Table border :loading="loadingData" :columns="accountColumns" :data="accountDatas" @on-select="tableSelectCurrent" @on-select-all='tableSelectAll' @on-select-cancel="tableCancelCurrent" @on-selection-change="tableChange" highlight-row no-data-text="暂无数据">
      </Table>
    </Row>
    <Row class="tr pt5 pb10">
      <Page :total="tp" :current='cp' :page-size="ep" size="small" show-total show-sizer show-elevator :page-size-opts='[10,20,30]' @on-change="currentPageChange" @on-page-size-change="eachPageChange"></Page>
    </Row>
  </div>
</template>
<script>
import validator from '@/validate.js'
export default {
  beforeRouteLeave(to, from, next) {
    window.sessionStorage.setItem('bg_user_filter', '')
    next();
  },
  data() {
    const filters = window.sessionStorage.getItem('bg_user_filter');
    const userInfo = JSON.parse(window.sessionStorage.getItem('bg_user_info'));
    return {
      baseUrl: baseUrl,
      //筛选条件
      filter: {
        searchKey: '',
      },
      loadingData: false,

      oldKey: '',

      //分页
      tp: 0,
      cp: filters != null && filters != '' && JSON.parse(filters) != {} && JSON.parse(filters).cp ? parseInt(JSON.parse(filters).cp) : 1,
      ep: filters != null && filters != '' && JSON.parse(filters) != {} && JSON.parse(filters).ep ? parseInt(JSON.parse(filters).ep) : 10,

      //表格配置
      accountColumns: [
        // {
        //   title: 'ID',
        //   key: 'Id',
        //   width: 100
        // }, 
        {
          title: '用户名',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
                attrs: {
                  title: !params.row.User ? '-' : params.row.User.NickName ? params.row.User.NickName : params.row.User.Email ? params.row.User.Email : params.row.User.MobileNumber ? params.row.User.MobileNumber : '-'
                }
              }, !params.row.User ? '-' : params.row.User.NickName ? params.row.User.NickName : params.row.User.Email ? params.row.User.Email : params.row.User.MobileNumber ? params.row.User.MobileNumber : '-'
            )
          }
        }, {
          title: '评论内容',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.Contents ? params.row.Contents : ''
              }
            }, params.row.Contents ? params.row.Contents : '-')
          }
        }, {
          title: '对应资源',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.ExtendData.CommentContent ? params.row.ExtendData.CommentContent : ''
              }
            }, params.row.ExtendData.CommentContent ? params.row.ExtendData.CommentContent : '-')
          }
        },
        {
          title: '评论时间',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.CreateTime
              }
            }, params.row.CreateTime)
          }
        }, {
          title: '操作',
          key: 'action',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteComment(params.row, params.index);
                  }
                }
              }, '删除'),

            ])
          }
        }
      ],

      //表格数据
      accountDatas: [],

      //表格选中项
      selectItem: [],
    }
  },
  methods: {
    /**
     * [getListData 获取评论列表]
     * @Author   李志明
     * @DateTime 2017-11-06
     * @return   {[type]}   [description]
     */
    getListData(isSearch = false) {
      this.loadingData = true;
      this.$http.get(this.ApiTransfer('/Comment/List'), {
        params: this.ApiTransfer('/Comment/List', {
          keyWord: isSearch ? this.filter.searchKey.trim() : this.oldKey,
          ps: this.ep,
          cp: this.cp,
          fp: this.ep,
        })
      }).then((res) => {
        if (res.data.Success) {
          this.accountDatas = res.data.Data.ItemList;
          this.tp = parseInt(res.data.Data.RecordCount)
          this.loadingData = false;
          if (isSearch) {
            this.oldKey = this.filter.searchKey.trim();
          }
        }

      })
    },

    /**
     * [searchInfo 关键字搜索列表]
     * @Author   李志明
     * @DateTime 2017-11-06
     * @return   {[type]}   [description]
     */
    searchInfo() {
      if (this.oldKey == this.filter.searchKey.trim() && this.filter.searchKey.trim() == '') {
        this.$Message.warning('请输入评论标题')
      } else {
        this.cp = 1;
        this.updateFilter({ 'searchKey': this.filter.searchKey });
        this.selectItem = [];
        this.getListData(true);
      }
    },

    //分页
    currentPageChange(value) {
      this.cp = value;
      this.updateFilter({ 'cp': this.cp });
      this.getListData();
    },

    eachPageChange(value) {
      this.ep = value;
      this.cp = 1;
      this.updateFilter({ 'ep': this.ep });
      this.getListData();
    },
    //表格单选/单选
    tableSelectCurrent(selection) {
      this.selectItem = selection;
    },
    tableSelectAll(selection) {
      this.selectItem = selection;
    },
    tableCancelCurrent(selection, row) {
      this.selectItem = selection;
    },
    tableChange(selection) {
      this.selectItem = selection;
    },

    /**
     * [deleteComment删除评论]
     * @Author   李志明
     * @DateTime 2017-11-06
     * @param    {[Object]}   row   [当前行数据]
     * @param    {[String]}   index [当前行角标]
     * @return   {[type]}         [description]
     */
    deleteComment(row, index) {
      this.$Modal.confirm({
        title: '操作提示',
        content: '确认删除该评论？',
        onOk: () => {
          this.$http.post(this.ApiTransfer('/Comment/Delete'), this.ApiTransfer('/Comment/Delete', {
            ids: row.Id,
          })).then((res) => {
            if (res.data.Success) {
              this.$Message.success('删除操作成功');
              this.getListData();
            }
          })
        },
      });
    },

  },
  created() {
    this.getListData();
  },
  watch: {},

}

</script>
<style lang="less">


</style>
