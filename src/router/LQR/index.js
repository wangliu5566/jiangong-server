import Require from "./require.js"

export default [
    {
        path: 'userMain',
        name: '用户管理及安全控制',
        component: Require.userMain,
        redirect: '/wrap/userMain/user',
        children: [{
                path: 'user',
                component: Require.user,
            },
            {
                path: 'admin',
                component: Require.admin,
            }, {
                path: 'organiza',
                component: Require.organiza,
            }, {
                path: 'role',
                component: Require.role,
            } ,{
                path: 'Orgpackage',
                component: Require.Orgpackage,
            }]
    },{
        path: 'resource',
        name: '内容资源管理',
        component: Require.Resource,
        redirect: 'resourceImport',
        children: [
            {
                //资源导入模块
                path: 'resourceImport',
                component: Require.ResourceImport,
                redirect: 'resourceImport/fileImport',
                children: [
                    {
                        path: 'fileImport',
                        component: Require.FileImport
                },
                    {
                        path: 'schemeImport',
                        component: Require.SchemeImport
                },   {
                        path: 'Filellook',
                        component: Require.Filellook
                }, ]
            },
            {
                //悦学内容管理模块
                path: 'yueStudyResourceControl',
                component: Require.YueStudyResourceControl,
                redirect: 'yueStudyResourceControl/yueStudyCourses',
                children: [
                    {
                        path: 'yueStudyCourses',
                        component: Require.YueStudyCourses
                },
                    {
                        path: 'YueStudyDetails',
                        component: Require.YueStudyDetails
                }]
            },
            {
                //OA论文管理模块
                path: 'OAResourceControl',
                component: Require.OAResourceControl,
                redirect: 'OAResourceControl/OAPeriodical',
                children: [
                    {
                        path: 'OAPeriodical',
                        component: Require.OAPeriodical
                }]
            },

            {
                //题库管理
                path: 'questionsControl',
                component: Require.QuestionsControl,
                redirect: 'questionsControl/testPaper',
                children: [
                    
                    {
                        path: 'testPaper',
                        component: Require.TestPaper
                },{
                        path: 'exercise',
                        component: Require.Exercise
                },]
            }
                ]
    }]
