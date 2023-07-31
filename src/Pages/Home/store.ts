import { makeAutoObservable, runInAction } from 'mobx'
import dayjs, { Dayjs } from 'dayjs'
import { New } from './interface'

import api from '@/api/news'

export default class HomeStore {
    constructor() { makeAutoObservable(this) }

    data: New[] = []
    loading: boolean = false
    earliesy: Dayjs = dayjs()
    span: number = 0

    getNews = () => {
        if (this.loading) return

        this.loading = true
        const end = this.earliesy.valueOf()
        this.earliesy = this.earliesy.subtract(30, "minute")
        const start = this.earliesy.valueOf()

        api.getNews(start, end)
            .then((data: New[]) => runInAction(() => { this.data = [...this.data, ...data]; this.span += 0.5 }))
            .finally(() => runInAction(() => this.loading = false))
    }

    onRefresh = () => {
        this.data = []
        this.earliesy = dayjs()
        this.span = 0
        this.getNews()
    }
}
