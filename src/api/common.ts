import api from './api'

interface RawMedium {
    id: number
    name: string
    domain: string
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
    }[]
}

export default {
    getMedia: () => api.get<RawMedium[]>('/common/media'),
    getKeyword: () => api.get<RawKeyword[]>('/common/keyword'),
    getPlatform: () => api.get<RawPlatform[]>('/common/platform'),
    getGlobalization: (urls: string[]) => api.post<Globalization>('/common/globalization', { urls })
}
