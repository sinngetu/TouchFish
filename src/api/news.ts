import api from './api'

export default {
    getNews: (params: any) => api.get('/news', { params }),
    addTags: (content: string, dominate: string, light?: string) => api.post<{ id: number }>('/news/tag/add', { content, color: { dominate, light } }),
    delTags: (id: number) => api.post<{ success: boolean }>('/news/tag/del', { id }),
    tagNews: (hash: string, tags: number[]) => api.post<{ success: boolean }>('/news/tag', { hash, tags }),
    addKeyword: (content: string) => api.post<{ id: number }>('/news/keyword/add', { content }),
    delKeyword: (id: number) => api.post<{ success: boolean }>('/news/keyword/del', { id })
}
