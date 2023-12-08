import React, { Fragment, useEffect, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Timeline } from 'antd'
import { DownOutlined, ReloadOutlined, SettingOutlined, StarOutlined, StarFilled, SyncOutlined, WeiboOutlined } from '@ant-design/icons'

import AppStore from '@/store'
import api from '@/api/hotlist'
import KeywordManage, { Ref } from '@/common/KeywordManage'

import Store from './store'

import './index.less'

interface Props { appStore: AppStore }

const HotList: React.FC<Props> = props => {
  const [store] = useState(new Store(props.appStore))
  const keywordManage = useRef<Ref>(null)
  const { span, marked, loading, onRefresh, onGetMoreNews, onMark, getListColor, highlightKeyword } = store

  useEffect(() => {
    store.autoRefresh()
    return store.onDestory
  }, [])

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

      <div style={{ display: 'flex' }}>
        <div style={{ flexGrow: 3 }}>
          <Timeline
            className="hotlist"
            mode="left"
            items={store.list}
            style={{
              position: 'relative',
              left: 'calc(-75% + 87px)',
              width: '150%',
              top: 10
            }}
          />
        </div>

        <div style={{ flexGrow: 2 }}>
          {store.weiboList.length ? (
            <div className='weibo-list'>
              <span className='title'><WeiboOutlined style={{ position: 'relative', right: -3 }} /> 微 博</span>
              <span className='cut-line' />
              <div className='info'>
                <a className='red'>红色 &lt; 5分钟</a>
                <a className='yellow'>黄色 &lt; 15分钟</a>
                <a className='black'>黑色 &lt; 6小时</a>
                <a className='gray'>灰色 &gt; 6小时</a>
              </div>

              {store.weiboList.map((item, i) => (
                <Fragment key={item.hash}>
                  <div className='item' key={item.hash}>
                    <span className='mark' onClick={() => onMark(item.hash)}>
                      {marked.includes(item.hash)
                        ? <StarFilled style={{ color: '#fbca0d' }} />
                        : <StarOutlined style={{ color: '#ccc' }} />
                      }
                    </span>

                    <span className='No'>{i+1}.</span>
                    <a className={getListColor(item.date)} target='_blank' href={item.link}>{highlightKeyword(item.content)}</a>
                  </div>

                  {i === 9 ? <div style={{ borderBottom: '3px solid #eee', marginBottom: 6 }} /> : null}
                </Fragment>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <audio id="notify-audio" src="/notify.wav" />

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

      <KeywordManage
        ref={keywordManage}
        keywordIndex={0}
        addAPI={api.addKeyword}
        delAPI={api.delKeyword}
      />
    </div>
  )
}

export default inject('appStore')(observer(HotList))
