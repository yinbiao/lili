/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2022-04-23 11:49:23
 * @LastEditors: sueRimn
 * @LastEditTime: 2022-05-03 09:31:30
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/deploy/req/',
    name: 'deploy.req',
    icon: 'smile',
    component: './DeployReq',
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/deploy/req/',
  },
  {
    component: './404',
  },
];
