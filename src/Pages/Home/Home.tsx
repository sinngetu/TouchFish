import React, { useEffect, useMemo, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Input, Table, Tooltip } from 'antd'
import { CalendarOutlined, CopyOutlined, DownOutlined, HistoryOutlined, LinkOutlined, ReloadOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'

import Store from './store'
import { New } from './interface'
import AppStore from '@/store'

import './index.less'

interface Props { appStore: AppStore }

const Home: React.FC<Props> = props => {
  const [store] = useState(new Store(props.appStore))
  const { media, highlight, data, keyword, loading, span, getNews, onCopy, onRefresh, onSearch, onGetMoreNews, onGetOneDayNews, onGetTodayNews } = store

  const columes: ColumnsType<New> = useMemo(() => [
    { width: 150, key: 'medium', dataIndex: 'medium', title: '媒体', render: id => media.get(id)?.name },
    { width: 105, key: 'keyword', dataIndex: 'keyword', title: '关键词' },
    { key: 'title', dataIndex: 'title', title: '标题', render: (data: string, _, i) => {
      let info: (string | JSX.Element)[] = [data]

      highlight.forEach(word => {
        info = info.map((data) => {
          if (typeof data !== 'string')
            return data

          const list: (string | JSX.Element)[] = []
          data.split(word).forEach((frag, i) => {
            (i !== 0) && list.push(<span key={i} className='keyword-highlight'>{word}</span>)
            list.push(frag)
          })

          return list
        }).flat()
      })

      return <>{info}</>
    } },
    { width: 160, key: 'date', dataIndex: 'date', title: '时间' },
    { width: 100, key: 'operation', title: '操作', fixed: 'right', render: (_, data) => (
      <>
        <Tooltip key="link" title="打开链接"><a href={data.link} target="_blank" className="operation"><LinkOutlined /></a></Tooltip>
        <Tooltip key="copy" title="复制标题链接"><a id={`a-${data.hash}`} onClick={() => onCopy(data)}><CopyOutlined /></a></Tooltip>
      </>
    ) },
  ], [media, highlight])

  const dataSource = useMemo(() => data.filter(({ title }) => title.includes(keyword)), [data, keyword])

  useEffect(() => { getNews() }, [])

  return (
    <div className="warp">
      <div className="toolbar">
        <Button
          type="primary"
          loading={loading}
          onClick={onRefresh}
          icon={<ReloadOutlined />}
        >刷新</Button>

        <Input
          allowClear
          onChange={onSearch}
          placeholder="标题检索--仅针对已加载数据"
          style={{ margin: '0 12px', width: 300 }}
        />

        <span style={{ lineHeight: 2.14 }}>已加载<span style={{ margin: '0 2px', color: '#1677ff' }}>{span}小时</span>数据</span>

        <Button
          loading={loading}
          onClick={onGetOneDayNews}
          icon={<HistoryOutlined />}
          style={{ margin: '0 12px' }}
        >最近24小时数据</Button>

        <Button
          loading={loading}
          onClick={onGetTodayNews}
          icon={<CalendarOutlined />}
          style={{ margin: '0 12px' }}
        >今日数据</Button>
      </div>

      <Table
        id="news-table"
        rowKey="hash"
        loading={loading}
        dataSource={dataSource}
        columns={columes}
        pagination={false}
        footer={() => (
          <div style={{ width: '100%', textAlign: 'center', cursor: loading ? 'not-allowed' : 'pointer' }} onClick={onGetMoreNews}>
            <DownOutlined />
            &nbsp;更多&nbsp;
            已加载<span style={{ margin: '0 2px', color: '#1677ff' }}>{span}小时</span>数据
          </div>
        )}
      />
    </div>
  )
}

export default inject('appStore')(observer(Home))
