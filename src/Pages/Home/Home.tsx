import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Button, Table, Tooltip } from 'antd'
import { DownOutlined, LinkOutlined, ReloadOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'

import Store from './store'
import { New } from './interface'
import './index.less'

const columes: ColumnsType<New> = [
  { width: 145, key: 'medium', dataIndex: 'medium', title: '媒体' },
  { key: 'title', dataIndex: 'title', title: '标题' },
  { width: 160, key: 'time', dataIndex: 'time', title: '时间' },
  { width: 100, key: 'operation', title: '操作', fixed: 'right', render: (_, data) => (
    <>
      <Tooltip title="打开链接"><a href={data.link} target="_blank"><LinkOutlined /></a></Tooltip>
    </>
  ) },
]

const Home: React.FC = () => {
  const [store] = useState(new Store())

  useEffect(() => { store.getNews() }, [])

  return (
    <div className="warp">
      <div className="toolbar">
        <Button
          style={{ marginRight: 12 }}
          type="primary"
          loading={store.loading}
          onClick={store.onRefresh}
          icon={<ReloadOutlined />}
        >刷新</Button>

        已加载<span style={{ margin: '0 2px', color: '#1677ff' }}>{store.span}小时</span>数据
      </div>

      <Table
        id="news-table"
        rowKey="hash"
        loading={store.loading}
        dataSource={store.data}
        columns={columes}
        pagination={false}
        footer={() => (
          <div style={{ width: '100%', textAlign: 'center', cursor: store.loading ? 'not-allowed' : 'pointer' }} onClick={store.getNews}>
            <DownOutlined />
            &nbsp;更多&nbsp;
            已加载<span style={{ margin: '0 2px', color: '#1677ff' }}>{store.span}小时</span>数据
          </div>
        )}
      />
    </div>
  )
}

export default observer(Home)
