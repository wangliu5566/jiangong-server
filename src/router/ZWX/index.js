import Require from "./require.js"

export default [{
    path: 'scheme',
    name: '组织方案',
    component: Require.scheme,
    redirect: "/wrap/scheme/knowledge",
    children: [{
      path: 'knowWarp',
      component: Require.knowWarp,
      redirect: "/wrap/scheme/knowWarp/knowledge",
      children:[{
        path: 'knowledge',
        component: Require.knowledge,
      }, {
        path: 'knowledgeList',
        component: Require.knowledgeList,
      },{
        path: 'knowImport',
        component: Require.knowImport,
      }]
    },{
      path: 'typeWrap',
      component: Require.typeWrap,
      redirect: "/wrap/scheme/typeWrap/type",
      children:[{
        path: 'type',
        component: Require.type,
      }, {
        path: 'typeList',
        component: Require.typeList,
      },{
        path: 'typeEchart',
        component: Require.typeEchart,
      },{
        path: 'contentList',
        component: Require.contentList,
      },{
        path: 'TypeImportList',
        component: Require.TypeImportList,
      }]
    }]
  }, { //电子商务
    path: 'eBusiness',
    name: '电子商务',
    component: Require.eBusiness,
    redirect: "/wrap/eBusiness/personal",
    children: [{
      path: 'personal',
      component: Require.personal,
    }, {
      path: 'eleOrder',
      component: Require.eleOrder,
    }, {
      path: 'organization',
      component: Require.organization,
    }, {
      path: 'salesStrategy',
      component: Require.salesStrategy,
    }, {
      path: 'shopPay', //审核
      component: Require.shopPay,
    }]
  }, { //广告
    path: 'advertising',
    name: '广告及消息',
    component: Require.advertising,
    redirect: "/wrap/advertising",
    children: [{
      path: 'advertiser',
      component: Require.advertiser,
    }, {
      path: 'advertisingPosition',
      component: Require.advertisingPosition,
    }, {
      path: 'advertisingContent',
      component: Require.advertisingContent,
    }]
  }, { //广告
    path: 'logs',
    name: '操作日志管理',
    component: Require.logs,
    redirect: "/wrap/logs",
    children: [{
      path: 'adminLogs',
      component: Require.adminLogs,
    }, {
      path: 'userLogs',
      component: Require.userLogs,
    }]
  },
  // {
  //   path: 'information',
  //   name: '互动消息列表',
  //   redirect: "/wrap/information/communityList",
  //   component: Require.information,
  //   children: [{
  //     path: 'communityList',
  //     component: Require.communityList,
  //   }]
  // },
]
