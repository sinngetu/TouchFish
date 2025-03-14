import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Dropdown, Timeline } from 'antd'
import { DownOutlined, ReloadOutlined, SettingOutlined, PictureOutlined, WeiboOutlined } from '@ant-design/icons'
import { MenuProps } from 'antd/es/menu'

import AppStore from '@/store'
import api from '@/api/hotlist'
import { KEYWORD_TYPE } from '@/utils/constant'
import KeywordManage, { Ref as KeywordManageRef } from '@/common/KeywordManage'

import Store from './store'
import Screenshot, { Ref as ScreenshotRef } from './Screenshot'

import './index.less'

interface Props { appStore: AppStore }

const HotList: React.FC<Props> = props => {
  const hotManage = useRef<KeywordManageRef>(null)
  const risingManage = useRef<KeywordManageRef>(null)
  const [store] = useState(new Store(props.appStore))
  const { span, loading, onRefresh, onGetMoreNews, onShow, getListColor, setScreenShow, highlightKeyword } = store
  const _setScreenShow = useCallback((screenshot: ScreenshotRef) => setScreenShow(screenshot && screenshot.onShow), [store])

  const manageMenu: MenuProps = useMemo(() => ({
    items: [
      { key: 'hot', label: '热搜' },
      { key: 'rising', label: '上升榜' },
    ],

    onClick: ({ key }) => {
      switch (key) {
        case 'hot': return hotManage.current?.onShow()
        case 'rising': return risingManage.current?.onShow()
      }
    }
  }), [hotManage, risingManage])

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

        <div className="toolbar-right">
          <Dropdown menu={manageMenu}>
            <Button
              type="link"
              icon={<SettingOutlined />}
              style={{ position: 'absolute', right: 0, top: 0 }}
            >关键词管理</Button>
          </Dropdown>
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
                    <span className='mark' onClick={() => onShow && onShow(item.content)}>
                      <PictureOutlined style={{ color: '#ccc' }} />
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
        title='热搜关键词'
        ref={hotManage}
        keywordIndex={KEYWORD_TYPE.HOTLIST}
        addAPI={api.addKeyword}
        delAPI={api.delKeyword}
      />

      <KeywordManage
        title='上升榜关键词'
        ref={risingManage}
        keywordIndex={KEYWORD_TYPE.RISING}
        addAPI={api.addKeyword}
        delAPI={api.delKeyword}
      />

      <Screenshot ref={_setScreenShow} />
    </div>
  )
}

export default inject('appStore')(observer(HotList))
