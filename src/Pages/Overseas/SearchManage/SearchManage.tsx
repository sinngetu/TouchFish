import React, { useState, forwardRef, useImperativeHandle, useMemo } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Form, Input, Modal, Popconfirm, Table, Tooltip } from 'antd'
import { LoadingOutlined, DeleteOutlined, EditOutlined, PlusOutlined, FontSizeOutlined, LinkOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

import type { Keyword } from '@/store'

import Store from './store'
import { Ref, Props, Field, EditCellProps } from './interface'

const { Item } = Form

const EditCell: React.FC<EditCellProps> = ({ edit, dataIndex, title, children, ...props }) => (
  <td {...props}>
    {edit ? (
      <Item
        name={dataIndex}
        style={{ margin: 0 }}
        rules={[{ required: true, message: '' }]}
      ><Input size="small" placeholder={title} /></Item>
    ) : children}
  </td>
)

const SearchManage = forwardRef<Ref, Props>((props, ref) => {
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [store] = useState(new Store(props.appStore!, addForm, editForm))
  const { show, dataSource, editId, hasEdit, showAdd, addLoading, editLoading, onShow, onCancel, onSearch, onShowAdd, onCancleAdd, onShowEdit, onCancelEdit, onAdd, onDel, onEdit, isEdit } = store

  const columns: ColumnsType<Keyword> = useMemo(() => [
    { dataIndex: 'word', title: '关键词', width: 130, editable: true },
    { dataIndex: 'extend', title: '搜索链接', ellipsis: true, editable: true },
    { dataIndex: 'operation', title: '操作', width: 70, render: (_: string, data: Keyword) => {
      const editLinkStyle = editLoading ? { cursor: 'pointer', color: '#91caff' } : undefined

      return isEdit(data) ? (
        <>
          <Tooltip key="save" title="保存">
            <a className="operation" onClick={() => onEdit(data)} style={editLinkStyle}>
              {editLoading ? <LoadingOutlined /> : <CheckOutlined />}
            </a>
          </Tooltip>

          <Tooltip key="calcle" title="取消" style={editLinkStyle}>
            <a className="operation" onClick={onCancelEdit}>
              <CloseOutlined />
            </a>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip key="edit" title="编辑">
            <a className={`operation ${hasEdit ? 'disabled' : ''}`} onClick={() => onShowEdit(data)}>
              <EditOutlined />
            </a>
          </Tooltip>
  
          <Popconfirm
            title="确认删除？"
            onConfirm={() => onDel(data)}
          >
            <Tooltip key="delete" title="删除">
              <a className={`operation ${hasEdit ? 'disabled' : ''}`}>
                <DeleteOutlined />
              </a>
            </Tooltip>
          </Popconfirm>
        </>
      )
    }}
  ].map(col => col.editable ? {
    ...col,
    onCell: (data: Keyword) => ({
      data,
      title: col.title,
      dataIndex: col.dataIndex,
      edit: isEdit(data),
    })
  } : col), [editId, editLoading, onShowEdit, onCancelEdit, onDel, onEdit])

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
          type="primary"
          icon={<PlusOutlined />}
          onClick={onShowAdd}
        >新增关键词</Button>

        <Input
          placeholder="关键词搜索"
          onChange={e => onSearch(e.target.value)}
          style={{ display: 'inline-block', flex: 1, marginLeft: 12 }}
        />
      </div>

      <Form
        form={addForm}
        name="add-form"
        layout="inline"
        initialValues={{ requiredMarkValue: false }}
        style={{
          height: showAdd ? 56 : 0,
          marginBottom: showAdd ? 12 : 0,
          padding: showAdd ? 12 : 0,
          overflow: 'hidden',
          background: '#eee',
          transition: 'all .3s'
        }}
      >
        <Item<Field> name="keyword" rules={[{ required: true, message: '' }]} style={{ width: 120 }}>
          <Input placeholder="关键词" prefix={<FontSizeOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} />
        </Item>

        <Item<Field> name="url" rules={[{ required: true, message: '' }]} style={{ flex: 1 }}>
          <Input placeholder="Google搜索链接" prefix={<LinkOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />} />
        </Item>

        <Item style={{ margin: 0 }}>
          <Button loading={addLoading} type="primary" onClick={onAdd}>确定</Button>
          <Button loading={addLoading} style={{ marginLeft: 8 }} onClick={onCancleAdd}>取消</Button>
        </Item>
      </Form>

      <Form form={editForm} component={false}>
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={dataSource}
          pagination={{ onChange: onCancelEdit }}
          components={{ body: { cell: EditCell } }}
        />
      </Form>
    </Modal>
  )
})

export default inject('appStore')(observer(SearchManage))
