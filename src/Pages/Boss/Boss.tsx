import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Button, Timeline } from 'antd'
import { DownOutlined, ReloadOutlined } from '@ant-design/icons'

import Store from './store'

import './index.less'

const Boss: React.FC = () => {
  const [store] = useState(new Store())
  const { loading, span, onRefresh, onGetMoreNews } = store

  useEffect(() => { store.getList() }, [])

  return (
    <div className="warp">
      <div className="toolbar">
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={onRefresh}
          style={{ marginRight: 12 }}
        >刷新</Button>
      </div>

      <Timeline
        className="hotlist"
        mode="left"
        items={store.list}
        style={{
          position: 'relative',
          left: 'calc(-50% + 87px)',
          top: 10
        }}
      />

      <div style={{ borderTop: '3px solid #4096ff', paddingTop: 12 }}>
        已加载<span style={{ margin: '0 2px', color: '#1677ff' }}>{span}小时</span>数据
        <Button
          size="small"
          type="primary"
          icon={<DownOutlined />}
          loading={loading}
          onClick={onGetMoreNews}
          style={{ marginLeft: 12 }}
        >更多</Button>
      </div>
    </div>
  )
}

export default observer(Boss)