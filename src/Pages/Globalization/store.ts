import { makeAutoObservable, runInAction } from 'mobx'

import api, { Globalization } from '@/api/common'

export default class GlobalizationStore {
    constructor() { makeAutoObservable(this) }

    loading: boolean = false
    data: Globalization = {}
    list: string[] = []

    onSubmit = (raw: string) => {
        const urls = raw.split('\n')

        this.loading = true
        api.getGlobalization(urls).then(data => runInAction(() => {
            const bias = '未分类'
            const platform = Object.keys(data)
                .filter(key => key !== bias)
                .sort((a, b) => data[b].length - data[a].length)

            if (data[bias] && data[bias].length)
                platform.push(bias)

            this.data = data
            this.list = platform
        })).finally(() => runInAction(() => this.loading = false))
    }

    getCount = (data: { prefix: string }[]) => {
        const mark = {} as {[sign: string]: number}

        data.forEach(item => {
            const sign = item.prefix
            if (!mark[sign]) mark[sign] = 0
            mark[sign]++
        })

        return Object.keys(mark).map(sign => `${sign.slice(3, -1)}${mark[sign]}篇`).join('，')
    }
}