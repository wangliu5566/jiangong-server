import Require from "./require.js"

export default [{
  path: 'blank',
  component: Require.blankpage,
}, {
  path: 'index',
  name: '首页',
  component: Require.index,
}, {
  path: 'notice',
  name: '公告管理',
  component: Require.noticeManager
}, {
  path: 'statisticMain',
  name: '统计分析',
  component: Require.statisticMain,
  redirect: '/wrap/statisticMain/dealStatistic',
  children: [{
      path: 'userStatistic',
      name: '用户统计',
      component: Require.userStatistic
    },
    // {
    // path: 'resourceStatistic',
    // name: '资源分析',
    // component: Require.resourceStatistic,

    // children: [
    {
      path: 'content',
      name: '内容统计',
      component: Require.contentStatistic
    },
    // {
    //   path:'smartbook',
    //   name:'智书阅读统计',
    //   component:Require.smartbookStatistic
    // },
    {
      path: 'knowledge',
      name: '知识元阅读统计',
      component: Require.knowledgeStatistic
    }, {
      path: 'course',
      name: '课程学习统计',
      component: Require.courseStatistic
      // }
      // ]
    },
    // {
    //   path: 'resourceReport',
    //   name: '资源入库报表',
    //   component: Require.resourceReport,
    //   children: [
    {
      path: 'resource',
      name: '资源入库',
      component: Require.resource
      // },
      //  {
      //   path: 'scheme',
      //   name: '组织方案入库',
      //   component: Require.scheme
      // }
      // ]
    }, {
      path: 'dealStatistic',
      name: '交易报表',
      component: Require.dealStatistic
    }
    // , {
    //   path: 'codeStatistic',
    //   name: '交易报表',
    //   component: Require.codeStatistic
    // },

  ]
}, {
  path: 'client',
  name: '客户端管理',
  component: Require.clientManager,
}, {
  path: 'infoMain',
  component: Require.infoMain,
  redirect: '/wrap/infoMain/pushMessage',
  children: [{
    path: 'pushMessage',
    name: '消息推送',
    component: Require.pushMessage,
  },{
    path:'notice',
    name:'公告管理',
    component:Require.noticeManager
  },{
    path:'comment',
    name:'评论管理',
    component:Require.commentManager
  }]
}]
