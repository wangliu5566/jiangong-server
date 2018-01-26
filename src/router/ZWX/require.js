
export default {
  // 组织方案
  scheme:resolve => require.ensure([], () => resolve(require('@/components/scheme/Scheme.vue')), 'bgSystem009'),

  knowWarp:resolve => require.ensure([], () => resolve(require('@/components/scheme/knowWarp.vue')), 'bgSystem009'),
  knowledge:resolve => require.ensure([], () => resolve(require('@/components/scheme/knowledge.vue')), 'bgSystem009'),
  knowledgeList:resolve => require.ensure([], () => resolve(require('@/components/scheme/knowledgeList.vue')), 'bgSystem009'),
  knowImport:resolve => require.ensure([], () => resolve(require('@/components/scheme/KnowImport.vue')), 'bgSystem009'),

  typeWrap:resolve => require.ensure([], () => resolve(require('@/components/scheme/TypeWrap.vue')), 'bgSystem0091'),
  type:resolve => require.ensure([], () => resolve(require('@/components/scheme/Type.vue')), 'bgSystem0091'),
  typeList:resolve => require.ensure([], () => resolve(require('@/components/scheme/TypeList.vue')), 'bgSystem0091'),
  typeEchart:resolve => require.ensure([], () => resolve(require('@/components/scheme/TypeEchart.vue')), 'bgSystem0091'),
  TypeImportList:resolve => require.ensure([], () => resolve(require('@/components/scheme/TypeImportList.vue')), 'bgSystem0091'),
  contentList:resolve => require.ensure([], () => resolve(require('@/components/scheme/ContentList.vue')), 'bgSystem0091'),

  //电子商务
  eBusiness:resolve => require.ensure([], () => resolve(require('@/components/Ebusiness/Ebusiness.vue')), 'bgSystem008'),

  personal:resolve => require.ensure([], () => resolve(require('@/components/Ebusiness/PersonalOrder.vue')), 'bgSystem081'),
  eleOrder:resolve => require.ensure([], () => resolve(require('@/components/Ebusiness/EleOrder.vue')), 'bgSystem081'),
  organization:resolve => require.ensure([], () => resolve(require('@/components/Ebusiness/Organization.vue')), 'bgSystem081'),

  shopPay:resolve => require.ensure([], () => resolve(require('@/components/Ebusiness/ShopPay.vue')), 'bgSystem084'),
  salesStrategy:resolve => require.ensure([], () => resolve(require('@/components/Ebusiness/SalesStrategy.vue')), 'bgSystem083'),
  
  //广告
  advertising:resolve => require.ensure([], () => resolve(require('@/components/advertising/Advertising.vue')), 'bgSystem007'),

  advertiser:resolve => require.ensure([], () => resolve(require('@/components/advertising/Advertiser.vue')), 'bgSystem007'),
  advertisingPosition:resolve => require.ensure([], () => resolve(require('@/components/advertising/AdvertisingPosition.vue')), 'bgSystem007'),
  advertisingContent:resolve => require.ensure([], () => resolve(require('@/components/advertising/AdvertisingContent.vue')), 'bgSystem007'),



  //操作日志log
  logs:resolve => require.ensure([], () => resolve(require('@/components/logs/Logs.vue')), 'bgSystem101'),
  adminLogs:resolve => require.ensure([], () => resolve(require('@/components/logs/AdminLogs.vue')), 'bgSystem101'),
  userLogs:resolve => require.ensure([], () => resolve(require('@/components/logs/UserLogs.vue')), 'bgSystem101'),

}