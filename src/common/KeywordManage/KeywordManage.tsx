import React, { useState, forwardRef, useCallback, useImperativeHandle } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, Modal, Popconfirm, Tag } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

import Store from './store'
import { Ref, Props } from './interface'

const KeywordManage = forwardRef<Ref, Props>((props, ref) => {
  const [store] = useState(new Store(props.appStore!, props.keywordIndex, props.addAPI, props.delAPI))
  const { show, keywords, addLoading, filter, newKeyword, showAdd, onShow, onCancel, onAdd, onDel, onShowAdd, onChangeFilter, onChangeNewKeyword } = store
  const [delID, setDelID] = useState(-1)
  const onSetDelID = useCallback((id: number) => setDelID(id), [setDelID])
  const resetDelID = useCallback(() => setDelID(-1), [setDelID])

  useImperativeHandle(ref, () => ({ onShow }), [store])

  return (
    <Modal
      title={props.title || "关键词管理"}
      open={show}
      footer={null}
      onCancel={onCancel}
    >
      <Input
        allowClear
        placeholder="Search"
        onChange={onChangeFilter}
        style={{ marginBottom: 12 }}
      />

      {keywords.filter(({ word }) => word.includes(filter)).map(({ id, word }) => (
        <Popconfirm
          key={id}
          title="确认删除关键词？"
          open={delID === id}
          onCancel={resetDelID}
          onConfirm={onDel(id)}
        >
          <Tag
            closable
            onClose={e => { e.preventDefault(); onSetDelID(id) }}
            style={{ marginBottom: 8 }}
          >{word}</Tag>
        </Popconfirm>
      ))}

      <div>
        {showAdd ? (
          <Input
            type="text"
            size="small"
            style={{ width: 78 }}
            value={newKeyword}
            onChange={onChangeNewKeyword}
            onBlur={onAdd}
            onPressEnter={onAdd}
          />
        ) : (
          <Tag
            onClick={addLoading ? undefined : onShowAdd}
            style={{ cursor: addLoading ? 'not-allowed' : 'pointer', background: 'transparent', borderStyle: 'dashed' }}
          >
            {addLoading ? <LoadingOutlined /> : <PlusOutlined />} 新增关键词
          </Tag>
        )}
      </div>
    </Modal>
  )
})

export default inject('appStore')(observer(KeywordManage))
