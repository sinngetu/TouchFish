import { makeAutoObservable, runInAction } from 'mobx'
import { Fragment, createElement } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { message } from 'antd'
import { TimeRangePickerProps } from 'antd/es/time-picker'

import { News } from './interface'

import api from '@/api/news'
import { NEWS_STATUS, KEYWORD_TYPE } from '@/utils/constant'
import { copy } from '@/utils/function'
import AppStore, { Keyword, Media } from '@/store'

interface Params {
    title?: string
    tags?: number[]
    start: Dayjs
    end: Dayjs
    status: number
}

export default class OverseasStore {
    constructor(appStore: AppStore) {
        makeAutoObservable(this)

        appStore.getMedia().then(media => this.media = media)
        appStore.getKeyword().then(keyword => this.tags = keyword[KEYWORD_TYPE.OVERSEAS_TAG])
        appStore.getKeyword().then(keyword => this.highlight = (keyword[KEYWORD_TYPE.OVERSEAS] || []).map(({ word }) => word))
    }

    // private
    recent: number = 0
    params: Params = { start: dayjs(), end: dayjs(), status: NEWS_STATUS.OVERSEAS }
    highlight: string[] = []

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
        const el = document.getElementById(`a-${record.hash}`)?.parentElement?.parentElement?.firstElementChild?.nextElementSibling?.nextElementSibling?.querySelector('font.immersive-translate-target-inner') as HTMLFontElement

        if (el) info.splice(1, 0, el.innerText)

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
        api.tagNews(hash, tags).then(success => runInAction(() => {
            console.log(success)

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
                start,
                end,
                status: NEWS_STATUS.OVERSEAS
            }
        } else {
            this.params.start = this.params.start.subtract(30, "minute")
            this.params.end = this.params.end.subtract(30, "minute")
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

            this.notify(data)
            this.span = Number((((value ? end.valueOf() : this.recent) - start.valueOf()) / 3600000).toFixed(2))
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

    notify = async (data: News[]) => {
        const audio = document.getElementById('notify-audio') as HTMLAudioElement
        const notified = (sessionStorage.getItem('news-notified') || '').split(',').filter(h => !!h)
        const importantMedia = [1, 4, 21, 22, 23, 24, 25, 26, 27, 64]

        const important = data.filter(({ hash, title, medium }) => {
            if (!importantMedia.includes(medium)) return false
            if (notified.includes(hash)) return false
            if (!(this.highlight.reduce((result, keyword) => result || title.includes(keyword), false))) return false
            return true
        })

        if (!important.length || !Notification || Notification.permission !== 'granted') return

        for(let i = 0; i < important.length; i++) {
            const { title, hash } = important[i]
            if (i !== 0) await new Promise(r => setTimeout(r, 3000))

            audio.play()
            new Notification(title, { silent: true })
            notified.push(hash)
        }

        sessionStorage.setItem('news-notified', notified.join(','))
    }
}
