import { makeAutoObservable } from 'mobx'

import api from './api/media'

interface RawMedium {
    id: number
    name: string
    domain: string
}

export type Media = Map<number, { name: string, domain: string }>

export default class AppStore {
    constructor() { makeAutoObservable(this) }

    media: Media = new Map()

    getMedia = () => {
        if (this.media.size) return Promise.resolve(this.media)

        return api.getMedia()
            .then((data: RawMedium[]) => data.forEach(({ id, name, domain }) => this.media.set(id, { name, domain })))
            .then(() => this.media)
    }
}
