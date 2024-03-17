import { makeAutoObservable, runInAction } from 'mobx'
import dayjs, { Dayjs } from 'dayjs'
import { Fragment, createElement } from 'react'
import { TimelineItemProps } from 'antd/es/timeline'

import api from '@/api/daddy'
import { DaddyInfo } from './interface'

type Items = TimelineItemProps[]

export default class DaddyStore {
    constructor() { makeAutoObservable(this) }

    // private
    highlight: string[] = ['马云', 'jack ma', 'Jack Ma']
    earliesy: Dayjs = dayjs()

    // public
    loading: boolean = false
    list: Items = []
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
                const content = this.highlightKeyword(item.content)

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

    highlightKeyword = (content: string) => {
        if (typeof content !== 'string') return content

        let info: (string | JSX.Element)[] = [content]

        this.highlight.forEach(word => {
            info = info.map((data) => {
            if (typeof data !== 'string')
                return data

            const list: (string | JSX.Element)[] = []
            data.split(word).forEach((frag, i) => {
                (i !== 0) && list.push(createElement('span', {
                    key: i,
                    className: 'keyword-highlight',
                    children: word
                }))
                list.push(frag)
            })

            return list
            }).flat()
        })

        return createElement(Fragment, { children: info })
    }
}
