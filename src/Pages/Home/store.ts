import { ChangeEvent } from 'react'
import { makeAutoObservable, runInAction } from 'mobx'
import dayjs, { Dayjs } from 'dayjs'
import { message } from 'antd'

import { New } from './interface'

import api from '@/api/news'
import { debounce, copy } from '@/utils/function'
import AppStore, { Media } from '@/store'

export default class HomeStore {
    constructor(appStore: AppStore) {
        makeAutoObservable(this)

        appStore.getMedia().then(media => this.media = media)
        appStore.getKeyword().then(keyword => this.highlight = keyword[0] || [])
    }

    media: Media = new Map()
    data: New[] = []
    loading: boolean = false
    earliesy: Dayjs = dayjs()
    span: number = 0
    keyword: string = ''
    highlight: string[] = []
    displayKeyword: string = ''

    init = () => {
        this.data = []
        this.earliesy = dayjs()
        this.span = 0
    }

    getNews = (minutes: number = 30) => {
        if (this.loading) return

        this.loading = true
        const end = this.earliesy.valueOf()
        this.earliesy = this.earliesy.subtract(minutes, "minute")
        const start = this.earliesy.valueOf()

        api.getNews(start, end)
            .then((data: New[]) => runInAction(() => {
                const mark = new Set<string>()

                this.span += minutes / 60
                this.data = [...this.data, ...data].filter(({ hash }) => {
                    const discarded = mark.has(hash)

                    mark.add(hash)
                    return !discarded
                })
            })).finally(() => runInAction(() => this.loading = false))
    }

    onRefresh = () => {
        this.init()
        this.getNews()
    }

    onSearch = debounce((e: ChangeEvent) => this.keyword = (e.target as HTMLInputElement).value, 500)

    onGetMoreNews = () => this.getNews(30)
    onGetOneDayNews = () => {
        this.init()
        this.getNews(24 * 60)
    }

    onGetTodayNews = () => {
        const { hour, minute } = dayjs()

        this.init()
        this.getNews(24 * hour() + minute())
    }

    onCopy = (record: New) => {
        const info = [record.title, record.link]
        const el = document.getElementById(`a-${record.hash}`)?.parentElement?.parentElement?.firstElementChild?.nextElementSibling?.querySelector('font.immersive-translate-target-inner')

        if (el) info.splice(1, 0, el.innerHTML)

        const text = info.join('\n')

        if (copy(text)) message.success('复制成功~')
        else message.error('复制失败!')
    }
}
