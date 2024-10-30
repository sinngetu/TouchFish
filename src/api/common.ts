import api from './api'

interface RawMedium {
    id: number
    name: string
    domain: string
    type: number
}

interface RawPlatform {
    id: number
    name: string
}

interface RawKeyword {
    id: number
    word: string
    type: number
    extend?: string
}

export interface Globalization {
    [platform: string]: {
        platform: string
        url: string
        content: string
        username: string
        total: string
        prefix: string
        like?: string
        fans?: string
    }[]
}

export default {
    getMedia: api.only<RawMedium[]>(() => api.get('/common/media')),
    getKeyword: api.only<RawKeyword[]>(() => api.get('/common/keyword')),
    getPlatform: api.only<RawPlatform[]>(() => api.get('/common/platform')),
}
