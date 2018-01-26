<template>
  <div class="bg-type-list">
    <div class="system-title">
      <Icon type="ipricetag" size="27"></Icon>
      <span @click="goIndex('/wrap/scheme/typeWrap')" style="cursor: pointer">分类体系管理 &gt;</span>
      <span class="other-color">分类列表</span>
    </div>
    <div>
      <table id="treeTable1" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th style="width: 100px;">编号</th>
            <th style="min-width: 100px;">类别</th>
            <th style="width: 110px">子分类数量</th>
            <th style="width: 100px">内容数量</th>
            <th style="width: 110px">知识元数量</th>
            <th style="width: 180px">导入时间</th>
            <th style="width: 190px;">操作</th>
          </tr>
        </thead>
        <tbody id="tbody" v-if="typeDetailList.length!=0">
          <tr v-for="(item,index) in typeDetailList" :data-tt-id="item.Id" :data-tt-parent-id="item.ParentId==0?'':item.ParentId">
            <td>{{item.Id}}</td>
            <td>{{item.Category.Title}}</td>
            <td>{{item.Category.ChildCount}}</td>
            <td><span style="color:#2cabe3;cursor:pointer;" @click="otherPage(1,item.Id)">{{item.ContentCount}}</span></td>
            <td><span style="color:#2cabe3;cursor:pointer;" @click="otherPage(2,item.Id)">{{item.WordCount}}</span></td>
            <td>{{item.Category.CreateTime}}</td>
            <td>
              <Button type="primary" size="small" @click="addChildrenType(item.Id,item.Category.SouceType)">添加子分类</Button>
              <Button type="primary" size="small" @click="delType(item.Id)">删除分类</Button>
            </td>
          </tr>
        </tbody>
        <tbody v-if="typeDetailList.length==0">
          <tr>
            <td colspan="7" style="text-align:center;line-height: 60px;">-</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Spin fix size="large" v-if="loading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
    <!-- 添加子分类-->
    <Modal v-model="addTypeModal" :mask-closable="false" id="noFooter" width="630" :closable="false">
      <p slot="header" style="text-align:center;color:#333;">添加子分类</p>
      <Form ref="formInline" :model="addItem" :rules="ruleInline" :label-width="100">
        <FormItem label="子分类名称:" prop="title">
          <Input v-model="addItem.title" placeholder="请输入子分类名称"></Input>
        </FormItem>
        <div style="text-align: center;">
          <Button type="ghost" @click="addTypeModal=false">取消</Button>
          <Button type="primary" @click="addChildrenFn('formInline')">新增</Button>
        </div>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      keyWord: '',
      typeDetailList: [],
      selectList: [],
      selectIndex: 0,
      isShow: false,
      addTypeModal: false,
      addItem: {
        title: "",
        description: ""
      },
      ruleInline: {
        title: [{
          required: true,
          message: '请填写子分类名称',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '请填写简介',
          trigger: 'blur'
        }],
      },
      Id: "",
      SouceType: ""
    }
  },
  created() {
    this.getlist()
  },
  updated() {
    $('#treeTable1').treetable({
      expandable: true,
      column: 1
    });
  },
  methods: {
    otherPage(index, id) {
      if (index == 1) {
        this.$router.push({ path: '/wrap/scheme/typeWrap/contentList', query: { categoryIds: id } })
      } else if (index == 2) {
        this.$router.push({ path: '/wrap/scheme/knowWarp/knowledgeList', query: { categoryIds: id } })
      }
    },
    setResource(id) {
      this.setResourceModal = true;
    },
    getlist() {
      this.loading = true;
      this.$http.get(this.ApiTransfer("/Hierarchy/GetCategoryList"), {
          params: this.ApiTransfer("/Hierarchy/GetCategoryList", {
            id: this.$route.query.typeId,
            ps: 999999,
            cp: 1
          })
        })
        .then((res) => {
          this.loading = false;
          if (res.data.Success) {
            this.typeDetailList = res.data.Data;

          }
        })
    },
    goIndex(path) {
      this.$router.push(path)
    },
    //添加子分类
    addChildrenType(Id, SouceType) {
      this.addItem.title = '';
      this.addItem.description = '';
      this.addTypeModal = true;
      this.Id = Id;
      this.SouceType = SouceType;
    },
    addChildrenFn(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post(this.ApiTransfer("/Category/CreateChild"), this.ApiTransfer("/Category/CreateChild", {
              title: this.addItem.title,
              description: this.addItem.description,
              parentId: this.Id,
              sourceType: this.SouceType,
              userId: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id,
              hierarchyId: this.$route.query.typeId
            }))
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success('添加子分类成功')
                history.go(0)
              }
            })
        }
      })
    },
    //删除
    delType(id) {
      this.$Modal.confirm({
        title: '确定要删除么？',
        content: '<p>一旦删除，无法找回哟</p>',
        onOk: () => {
          this.$http.post(this.ApiTransfer("/Category/DeleteChild"), this.ApiTransfer("/Category/DeleteChild", {
              id: id,
              userId: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id
            }))
            .then((res) => {
              if (res.data.Success) {
                this.$Message.success('删除成功')
                history.go(0)
              } else {
                this.$Message.error(res.data.Description)
              }
            })
        }
      });
    },
  }
}

</script>
<style lang="less">
.bg-type-list {
  min-width: 910px;
  width: 100%;
  position: relative;

  .btn-line {
    height: 50px;
    margin-top: 25px;
  }

  .ivu-input-icon {
    font-size: 14px;
  }

  table {
    width: 100%;
    border: 1px solid #ddd;
    color: #495060;
    font-size: 14px;
    display: table;
  }
  th {
    background-color: #f8f8f9;
    margin: 0;
    padding: 0;
    border-right: 1px solid #e9eaec;
    line-height: 40px;
    border-bottom: 1px solid #e9eaec;
    padding: 0 18px;
    text-align: left;
  }
  td {
    margin: 0;
    padding: 0;
    border-right: 1px solid #e9eaec;
    line-height: 40px;
    border-bottom: 1px solid #e9eaec;
    padding: 0 18px;
    text-align: left;
    background-color: #fff;
  }
  td:nth-child(7n),
  th:nth-child(7) {
    border-right: none;
  }

  tr:last-child td {
    border-bottom: none;
  }

  .yellows {
    background-color: #DBECEA;
  }

  #tbody .active {
    background-color: #C9D3E4
  }
  tbody tr:hover {
    background-color: #ebf7ff;
  }
}

</style>
