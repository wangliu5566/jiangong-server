
export default {
	//首页
  index: resolve => require.ensure([], () => resolve(require('@/components/Index.vue')), 'bgSystem005'),
  //统计分析
  statisticMain:resolve => require.ensure([], () => resolve(require('@/components/statistic/StatisticMain.vue')),'bgSystem0051'),

  userStatistic:resolve => require.ensure([], () => resolve(require('@/components/statistic/UserStatistic')),'bgSystem0052'),

  resourceStatistic:resolve => require.ensure([], () => resolve(require('@/components/statistic/ResourceStatistic')),'bgSystem0053'),

  contentStatistic:resolve => require.ensure([], () => resolve(require('@/components/statistic/ResourceStatistic/ContentStatistic')),'bgSystem0054'),
  smartbookStatistic:resolve => require.ensure([], () => resolve(require('@/components/statistic/ResourceStatistic/SmartbookStatistic')),'bgSystem0054'),
  knowledgeStatistic:resolve => require.ensure([], () => resolve(require('@/components/statistic/ResourceStatistic/KnowledgeStatistic')),'bgSystem0054'),
  courseStatistic:resolve => require.ensure([], () => resolve(require('@/components/statistic/ResourceStatistic/CourseStatistic')),'bgSystem0054'),

  resourceReport:resolve => require.ensure([], () => resolve(require('@/components/statistic/ResourceReport')),'bgSystem0055'),

  resource:resolve => require.ensure([], () => resolve(require('@/components/statistic/ResourceReport/Resource')),'bgSystem0055'),

  scheme:resolve => require.ensure([], () => resolve(require('@/components/statistic/ResourceReport/Scheme')),'bgSystem0055'),

  dealStatistic:resolve => require.ensure([], () => resolve(require('@/components/statistic/DealStatistic')),'bgSystem0056'),

  codeStatistic:resolve => require.ensure([], () => resolve(require('@/components/statistic/CodeStatistic')),'bgSystem0056'),

  //客户端管理
  clientManager:resolve => require.ensure([], () => resolve(require('@/components/Client/ClientUpdate')),'bgSystem0057'),

  

  blankpage:resolve => require.ensure([], () => resolve(require('@/components/common/BlankPage')),'bgSystem005'),

  infoMain:resolve => require.ensure([], () => resolve(require('@/components/Info/InfoMain')),'bgSystem005'),
  pushMessage:resolve => require.ensure([], () => resolve(require('@/components/Info/PushMessage.vue')), 'bgSystem007'),
  noticeManager:resolve => require.ensure([], () => resolve(require('@/components/Info/Notice')),'bgSystem0058'),
  commentManager:resolve => require.ensure([], () => resolve(require('@/components/Info/Comment')),'bgSystem0058'),
}