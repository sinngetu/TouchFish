import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { Modal, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import Store from './store'
import { Ref } from './interface'

const Screenshot = forwardRef<Ref, {}>((_, ref) => {
  const [store] = useState(new Store)
  const { show, loading, setCanvas, onShow, onCancel } = store
  const onGetCanvas = useCallback((canvas: HTMLCanvasElement | null) => (canvas !== null) && setCanvas(canvas!), [])

  useImperativeHandle(ref, () => ({ onShow }), [store])

  return (
    <Modal
      open={show}
      footer={null}
      width={800}
      onCancel={onCancel}
    >
      <Spin
        size='large'
        tip='Loading...'
        spinning={loading}
        indicator={<LoadingOutlined spin />}
        style={{ textAlign: 'center' }}
      >
        <canvas
          ref={onGetCanvas}
          width={750}
          height={1334}
        />
      </Spin>
    </Modal>
  )
})

export default observer(Screenshot)