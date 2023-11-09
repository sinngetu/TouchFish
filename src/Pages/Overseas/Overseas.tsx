import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Provider, inject, observer } from 'mobx-react'
import { Button, DatePicker, Divider, Dropdown, Form, Input, Popover, Table, Tag, Tooltip } from 'antd'
import { CopyOutlined, DownOutlined, LinkOutlined, LoadingOutlined, UndoOutlined, SearchOutlined, SettingOutlined, TagOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { MenuProps } from 'antd/es/menu'

import AppStore from '@/store'
import KeywordManage, { Ref as KeywordManageRef } from '@/common/KeywordManage'
import api from '@/api/news'

import Store from './store'
import { News } from './interface'
import TagManage, { Ref as TagManageRef } from './TagManage'
import TagItem from './TagItem'

import './index.less'

const { Item } = Form
const { RangePicker } = DatePicker

interface Props { appStore: AppStore }

const Overseas: React.FC<Props> = props => {
  const [store] = useState(new Store(props.appStore))
  const { media, data, loading, span, presets, formInit, hasCut, disabledDate, highlightKeyword, onCopy, onTagTheNews, onSearch } = store
  const tagManage = useRef<TagManageRef>(null)
  const keywordManage = useRef<KeywordManageRef>(null)
  const [form] = Form.useForm()

  const TagsContent = useCallback((record: News) => {
    return (
      <>
        <div style={{
          textAlign: 'center',
          marginBottom: store.tagLoading ? 6 : 0,
          color: '#1677ff',
          transition: 'all .3s',
          height: store.tagLoading ? 20 : 0,
          overflow: 'hidden'
        }}>
          <LoadingOutlined />
        </div>

        {store.tags.map(({ id, word, extend }) => {
          const color = JSON.parse(extend || '{}')
          const style = record.tags.includes(id) ? {
            borderColor: color.dominate,
            background: color.light || color.dominate,
            color: color.light ? color.dominate : '#fff'
          } : {
            borderColor: '#f0f0f0',
            background: '#f0f0f0',
            color: '#a9a9a9'
          }

          return (
            <span
              key={id}
              style={{ ...style, cursor: store.tagLoading ? 'not-allowed' : 'pointer'}}
              className="news-tags"
              onClick={() => onTagTheNews(record.hash, record.tags, id)}
            >{word}</span>
          )
        })}
      </>
    )
  }, [store.tags, store.tagLoading, onTagTheNews])

  const ShowTags = useCallback((active: number[]) => (
    <span style={{ position: 'absolute', left: 48, top: -2 }}>
      {active
        .map(t => store.tags.find(tag => tag.id === t))
        .filter(t => !!t)
        .map((tag, i) => {
          const { extend, id } = tag!
          const color = JSON.parse(extend || '{}')

          return (
            <span key={id} style={{
              display: 'inline-block',
              marginLeft: i === 0 ? 0 : 3,
              width: 8,
              height: 8,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: color.dominate,
              background: color.light || color.dominate,
            }} />
          )
        })
      }
    </span>
  ), [store.tags])

  const columes: ColumnsType<News> = useMemo(() => [
    { width: 150, key: 'medium', dataIndex: 'medium', title: '媒体', align: 'center', render: id => media.get(id)?.name },
    { width: 105, key: 'keyword', dataIndex: 'keyword', title: '搜索关键词' },
    { key: 'title', dataIndex: 'title', title: '标题', render: (text, data, i) => (
      <>
        <Popover trigger="click" content={TagsContent(data)}>
          <Tooltip title="新闻标签" placement="left">
            <Tag style={{ padding: '1px 5px 0', cursor: 'pointer' }}><TagOutlined /></Tag>
          </Tooltip>
        </Popover>
        {highlightKeyword(text)}
        {ShowTags(data.tags)}
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
    const m = record.medium
    let className = ''

    if (m === 1 || m === 64) className += 'wsj'
    if (m === 22 || m === 23) className += 'ft'
    if (m === 24) className += 'reuters'
    if (m === 26) className += 'bloomberg'
    if (hasCut(i)) className += ' cut-line'

    return className
  }, [hasCut])

  const manageMenu: MenuProps = useMemo(() => ({
    items: [
      { key: 'tag', label: '标签管理' },
      { key: 'keyword', label: '关键词管理' }
    ],

    onClick: ({ key }) => {
      switch (key) {
        case 'tag': return tagManage.current?.onShow()
        case 'keyword': return keywordManage.current?.onShow()
      }
    }
  }), [tagManage, keywordManage])

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

            <Item name="tags" valuePropName='value'>
              <TagItem tags={store.tags} />
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

        <TagManage ref={tagManage} />
        <KeywordManage
          ref={keywordManage}
          keywordIndex={2}
          addAPI={api.addKeyword}
          delAPI={api.delKeyword}
        />
      </div>
    </Provider>
  )
}

export default inject('appStore')(observer(Overseas))
