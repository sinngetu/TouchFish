import { Suspense } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { FloatButton, Layout } from 'antd'

import routes from './routes'
import Loading from './Loading'
import { backTop } from '@/utils/function'
import './index.less'

const { Header, Content } = Layout
const { BackTop } = FloatButton

export default () => (
  <Layout>
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <h1 style={{ color: '#fff' }}>摸鱼平台</h1>
    </Header>

    <Content id="content">
      <RouterProvider router={createHashRouter(routes)} fallbackElement={<Loading />} />
      <BackTop
        visibilityHeight={0}
        type='primary'
        onClick={() => backTop(document.getElementById('content') as HTMLElement)}
      />
    </Content>
  </Layout>
)
