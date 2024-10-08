import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Provider, inject, observer } from 'mobx-react'
import { Button, DatePicker, Divider, Form, Input, Table, Tooltip } from 'antd'
import { CopyOutlined, DownOutlined, LinkOutlined, UndoOutlined, SearchOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'

import AppStore from '@/store'

import Store from './store'
import { News } from './interface'

import './index.less'

const { Item } = Form
const { RangePicker } = DatePicker

interface Props { appStore: AppStore }

const Overseas: React.FC<Props> = props => {
  const [store] = useState(new Store(props.appStore))
  const { media, data, loading, span, presets, formInit, hasCut, disabledDate, highlightKeyword, onCopy, onSearch } = store
  const [form] = Form.useForm()

  const getMediumName = useCallback((id: number) => {
    switch (id) {
      case 99999: return '推特'
      case 99998: return '中国足协'
      default: return media.get(id)?.name
    }
  }, [media])

  const columes: ColumnsType<News> = useMemo(() => [
    { width: 150, key: 'medium', dataIndex: 'medium', title: '媒体', align: 'center', render: getMediumName },
    { width: 105, key: 'keyword', dataIndex: 'keyword', title: '搜索关键词' },
    { key: 'title', dataIndex: 'title', title: '标题', render: (text, data, i) => (
      <>
        {highlightKeyword(text)}
        {hasCut(i) ? <span className="time-tag">{data.date.slice(11, 16)}</span> : undefined}
      </>
    ) },
    { width: 160, key: 'date', dataIndex: 'date', title: '时间' },
    { width: 100, key: 'operation', title: '操作', fixed: 'right', render: (_, data, i) => (
      <>
        <Tooltip key="link" title="打开链接"><a href={data.link} target="_blank" className="operation"><LinkOutlined /></a></Tooltip>
        <Tooltip key="copy" title="复制标题链接"><a id={`a-${data.hash}`} onClick={() => onCopy(data)}><CopyOutlined /></a></Tooltip>
      </>
    ) }
  ], [media])

  useEffect(() => { onSearch(formInit) }, [])

  return (
    <Provider overseasStore={store}>
      <div className="warp">
        <div className="toolbar">
          <Form
            form={form}
            name="news-filter"
            layout="inline"
          >
            <Item name="title">
              <Input
                allowClear
                placeholder="标题检索"
                style={{ width: 200 }}
              />
            </Item>

            <Item name="time">
              <RangePicker
                presets={presets}
                style={{ width: 300 }}
                format="YYYY-MM-DD HH:mm"
                disabledDate={disabledDate}
                showTime={{ format: 'HH:mm' }}
                placeholder={['开始时间', '结束时间']}
              />
            </Item>

            <Button
              style={{ marginRight: 12 }}
              icon={<UndoOutlined />}
              onClick={() => {form.setFieldsValue(formInit)}}
            >重置</Button>

            <Button
              type="primary"
              loading={loading}
              icon={<SearchOutlined />}
              onClick={() => onSearch(form.getFieldsValue())}
            >查询</Button>
          </Form>

          <Divider />

          <span style={{ lineHeight: 2.14 }}>
            已加载
            <span style={{ margin: '0 6px', color: '#1677ff' }}>
              {span === 0 ? '当天所有' : `${span} 小时`}
            </span>
            数据
            <Divider type="vertical" />
            共
            <span style={{ margin: '0 6px', color: '#1677ff' }}>
              {data.length}
            </span>
            条数据
          </span>
        </div>

        <Table
          id="news-table"
          rowKey="hash"
          loading={loading}
          dataSource={data}
          columns={columes}
          pagination={false}
          footer={() => (
            <div
              onClick={e => onSearch()}
              style={{
                width: '100%',
                textAlign: 'center',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <DownOutlined />
              &nbsp;更多&nbsp;
              已加载<span style={{ margin: '0 2px', color: '#1677ff' }}>{span === 0 ? '当天所有' : `${span}小时`}</span>数据
            </div>
          )}
        />
      </div>
    </Provider>
  )
}

export default inject('appStore')(observer(Overseas))
