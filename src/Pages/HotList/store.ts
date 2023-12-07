import { makeAutoObservable, runInAction } from 'mobx'
import dayjs, { Dayjs } from 'dayjs'
import { createElement, CSSProperties, Fragment } from 'react'
import { Tag, Tooltip, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { TimelineItemProps } from 'antd/es/timeline'

import { HotItem } from './interface'
import { copy } from '@/utils/function'

import api from '@/api/hotlist'
import AppStore, { Platform } from '@/store'

type Items = TimelineItemProps[]

const colors: { [id: string]: CSSProperties  } = {
    '01': { color: '#ff1957', backgroundColor: '#1f0a1b', borderColor: '#1f0a1b' },
    '02': { color: '#22f3ed', backgroundColor: '#1f0a1b', borderColor: '#1f0a1b' },
    '08': { color: '#060101', backgroundColor: '#ffaa51', borderColor: '#d52c2b' },
    '09': { color: '#fff', backgroundColor: '#06f', borderColor: '#06f' },
    '10': { color: '#e10602', backgroundColor: '#fff', borderColor: '#2932e1' },
    '11': { color: '#f04142', backgroundColor: '#fff', borderColor: '#f04142' },
}

export default class HotListStore {
    constructor(appStore: AppStore) {
        makeAutoObservable(this)

        appStore.getPlatform().then(platform => this.platform = platform)
        appStore.getKeyword().then(keyword => this.highlight = (keyword[0] || []).map(({ word }) => word))
    }

    timer: number = NaN

    highlight: string[] = []
    platform: Platform = new Map()
    loading: boolean = false
    list: Items = []
    earliesy: Dayjs = dayjs()
    span: number = 0
    weiboList: HotItem[] = []
    marked: string[] = []

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

        api.getList(start, end).then((data: HotItem[]) => runInAction(() => {
            this.span += minutes / 60

            this.notify(data)

            const cache = [] as { date: string, items: Items }[]
            data.forEach(item => {
                const date = item.date.slice(5, -3)
                const platform = item.date.slice(-2)
                const content = this.highlightKeyword(item.content)

                if (!cache.length || (cache[cache.length - 1].date !== date))
                    cache.push({ date, items: [] })

                const cycle = cache[cache.length - 1].items

                if (!cycle.length || ((cycle[cycle.length - 1].key as string)?.split('-')[0] !== platform))
                    cycle.push({ children: createElement(Tag, { style: { borderWidth: 2, ...colors[platform] }, children: this.platform.get(+platform) }), key: `${platform}-${date}` })

                cycle.push({
                    color: 'gray',
                    key: `${platform}-${item.hash}`,
                    children: createElement('a', { children: content, href: item.link, target: '_blank', className: 'black' }),
                    label: item.link ? [
                        // createElement(Tooltip, { key: 'link', title: '打开链接' , children: createElement('a', { children: createElement(Tag, { children: createElement(LinkOutlined), style: { padding: '0 5px' } }), href: item.link, target: '_blank' }) }),
                        createElement(Tooltip, { key: 'copy', title: '复制链接' , children: createElement('a', { children: createElement(Tag, { children: createElement(CopyOutlined), style: { padding: '0 5px' } }), onClick: () => this.onCopy(item.link) }) }),
                    ] : undefined
                })
            })

            cache.forEach(({ date, items }) => items[0].label = date)

            this.list = [...this.list, ...(cache.map(({ items }) => items).flat())]
        })).finally(() => runInAction(() => this.loading = false))
    }

    getWeiboList = () => { api.getWeiboList().then((data: HotItem[]) => runInAction(() => { this.weiboList = data })) }

    onRefresh = () => {
        this.init()
        this.getList()
        this.getWeiboList()
    }

    onGetMoreNews = () => this.getList(30)

    onCopy = (url: string) => {
        if (copy(url)) message.success('复制成功~')
        else message.error('复制失败!')
    }

    onMark = (hash: string) => {
        const marked = [...this.marked]
        const i = marked.findIndex(h => h === hash)

        i === -1 ? marked.push(hash) : marked.splice(i, 1)

        this.marked = marked
        localStorage.setItem('weibo-mark', marked.join(','))
    }

    getListColor = (date: string) => {
        const delta = (dayjs().valueOf() - dayjs(date).valueOf()) / 60000

        if (delta < 5) return 'red'
        else if (delta < 15) return 'yellow'
        else if (delta < 6*60) return 'black'
        else return 'gray'
    }

    highlightKeyword = (content: string) => {
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

    notify = async (data: HotItem[]) => {
        const notified = (sessionStorage.getItem('notified') || '').split(',').filter(h => !!h)

        const important = data.filter(({ hash, content, platform }) => {
            if (platform !== 8 && platform !== 9) return false
            if (notified.includes(hash)) return false
            if (!(this.highlight.reduce((result, keyword) => result || content.includes(keyword), false))) return false
            return true
        })

        if (!important.length || !Notification || Notification.permission !== 'granted') return

        for(let i = 0; i < important.length; i++) {
            const { content, hash } = important[i]
            if (i !== 0) await new Promise(r => setTimeout(r, 3000))

            new Notification(content)
            notified.push(hash)
        }

        sessionStorage.setItem('notified', notified.join(','))
    }

    autoRefresh = () => {
        this.onRefresh()
        this.timer = setInterval(this.onRefresh, 60000) as any

        const saved = localStorage.getItem('weibo-mark')
        this.marked = saved ? saved.split(',') : []
    }

    onDestory = () => { clearInterval(this.timer) }
}
