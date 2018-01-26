export default {
    //用户管理
    userMain: resolve => require.ensure([], () => resolve(require('@/components/bgSystem/UserMain.vue')), 'bgSystem003'),
    user: resolve => require.ensure([], () => resolve(require('@/components/bgSystem/SystemUser.vue')), 'bgSystem003'),
    admin: resolve => require.ensure([], () => resolve(require('@/components/bgSystem/Admin.vue')), 'bgSystem003'),
    organiza: resolve => require.ensure([], () => resolve(require('@/components/bgSystem/SystemOrganization.vue')), 'bgSystem003'),
    role: resolve => require.ensure([], () => resolve(require('@/components/bgSystem/Role.vue')), 'bgSystem003'),
    Resource: resolve => require.ensure([], () => resolve(require('@/components/resource/resource')), 'bgSystem006'),
    Orgpackage: resolve => require.ensure([], () => resolve(require('@/components/bgSystem/Orgpackage')), 'bgSystem006'),

    //资源导入
    ResourceImport: resolve => require.ensure([], () => resolve(require('@/components/resource/resourceImport/resourceImport')), 'bgSystem0061'),
    FileImport: resolve => require.ensure([], () => resolve(require('@/components/resource/resourceImport/fileImport')), 'bgSystem0061'),
    SchemeImport: resolve => require.ensure([], () => resolve(require('@/components/resource/resourceImport/schemeImport')), 'bgSystem0061'),
    Filellook: resolve => require.ensure([], () => resolve(require('@/components/resource/resourceImport/Filellook')), 'bgSystem0061'),

    // 悦学管理
    YueStudyResourceControl: resolve => require.ensure([], () => resolve(require('@/components/resource/yueStudyResourceControl/yueStudyResourceControl')), 'bgSystem0065'),
    YueStudyCourses: resolve => require.ensure([], () => resolve(require('@/components/resource/yueStudyResourceControl/yueStudyCourses')), 'bgSystem0065'),
    YueStudyDetails: resolve => require.ensure([], () => resolve(require('@/components/resource/yueStudyResourceControl/YueStudyDetails')), 'bgSystem0065'),


    // OA论文管理
    OAResourceControl: resolve => require.ensure([], () => resolve(require('@/components/resource/Itemlist/OAResourceControl')), 'bgSystem0066'),
    OAPeriodical: resolve => require.ensure([], () => resolve(require('@/components/resource/Itemlist/OAPeriodical')), 'bgSystem0066'),


    //题库管理
    QuestionsControl: resolve => require.ensure([], () => resolve(require('@/components/resource/questionsControl/questionsControl')), 'bgSystem0068'),
    Exercise: resolve => require.ensure([], () => resolve(require('@/components/resource/questionsControl/Exercise')), 'bgSystem0068'),
    TestPaper: resolve => require.ensure([], () => resolve(require('@/components/resource/questionsControl/TestPaper')), 'bgSystem0068'),

}
