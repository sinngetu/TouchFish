import { makeAutoObservable, runInAction } from 'mobx'
import { Fragment, createElement } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { message } from 'antd'
import { TimeRangePickerProps } from 'antd/es/time-picker'

import { News } from './interface'

import api from '@/api/news'
import { NEWS_STATUS, KEYWORD_TYPE } from '@/utils/constant'
import { copy } from '@/utils/function'
import AppStore, { Media } from '@/store'

interface Params {
    title?: string
    tags?: number[]
    start: Dayjs
    end: Dayjs
    status: number
}

export default class WandaStore {
    constructor(appStore: AppStore) {
        makeAutoObservable(this)

        appStore.getMedia().then(media => this.media = media)
        appStore.getKeyword().then(keyword => this.highlight = (keyword[KEYWORD_TYPE.WANDA] || []).map(({ word }) => word))
    }

    // private
    recent: number = 0
    params: Params = { start: dayjs(), end: dayjs(), status: NEWS_STATUS.WANDA }
    highlight: string[] = []

    // public
    data: News[] = []
    media: Media = new Map()
    span: number = 0
    loading: boolean = false
    presets: TimeRangePickerProps['presets'] = [
        { label: '今天', value: () => [dayjs().startOf('day'), dayjs().endOf('day')] },
        { label: '昨天', value: () => [dayjs().startOf('day').subtract(24, 'hour'), dayjs().endOf('day').subtract(24, 'hour')] },
        { label: '本周', value: () => [dayjs().startOf('week'), dayjs()] },
    ]

    formInit = { title: '', tags: [], time: [] }

    onCopy = (record: News) => {
        const info = [record.title, record.link]
        const el = document.getElementById(`a-${record.hash}`)?.parentElement?.parentElement?.firstElementChild?.nextElementSibling?.nextElementSibling?.querySelector('font.immersive-translate-target-inner')

        if (el) info.splice(1, 0, el.innerHTML)

        const text = info.join('\n')

        if (copy(text)) message.success('复制成功~')
        else message.error('复制失败!')
    }

    getParams = (value?: any) => {
        if (value) {
            const { title, tags, time } = value
            const [start, end] = (time && time.length && time[0] !== undefined) ? time : [
                dayjs().startOf('day'),
                dayjs().startOf('minute')
            ]

            this.data = []
            this.recent = end.valueOf()
            this.params = {
                title: !!title ? title : undefined,
                tags: (tags && tags.length) ? tags : undefined,
                start,
                end,
                status: NEWS_STATUS.WANDA
            }
        } else {
            this.params.start = this.params.start.subtract(1, "day")
            this.params.end = this.params.end.subtract(1, "day")
        }

        return this.params
    }

    onSearch = (value?: any) => {
        if (this.loading) return

        const params = this.getParams(value)
        const { start, end } = params
        const _params = {
            ...params,
            start: start.format(),
            end: end.format()
        }

        this.loading = true
        api.getNews(_params).then((data: News[]) => runInAction(() => {
            const mark = new Set<string>()

            console.log(start.valueOf() / 1000, dayjs().startOf('day').valueOf() / 1000)
            this.span = start.valueOf() < dayjs().startOf('day').valueOf()
                ? Number((((value ? end.valueOf() : this.recent) - start.valueOf()) / 3600000).toFixed(2))
                : 0

            this.data = [...this.data, ...data].filter(({ hash }) => {
                const discarded = mark.has(hash)

                mark.add(hash)
                return !discarded
            })
        })).finally(() => runInAction(() => this.loading = false))
    }

    disabledDate = (current: Dayjs) => current && current > dayjs().endOf('day')

    hasCut = (i: number) => {
        const record = this.data[i]
        const next = this.data[i + 1]

        if (!next) return true
        return next.date.slice(0, -4) !== record.date.slice(0, -4)
    }

    highlightKeyword = (content: string) => {
        if (typeof content !== 'string') return content

        let info: (string | JSX.Element)[] = [content.toLowerCase()]

        this.highlight.forEach(word => {
            info = info.map((data) => {
            if (typeof data !== 'string')
                return data

            const list: (string | JSX.Element)[] = []
            data.split(word.toLowerCase()).forEach((frag, i) => {
                (i !== 0) && list.push(createElement('span', {
                    key: i,
                    className: 'keyword-highlight',
                    children: word
                }))
                list.push(frag)
            })

            return list
            }).flat().filter(el => Boolean(el))
        })

        return createElement(Fragment, { children: info })
    }
}
