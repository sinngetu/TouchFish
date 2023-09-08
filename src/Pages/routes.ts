import { ComponentType } from 'react'
import { redirect, RouteObject } from 'react-router-dom'

import Home from './Home'
import HotList from './HotList'

type C = ComponentType<any>

export const defaultPath = '/home'
const pages = [
  { label: '境外媒体', path: '/home', component: Home },
  { label: '热榜', path: '/hotlist', component: HotList },
]

const routes: RouteObject[] = pages.map(({ path, component }) => ({ path, Component: component as C }))

// routes.push({ path: '*', loader: () => redirect(defaultPath) })

export const tabItems = pages.map(({ label, path }) => ({ label, key: path }))

export default routes
