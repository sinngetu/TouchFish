import { makeAutoObservable } from 'mobx'

import api from './api/common'

export type Media = Map<number, { name: string, domain: string }>
export type Platform = Map<number, string>
export type Keyword = { id: number, word: string }

export default class AppStore {
    constructor() { makeAutoObservable(this) }

    ready: boolean = false
    media: Media = new Map()
    platform: Platform = new Map()
    keyword: { [type: number]: Keyword[] } = {}

    _media: Promise<Media> | null = null
    _platform: Promise<Platform> | null = null
    _keyword: Promise<{ [type: number]: Keyword[] }> | null = null

    onReady = () => this.ready = true
    getMedia = () => {
        if (this.media.size) return Promise.resolve(this.media)
        if (this._media) return this._media

        this._media = api.getMedia()
            .then((data) => data.forEach(({ id, name, domain }) => this.media.set(id, { name, domain })))
            .then(() => this.media)

        return this._media
    }

    getPlatform = () => {
        if (this.platform.size) return Promise.resolve(this.platform)
        if (this._platform) return this._platform

        this._platform = api.getPlatform()
            .then((data) => data.forEach(({ id, name }) => this.platform.set(id, name)))
            .then(() => this.platform)

        return this._platform
    }

    getKeyword = () => {
        if (Object.keys(this.keyword).length) return Promise.resolve(this.keyword)
        if (this._keyword) return this._keyword

        this._keyword = api.getKeyword().then((data) => data.forEach(({ id, word, type }) => {
            if (!this.keyword[type])
                this.keyword[type] = []

            this.keyword[type].push({ id, word })
        })).then(() => this.keyword)

        return this._keyword
    }
}
