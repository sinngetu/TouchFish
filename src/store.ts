import { makeAutoObservable } from 'mobx'

import api from './api/common'

export type Media = Map<number, { name: string, domain: string }>
export type Platform = Map<number, string>

export default class AppStore {
    constructor() { makeAutoObservable(this) }

    ready: boolean = false
    media: Media = new Map()
    platform: Platform = new Map()
    keyword: { [type: number]: string[] } = {}

    onReady = () => this.ready = true
    getMedia = () => this.media.size
        ? Promise.resolve(this.media)
        : api.getMedia()
            .then((data) => data.forEach(({ id, name, domain }) => this.media.set(id, { name, domain })))
            .then(() => this.media)

    getPlatform = () => this.platform.size
        ? Promise.resolve(this.platform)
        : api.getPlatform()
            .then((data) => data.forEach(({ id, name }) => this.platform.set(id, name)))
            .then(() => this.platform)

    getKeyword = () => Object.keys(this.keyword).length
        ? Promise.resolve(this.keyword)
        : api.getKeyword().then((data) => data.forEach(({ word, type }) => {
            if (!this.keyword[type])
                this.keyword[type] = []

            this.keyword[type].push(word)
        })).then(() => this.keyword)
}
