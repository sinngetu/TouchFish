import React, { useState, forwardRef, useCallback, useImperativeHandle } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, ColorPicker, Divider, Input, Modal, Popconfirm, Switch } from 'antd'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'

import Store from './store'
import { Ref, Props } from './interface'

const TagManage = forwardRef<Ref, Props>((props, ref) => {
  const [store] = useState(new Store(props.overseasStore!))
  const { addLoading, checked, delID, dominateColor, lightColor, content, show, tags, onAdd, onDel, onShow, onCancel, onChangeColor, onChangeContent, onSetDelID, onSwitch, resetDelID } = store

  useImperativeHandle(ref, () => ({ onShow }), [store])

  return (
    <Modal
      title="关键词管理"
      open={show}
      footer={null}
      width={760}
      onCancel={onCancel}
    >
      <Input
        allowClear
        placeholder="标签名"
        onChange={e => onChangeContent(e.target.value)}
        style={{ marginRight: 12, width: 150 }}
      />

      <ColorPicker
        disabledAlpha
        onChange={onChangeColor}
        showText={useCallback(() => '选择颜色', [])}
        style={{ marginRight: 12, verticalAlign: 'bottom' }}
      />

      <Switch
        defaultChecked
        checkedChildren="浅"
        unCheckedChildren="深"
        onChange={onSwitch}
        style={{ marginRight: 12 }}
      />

      {content ? (
        <div style={{ display: 'inline-block', marginRight: 12 }}>
          <span>预览：</span>
          <span className="news-tags" style={{
            marginRight: 0,
            borderColor: dominateColor,
            background: checked ? lightColor : dominateColor,
            color: checked ? dominateColor : '#fff'
          }}>{content}</span>
        </div>
      ) : null}

      <Button
        type="primary"
        loading={addLoading}
        disabled={!content}
        icon={<PlusOutlined />}
        style={{ marginRight: 12 }}
        onClick={onAdd}
      >新增标签</Button>

      <Divider orientation="left">现有标签</Divider>

      {tags.map(({ id, content, color }) => (
        <Popconfirm
          key={id}
          title="确认删除关键词？"
          open={delID === id}
          onCancel={resetDelID}
          onConfirm={onDel(id)}
        >
          <span
            className="news-tags"
            style={{
              borderColor: color.dominate,
              background: color.light || color.dominate,
              color: color.light ? color.dominate : '#fff'
            }}
          >
            {content}
            <CloseOutlined
              style={{ cursor: 'pointer' }}
              onClick={() => onSetDelID(id)}
            />
          </span>
        </Popconfirm>
      ))}
    </Modal>
  )
})

export default inject('overseasStore')(observer(TagManage))
