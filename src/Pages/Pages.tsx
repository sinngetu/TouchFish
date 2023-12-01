import { Suspense } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { FloatButton, Layout, Tabs } from 'antd'

import routes, { tabItems, defaultPath } from './routes'
import Loading from './Loading'
import { backTop } from '@/utils/function'
import './index.less'

const { Header, Content } = Layout
const { BackTop } = FloatButton

export default () => (
  <Layout>
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <h1 style={{ color: '#fff' }}>摸舆平台</h1>
    </Header>

    <Content id="content">
      <Tabs
        id='page-tabs'
        type='card'
        defaultActiveKey={defaultPath}
        items={tabItems}
        onChange={path => window.location.hash = `#${path}`}
      />

      <Suspense>
        <RouterProvider
          router={createHashRouter(routes)}
          fallbackElement={<Loading />}
        />
      </Suspense>

      <BackTop
        visibilityHeight={0}
        type='primary'
        onClick={() => backTop(document.getElementById('content') as HTMLElement)}
      />
    </Content>
  </Layout>
)
