import { useCallback, useMemo } from 'react'
import { Button, Popover } from 'antd'
import { TagOutlined } from '@ant-design/icons'

import { Keyword } from '@/store'

interface Props {
  tags: Keyword[]
  value?: number[]
  onChange?: (value: number[]) => void
}

const TagItem: React.FC<Props> = (props) => {
  const tags = useMemo(() => props.tags.map(item => {
    const { id, word: content, extend } = item
    const color = JSON.parse(extend || '{}')

    return { id, content, color }
  }), [props.tags])

  const onChange = useCallback((id: number) => () => {
    const newValue = [...(props.value || [])]
    const idx = newValue.findIndex(val => val === id)

    idx === -1 ? newValue.push(id) : newValue.splice(idx, 1)

    props.onChange?.(newValue)
  }, [props.value])

  const TagsContent = useMemo(() => (
    <>
      {tags.map(({ id, content, color }) => {
        const style = (props.value || []).includes(id) ? {
          borderColor: color.dominate,
          background: color.light || color.dominate,
          color: color.light ? color.dominate : '#fff',
          cursor: 'pointer'
        } : {
          borderColor: '#f0f0f0',
          background: '#f0f0f0',
          color: '#a9a9a9',
          cursor: 'pointer'
        }

        return (
          <span
            key={id}
            style={style}
            className="news-tags"
            onClick={onChange(id)}
          >{content}</span>
        )
      })}
    </>
  ), [tags, props.value])

  return (
    <Popover
      trigger="click"
      placement="bottom"
      content={TagsContent}
    >
      <Button icon={<TagOutlined />}>
        标签检索
      </Button>
    </Popover>
  )
}

export default TagItem