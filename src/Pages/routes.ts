import { ComponentType } from 'react'
import { redirect, RouteObject } from 'react-router-dom'

import Overseas from './Overseas'
import HotList from './HotList'
import Daddy from './Daddy'

type C = ComponentType<any>

export const defaultPath = '/overseas'
const pages = [
  { label: '境外媒体', path: '/overseas', component: Overseas },
  { label: '热榜', path: '/hotlist', component: HotList },
  { label: '大爹专区', path: '/daddy', component: Daddy },
]

const routes: RouteObject[] = pages.map(({ path, component }) => ({ path, Component: component as C }))

// routes.push({ path: '*', loader: () => redirect(defaultPath) })

export const tabItems = pages.map(({ label, path }) => ({ label, key: path }))

export default routes
