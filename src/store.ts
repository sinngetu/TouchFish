import { makeAutoObservable } from 'mobx'

import api from './api/common'

interface RawMedium {
    id: number
    name: string
    domain: string
}

interface RawPlatform {
    id: number
    name: string
}

export type Media = Map<number, { name: string, domain: string }>
export type Platform = Map<number, string>

export default class AppStore {
    constructor() { makeAutoObservable(this) }

    ready: boolean = false
    media: Media = new Map()
    platform: Platform = new Map()

    onReady = () => this.ready = true
    getMedia = () => {
        if (this.media.size) return Promise.resolve(this.media)

        return api.getMedia()
            .then((data: RawMedium[]) => data.forEach(({ id, name, domain }) => this.media.set(id, { name, domain })))
            .then(() => this.media)
    }

    getPlatform = () => {
        if (this.platform.size) return Promise.resolve(this.platform)

        return api.getPlatform()
            .then((data: RawPlatform[]) => data.forEach(({ id, name }) => this.platform.set(id, name)))
            .then(() => this.platform)
    }
}
