import { makeAutoObservable } from 'mobx'

import MediaAPI from './api/media'
import PlatformAPI from './api/platform'

const api = {
    media: MediaAPI,
    platform: PlatformAPI,
}

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
    constructor() {
        makeAutoObservable(this)

        Promise.all([this.getMedia(), this.getPlatform()])
            .finally(() => this.ready = true)
    }

    ready: boolean = false
    media: Media = new Map()
    platform: Platform = new Map()

    getMedia = () => {
        if (this.media.size) return Promise.resolve(this.media)

        return api.media.getMedia()
            .then((data: RawMedium[]) => data.forEach(({ id, name, domain }) => this.media.set(id, { name, domain })))
            .then(() => this.media)
    }

    getPlatform = () => {
        if (this.platform.size) return Promise.resolve(this.platform)

        return api.platform.getPlatform()
            .then((data: RawPlatform[]) => data.forEach(({ id, name }) => this.platform.set(id, name)))
            .then(() => this.platform)
    }
}
