import { ChangeEvent } from 'react'
import { has, makeAutoObservable, runInAction } from 'mobx'
import dayjs, { Dayjs } from 'dayjs'
import { New } from './interface'

import api from '@/api/news'
import { debounce } from '@/utils/function'
import AppStore, { Media } from '@/store'

export default class HomeStore {
    constructor(appStore: AppStore) {
        makeAutoObservable(this)

        appStore.getMedia().then(media => this.media = media)
    }

    media: Media = new Map()
    data: New[] = []
    loading: boolean = false
    earliesy: Dayjs = dayjs()
    span: number = 0
    keyword: string = ''
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
}
