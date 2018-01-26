import Require from "./require.js"

export default [{
    path: 'index',
    name: '机构管理员首页',
    component: Require.index,
  }, {
    path: 'code',
    name: '机构验证码管理',
    component: Require.code,
  }, {
    path: 'resource',
    name: '机构资源查看',
    component: Require.resource,
  }, {
    path: 'deal',
    component: Require.dealmain,
    redirect: 'check',
    children: [{
      path: 'check',
      name: '机构订单查看',
      component: Require.deal
    }, {
      path: 'dealresource',
      name: '机构订单资源',
      component: Require.dealresource
    }]
  }, {
    path: 'codestatistic',
    name: '机构码统计',
    component: Require.codeStatistic,
  }, {
    path: 'blank',
    component: Require.blankpage
  }

]
