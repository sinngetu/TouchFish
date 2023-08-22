import { ComponentType } from 'react'
import { redirect, RouteObject } from 'react-router-dom'

import Home from './Home'

type C = ComponentType<any>

const routes: RouteObject[] = [
  { path: '/home', Component: Home as C},
  { path: '*', loader: () => redirect('/home') }
]

export default routes
