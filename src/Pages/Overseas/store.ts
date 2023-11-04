import { makeAutoObservable, runInAction } from 'mobx'
import dayjs, { Dayjs } from 'dayjs'
import { message } from 'antd'
import { TimeRangePickerProps } from 'antd/es/time-picker'

import { News } from './interface'

import api from '@/api/news'
import { copy } from '@/utils/function'
import AppStore, { Keyword, Media } from '@/store'

interface Params {
    title?: string
    tags?: number[]
    start: number
    end: number
}

export default class OverseasStore {
    constructor(appStore: AppStore) {
        makeAutoObservable(this)

        appStore.getMedia().then(media => this.media = media)
        appStore.getKeyword().then(keyword => this.tags = keyword[1])
    }

    // private
    recent: number = 0
    params: Params = { start: 0, end: 0 }

    // public
    data: News[] = []
    media: Media = new Map()
    span: number = 0
    tags: Keyword[] = []
    loading: boolean = false
    tagLoading: boolean = false
    presets: TimeRangePickerProps['presets'] = [
        { label: '今天', value: () => [dayjs().startOf('day'), dayjs().endOf('day')] },
        { label: '昨天', value: () => [dayjs().startOf('day').subtract(24, 'hour'), dayjs().endOf('day').subtract(24, 'hour')] },
        { label: '本周', value: () => [dayjs().startOf('week'), dayjs()] },
    ]

    formInit = { title: '', tags: [], time: [] }

    addTags = (tag: Keyword) => this.tags = [...this.tags, tag]
    delTags = (id: number) => {
        const i = this.tags.findIndex(tag => tag.id === id)

        if (i === -1) return

        const tags = [...this.tags]
        tags.splice(i, 1)
        this.tags = tags
    }

    onCopy = (record: News) => {
        const info = [record.title, record.link]
        const el = document.getElementById(`a-${record.hash}`)?.parentElement?.parentElement?.firstElementChild?.nextElementSibling?.nextElementSibling?.querySelector('font.immersive-translate-target-inner')

        if (el) info.splice(1, 0, el.innerHTML)

        const text = info.join('\n')

        if (copy(text)) message.success('复制成功~')
        else message.error('复制失败!')
    }

    onTagTheNews = (hash: string, active: number[], tag: number) => {
        if (this.tagLoading) return

        const allTags = this.tags.map(({ id }) => id)
        const tags = active.filter(id => allTags.includes(id)) // filter the deprecated tags
        const i = active.findIndex(id => id === tag)

        i === -1 ? tags.push(tag) : tags.splice(i, 1)
        tags.sort()

        this.tagLoading = true
        api.tagNews(hash, tags).then(({ success }) => runInAction(() => {
            if (!success) {
                message.error('新闻标记失败！请重试！')
                return
            }

            const data = [...this.data]
            const record = data.find(news => news.hash === hash)
            record!.tags = tags

            this.data = data
        })).finally(() => runInAction(() => this.tagLoading = false))
    }

    getParams = (value?: any) => {
        if (value) {
            const { title, tags, time } = value
            const [start, end] = (time && time.length && time[0] !== undefined) ? time : [
                dayjs().subtract(30, "minute").startOf('minute'),
                dayjs().startOf('minute')
            ]
    
            this.data = []
            this.recent = end.valueOf()
            this.params = {
                title: !!title ? title : undefined,
                tags: (tags && tags.length) ? tags : undefined,
                start: start.valueOf(),
                end: end.valueOf()
            }
        } else {
            this.params.start = this.params.start - 1800000
            this.params.end = this.params.end - 1800000
        }

        return this.params
    }

    onSearch = (value?: any) => {
        if (this.loading) return

        const params = this.getParams(value)
        const { start, end } = params

        this.loading = true
        api.getNews(params).then((data: News[]) => runInAction(() => {
            const mark = new Set<string>()

            this.span = Number((((value ? end : this.recent) - start) / 3600000).toFixed(2))
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
}
