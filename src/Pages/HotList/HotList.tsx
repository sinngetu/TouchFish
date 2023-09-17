import React, { useEffect, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Timeline } from 'antd'
import { DownOutlined, ReloadOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons'

import AppStore from '@/store'

import Store from './store'
import KeywordManage, { Ref } from './KeywordManage'

import './index.less'

interface Props { appStore: AppStore }

const HotList: React.FC<Props> = props => {
  const [store] = useState(new Store(props.appStore))
  const { span, loading, onRefresh, onGetMoreNews } = store
  const keywordManage = useRef<Ref>(null)

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

        <Button disabled icon={<SyncOutlined />}>切换风格</Button>

        <div className="toolbar-right">
          <Button
            type="link"
            icon={<SettingOutlined />}
            onClick={keywordManage.current?.onShow}
          >关键词管理</Button>
        </div>
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

      <KeywordManage ref={keywordManage} />
    </div>
  )
}

export default inject('appStore')(observer(HotList))
