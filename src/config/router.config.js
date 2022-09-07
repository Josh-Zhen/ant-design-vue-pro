// eslint-disable-next-line
import { UserLayout, BasicLayout } from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/generator/GenDatabaseList',
    children: [
      // generator
      {
        path: '/generator',
        redirect: '/generator/GenDatabaseList',
        component: RouteView,
        meta: { title: 'menu.generator', icon: 'form', permission: ['generator'] },
        children: [
          {
            path: '/generator/GenDatabaseList',
            name: 'GenDatabaseList',
            component: () => import('@/views/generator/database/GenDatabaseList'),
            meta: { title: 'menu.form.basic-form', keepAlive: true, permission: ['form'] }
          }
        ]
      },
      // system dictionary
      {
        path: '/dict',
        redirect: '/system/dict/SysDictTypeList',
        component: RouteView,
        meta: { title: 'menu.generator', icon: 'form', permission: ['generator'] },
        children: [
          {
            path: '/system/dict/SysDictTypeList',
            name: 'SysDictTypeList',
            component: () => import('@/views/system/dict/SysDictTypeList'),
            meta: { title: 'menu.form.basic-form', keepAlive: true, permission: ['form'] }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
