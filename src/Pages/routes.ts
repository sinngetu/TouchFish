import { ComponentType } from 'react'
import { redirect, RouteObject } from 'react-router-dom'

import Overseas from './Overseas'
import HotList from './HotList'
import Daddy from './Daddy'
import Globalization from './Globalization'
import Wanda from './Wanda'

type C = ComponentType<any>

export const defaultPath = '/overseas'
const pages = [
  { label: '境外媒体', path: '/overseas', component: Overseas },
  { label: '热榜', path: '/hotlist', component: HotList },
  { label: '高层动态', path: '/daddy', component: Daddy },
  { label: '全球化', path: '/globalization', component: Globalization },
  { label: '万达', path: '/wanda', component: Wanda },
]

const routes: RouteObject[] = pages.map(({ path, component }) => ({ path, Component: component as C }))

// routes.push({ path: '*', loader: () => redirect(defaultPath) })

export const tabItems = pages.map(({ label, path }) => ({ label, key: path }))

export default routes
