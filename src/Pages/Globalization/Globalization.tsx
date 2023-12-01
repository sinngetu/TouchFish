import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Button, Divider, Input } from 'antd'
import { LikeOutlined } from '@ant-design/icons'

import Store from './store'

const { TextArea } = Input

const Globalization: React.FC = () => {
  const [store] = useState(new Store())
  const [value, setValue] = useState('')
  const { loading, data, list, onSubmit, getCount } = store

  return (
    <div className="warp">
      <TextArea
        placeholder="一行一个链接"
        style={{ marginBottom: 12 }}
        onChange={e => setValue(e.target.value)}
        rows={10}
      />

      <div style={{ textAlign: 'center' }}>
        <Button
          type="primary"
          loading={loading}
          style={{ width: 150 }}
          icon={<LikeOutlined />}
          onClick={() => onSubmit(value)}
        >提交生成</Button>
      </div>

      {list.length ? <Divider /> : null}

      {list.map(platform => (
        <div>
          <h4>■&nbsp;{platform}{platform === '未分类' ? null : `（共${data[platform].length}篇，其中${getCount(data[platform])}）`}</h4>
          {data[platform].map((v, i) => platform === '未分类'
            ? <div>{i + 1}{v.prefix}<a href={v.url}>{v.url}</a></div>
            : <div>{i + 1}{v.prefix}<a href={v.url}>{v.content}</a>（{v.username}{v.total === '0' ? '' : `，互动量：${v.total}`}）</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default observer(Globalization)
