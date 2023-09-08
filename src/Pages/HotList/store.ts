import { makeAutoObservable, runInAction } from 'mobx'
import dayjs, { Dayjs } from 'dayjs'
import { createElement, CSSProperties } from 'react'
import { Tag } from 'antd'
import { TimelineItemProps } from 'antd/es/timeline'

import { HotItem } from './interface'

import api from '@/api/hotlist'
import AppStore, { Platform } from '@/store'

type Items = TimelineItemProps[]

const colors: { [id: string]: CSSProperties  } = {
    '01': { color: '#ff1957', backgroundColor: '#1f0a1b', borderColor: '#1f0a1b' },
    '02': { color: '#22f3ed', backgroundColor: '#1f0a1b', borderColor: '#1f0a1b' },
    '08': { color: '#060101', backgroundColor: '#ffaa51', borderColor: '#d52c2b' },
    '09': { color: '#fff', backgroundColor: '#06f', borderColor: '#06f' },
    '10': { color: '#e10602', backgroundColor: '#fff', borderColor: '#2932e1' },
}

export default class HotListStore {
    constructor(appStore: AppStore) {
        makeAutoObservable(this)

        appStore.getPlatform().then(platform => this.platform = platform)
    }

    platform: Platform = new Map()
    loading: boolean = false
    list: Items = []
    earliesy: Dayjs = dayjs()
    span: number = 0

    getList = (minutes: number = 30) => {
        if (this.loading) return

        this.loading = true
        const end = this.earliesy.valueOf()
        this.earliesy = this.earliesy.subtract(minutes, "minute")
        const start = this.earliesy.valueOf()

        api.getList(start, end).then((data: HotItem[]) => runInAction(() => {
                const mark = new Set<string>()

                this.span += minutes / 60
                // this.data = [...this.data, ...data].filter(({ hash }) => {
                //     const discarded = mark.has(hash)

                //     mark.add(hash)
                //     return !discarded
                // })

                const cache = [] as { date: string, items: Items }[]
                data.forEach(item => {
                    const date = item.date.slice(5, -3)
                    const platform = item.date.slice(-2)

                    if (!cache.length || (cache[cache.length - 1].date !== date))
                        cache.push({ date, items: [] })

                    const cycle = cache[cache.length - 1].items

                    if (!cycle.length || ((cycle[cycle.length - 1].key as string)?.split('-')[0] !== platform))
                        cycle.push({ children: createElement(Tag, { style: { borderWidth: 2, ...colors[platform] }, children: this.platform.get(+platform) }), key: `${platform}-${date}` })

                    cycle.push({ children: item.content, key: `${platform}-${item.hash}` })
                })

                cache.forEach(({ date, items }) => items[0].label = date)

                this.list = cache.map(({ items }) => items).flat()
            })).finally(() => runInAction(() => this.loading = false))
    }
}
