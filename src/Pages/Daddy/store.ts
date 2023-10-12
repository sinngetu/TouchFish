import { makeAutoObservable, runInAction } from 'mobx'
import dayjs, { Dayjs } from 'dayjs'
import { createElement } from 'react'
import { Tag } from 'antd'
import { TimelineItemProps } from 'antd/es/timeline'

import api from '@/api/daddy'
import { DaddyInfo } from './interface'

type Items = TimelineItemProps[]

export default class DaddyStore {
    constructor() { makeAutoObservable(this) }

    loading: boolean = false
    list: Items = []
    earliesy: Dayjs = dayjs()
    span: number = 0

    init = () => {
        this.list = []
        this.earliesy = dayjs()
        this.span = 0
    }

    getList = (minutes: number = 30) => {
        if (this.loading) return

        this.loading = true
        const end = this.earliesy.valueOf()
        this.earliesy = this.earliesy.subtract(minutes, "minute")
        const start = this.earliesy.valueOf()

        api.getList(start, end).then((data: DaddyInfo[]) => runInAction(() => {
            this.span += minutes / 60

            const cache = [] as { date: string, items: Items }[]
            data.forEach(item => {
                const date = item.date.slice(5, -3)
                const content = item.content

                if (!cache.length || (cache[cache.length - 1].date !== date))
                    cache.push({ date, items: [] })

                const cycle = cache[cache.length - 1].items

                cycle.push({
                    key: item.hash,
                    children: createElement('a', { children: content, href: item.link, target: '_blank', className: 'black' }),
                })
            })

            cache.forEach(({ date, items }) => items[0].label = createElement('span', { children: date, className: 'daddy-info-time' }))

            this.list = [...this.list, ...(cache.map(({ items }) => items).flat())]
        })).finally(() => runInAction(() => this.loading = false))
    }

    onRefresh = () => {
        this.init()
        this.getList()
    }

    onGetMoreNews = () => this.getList(30)

    // onCopy = (url: string) => {
    //     if (copy(url)) message.success('复制成功~')
    //     else message.error('复制失败!')
    // }
}
