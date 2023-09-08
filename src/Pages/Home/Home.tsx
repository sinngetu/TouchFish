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

  const columes: ColumnsType<New> = useMemo(() => [
    { width: 145, key: 'medium', dataIndex: 'medium', title: '媒体', render: id => store.media.get(id)?.name },
    { key: 'title', dataIndex: 'title', title: '标题' },
    { width: 160, key: 'date', dataIndex: 'date', title: '时间' },
    { width: 100, key: 'operation', title: '操作', fixed: 'right', render: (_, data) => (
      <>
        <Tooltip title="打开链接"><a href={data.link} target="_blank" className="operation"><LinkOutlined /></a></Tooltip>
        <Tooltip title="复制标题链接"><a id={`a-${data.hash}`} onClick={() => store.onCopy(data)}><CopyOutlined /></a></Tooltip>
      </>
    ) },
  ], [store.media])

  const dataSource = useMemo(() => store.data.filter(({ title }) => title.includes(store.keyword)), [store.data, store.keyword])

  useEffect(() => { store.getNews() }, [])

  return (
    <div className="warp">
      <div className="toolbar">
        <Button
          type="primary"
          loading={store.loading}
          onClick={store.onRefresh}
          icon={<ReloadOutlined />}
        >刷新</Button>

        <Input
          allowClear
          onChange={store.onSearch}
          placeholder="标题检索--仅针对已加载数据"
          style={{ margin: '0 12px', width: 300 }}
        />

        <span style={{ lineHeight: 2.14 }}>已加载<span style={{ margin: '0 2px', color: '#1677ff' }}>{store.span}小时</span>数据</span>

        <Button
          loading={store.loading}
          onClick={store.onGetOneDayNews}
          icon={<HistoryOutlined />}
          style={{ margin: '0 12px' }}
        >最近24小时数据</Button>

        <Button
          loading={store.loading}
          onClick={store.onGetTodayNews}
          icon={<CalendarOutlined />}
          style={{ margin: '0 12px' }}
        >今日数据</Button>
      </div>

      <Table
        id="news-table"
        rowKey="hash"
        loading={store.loading}
        dataSource={dataSource}
        columns={columes}
        pagination={false}
        footer={() => (
          <div style={{ width: '100%', textAlign: 'center', cursor: store.loading ? 'not-allowed' : 'pointer' }} onClick={store.onGetMoreNews}>
            <DownOutlined />
            &nbsp;更多&nbsp;
            已加载<span style={{ margin: '0 2px', color: '#1677ff' }}>{store.span}小时</span>数据
          </div>
        )}
      />
    </div>
  )
}

export default inject('appStore')(observer(Home))
