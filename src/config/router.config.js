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
    redirect: '/generator/database/GenDatabaseList',
    children: [
      // generator
      {
        path: '/generator',
        redirect: '/generator/database/GenDatabaseList',
        component: RouteView,
        meta: { title: '代码生成', icon: 'form', permission: ['generator'] },
        children: [
          {
            path: '/generator/database/GenDatabaseList',
            name: 'GenDatabaseList',
            component: () => import('@/views/generator/database/GenDatabaseList'),
            meta: { title: '数据库', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/generator/table/GenTablesList',
            name: 'GenTablesList',
            component: () => import('@/views/generator/table/GenTableList'),
            meta: { title: '数据表', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/generator/tableConfig/GenTablesConfigList',
            name: 'GenTablesConfigList',
            component: () => import('@/views/generator/tableConfig/GenTableConfigList'),
            meta: { title: '作者配置', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/generator/template/GenTemplateCollectionList',
            name: 'GenTemplateCollectionList',
            component: () => import('@/views/generator/template/GenTemplateCollectionList'),
            meta: { title: '模板组', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/generator/template/GenTemplateConfigList',
            name: 'GenTemplateConfigList',
            component: () => import('@/views/generator/template/GenTemplateConfigList'),
            meta: { title: '模板', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/generator/fieldMapping/GenFieldMappingList',
            name: 'GenFieldMappingList',
            component: () => import('@/views/generator/fieldMapping/GenFieldMappingList'),
            meta: { title: '模板键值', keepAlive: true, permission: ['form'] }
          }
        ]
      },
      // system dictionary
      {
        path: '/dict',
        redirect: '/system/dict/SysDictTypeList',
        component: RouteView,
        meta: { title: '系统配置', icon: 'form', permission: ['generator'] },
        children: [
          {
            path: '/system/dict/SysDictTypeList',
            name: 'SysDictTypeList',
            component: () => import('@/views/system/dict/SysDictTypeList'),
            meta: { title: '字典管理', keepAlive: true, permission: ['form'] }
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
