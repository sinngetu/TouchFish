import { Suspense, useEffect, useRef, useState } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { Button, FloatButton, Layout, Tabs } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

import { backTop } from '@/utils/function'
import TabManage, { Ref as TabManageRef } from '@/common/TabManage'

import routes, { tabItems, defaultPath } from './routes'
import Loading from './Loading'
import './index.less'

const { Header, Content } = Layout
const { BackTop } = FloatButton

export default () => {
  const [showTabs, setShowTabs] = useState<string[]>(localStorage.getItem('show-tabs')?.split(',') || [])
  const tabManage = useRef<TabManageRef>(null)

  useEffect(() => {
    if (Notification && Notification.permission === 'default')
      Notification.requestPermission()
  }, [])

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ color: '#fff' }}>摸舆平台</h1>
      </Header>

      <Content id="content">
        <Button
          type="link"
          icon={<SettingOutlined />}
          onClick={() => tabManage.current?.onShow()}
          style={{ position: 'absolute', right: 50, top: showTabs.length ? undefined : 64, zIndex: 1 }}
        >标签栏管理</Button>

        <Tabs
          id="page-tabs"
          type="card"
          defaultActiveKey={defaultPath}
          items={tabItems.filter(item => showTabs.includes(item.key))}
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

        <TabManage
          ref={tabManage}
          tabs={tabItems}
          initShow={showTabs}
          onChange={keys => {
            setShowTabs(keys)
            localStorage.setItem('show-tabs', keys.join(','))
          }}
        />

        <audio id="notify-audio" src="/notify.wav" />
      </Content>
    </Layout>
  )
}
