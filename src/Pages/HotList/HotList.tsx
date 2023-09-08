import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Timeline } from 'antd'

import Store from './store'
import AppStore from '@/store'

interface Props { appStore: AppStore }

const HotList: React.FC<Props> = props => {
  const [store] = useState(new Store(props.appStore))

  useEffect(() => { store.getList() }, [])

  return (
    <div className="warp">
      <Timeline
        mode="left"
        items={store.list}
        style={{
          position: 'relative',
          left: -440,
          top: 10
        }}
      />
    </div>
  )
}

export default inject('appStore')(observer(HotList))
