import React, { useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import { observer } from 'mobx-react'
import { Modal, Transfer } from 'antd'

import Store from './store'
import { Ref, Props } from './interface'

const TabManage = forwardRef<Ref, Props>((props, ref) => {
  const [store] = useState(new Store(props))
  const { show, dataSource, targetKeys, onShow, onCancel, onOk, onChange } = store

  useImperativeHandle(ref, () => ({ onShow }), [store])

  return (
    <Modal
      title="标签栏管理"
      open={show}
      onOk={onOk}
      onCancel={onCancel}
      bodyStyle={{ display: 'flex', justifyContent: 'center' }}
    >
      <Transfer
        titles={['隐藏栏', '显示栏']}
        dataSource={dataSource}
        targetKeys={targetKeys}
        onChange={onChange}
        render={(item) => item.title}
      />
    </Modal>
  )
})

export default observer(TabManage)
