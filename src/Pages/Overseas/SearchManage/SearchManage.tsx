import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Input, Modal, Table, Tooltip } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

import type { Keyword } from '@/store'

import Store from './store'
import { Ref, Props } from './interface'

const columns: ColumnsType<Keyword> = [
  { dataIndex: 'word', title: '关键词' },
  { dataIndex: 'extend', title: '搜索链接' },
  { dataIndex: 'operation', title: '操作', render: () => (
    <>
      <Tooltip key="edit" title="编辑"><a className='operation'><EditOutlined /></a></Tooltip>
      <Tooltip key="delete" title="删除"><a className='operation'><DeleteOutlined /></a></Tooltip>
    </>
  ) }
]

const SearchManage = forwardRef<Ref, Props>((props, ref) => {
  const [store] = useState(new Store(props.appStore!))
  const { show, dataSource, onShow, onCancel, onSearch } = store

  useImperativeHandle(ref, () => ({ onShow }), [store])

  return (
    <Modal
      title="Google搜索管理"
      open={show}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      <div style={{ display: 'flex', marginBottom: 12 }}>
        <Button
          type='primary'
          icon={<PlusOutlined />}
        >新增关键词</Button>

        <Input
          placeholder='关键词搜索'
          onChange={e => onSearch(e.target.value)}
          style={{ display: 'inline-block', flex: 1, marginLeft: 12 }}
        />
      </div>

      <Table
        size='small'
        columns={columns}
        dataSource={dataSource}
      />
    </Modal>
  )
})

export default inject('appStore')(observer(SearchManage))
