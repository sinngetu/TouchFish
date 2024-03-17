import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Provider, inject, observer } from 'mobx-react'
import { Button, DatePicker, Divider, Dropdown, Form, Input, MenuProps, Table, Tooltip } from 'antd'
import { CopyOutlined, DownOutlined, LinkOutlined, UndoOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'

import AppStore from '@/store'
import KeywordManage, { Ref as KeywordManageRef } from '@/common/KeywordManage'
import api from '@/api/news'

import Store from './store'
import { News } from './interface'

import './index.less'

const { Item } = Form
const { RangePicker } = DatePicker

interface Props { appStore: AppStore }

const Inland: React.FC<Props> = props => {
  const [store] = useState(new Store(props.appStore))
  const { media, data, loading, span, presets, formInit, hasCut, disabledDate, highlightKeyword, onCopy, onSearch } = store
  const keywordManage = useRef<KeywordManageRef>(null)
  const [form] = Form.useForm()

  const getMediumName = useCallback((id: number) => media.get(id)?.name, [media])

  const columes: ColumnsType<News> = useMemo(() => [
    { width: 150, key: 'medium', dataIndex: 'medium', title: '媒体', align: 'center', render: getMediumName },
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

  const rowClassName = useCallback((record: News, i: number) => {
    return hasCut(i) ? 'cut-line' : ''
  }, [hasCut])

  const manageMenu: MenuProps = useMemo(() => ({
    items: [
      { key: 'keyword', label: '关键词管理' },
    ],

    onClick: ({ key }) => {
      switch (key) {
        case 'keyword': return keywordManage.current?.onShow()
      }
    }
  }), [keywordManage])

  useEffect(() => { onSearch(formInit) }, [])

  return (
    <Provider InlandStore={store}>
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
              {span}&nbsp;小时
            </span>
            数据
            <Divider type="vertical" />
            共
            <span style={{ margin: '0 6px', color: '#1677ff' }}>
              {data.length}
            </span>
            条数据
          </span>

          <Dropdown menu={manageMenu}>
            <Button
              type="link"
              icon={<SettingOutlined />}
              style={{ position: 'absolute', right: 0, top: 0 }}
            >管理</Button>
          </Dropdown>
        </div>

        <Table
          id="news-table"
          rowKey="hash"
          loading={loading}
          dataSource={data}
          columns={columes}
          rowClassName={rowClassName}
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
              已加载<span style={{ margin: '0 2px', color: '#1677ff' }}>{span}小时</span>数据
            </div>
          )}
        />
      </div>

      <KeywordManage
        ref={keywordManage}
        keywordIndex={5}
        addAPI={api.addKeyword}
        delAPI={api.delKeyword}
      />
    </Provider>
  )
}

export default inject('appStore')(observer(Inland))
