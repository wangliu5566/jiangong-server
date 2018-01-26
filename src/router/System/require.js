
export default {
  index:resolve => require.ensure([], () => resolve(require('@/components/System/Index.vue')), 'bgSystem0001'),
  code:resolve => require.ensure([], () => resolve(require('@/components/System/Code.vue')), 'bgSystem0002'),
  resource:resolve => require.ensure([], () => resolve(require('@/components/System/Resource.vue')), 'bgSystem0003'),
  deal:resolve => require.ensure([], () => resolve(require('@/components/System/Deal.vue')), 'bgSystem0004'),
  codeStatistic:resolve => require.ensure([], () => resolve(require('@/components/System/CodeStatistic.vue')), 'bgSystem0005'),
  dealresource:resolve => require.ensure([], () => resolve(require('@/components/System/DealResource.vue')), 'bgSystem0006'),
  dealmain:resolve => require.ensure([], () => resolve(require('@/components/System/DealMain.vue')), 'bgSystem0007'),
  blankpage:resolve => require.ensure([], () => resolve(require('@/components/System/BlankPage.vue')), 'bgSystem0001'),

}