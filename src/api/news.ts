import api from './api'

export default {
    getNews: (params: any) => api.get('/news', { params }),
    addTags: (content: string, dominate: string, light?: string) => api.post<number>('/news/tag', { content, color: { dominate, light } }),
    delTags: (id: number) => api.delete<boolean>('/news/tag', { params: { id } }),
    tagNews: (hash: string, tags: number[]) => api.put<{ success: boolean }>('/news/tag/attach', { hash, tags }),
    addKeyword: (content: string, type: number) => api.post<number>('/news/keyword', { content, type }),
    delKeyword: (id: number) => api.delete<boolean>('/news/keyword', { params: { id } }),
    addSearch: (word: string, url: string) => api.post<{ id: number }>('/news/search', { word, url }),
    editSearch: (id: number, word: string, url: string) => api.put<boolean>('/news/search', { id, word, url }),
    delSearch: (id: number) => api.delete<boolean>('/news/search', { params: { id } }),
    getBossNews: (start: string, end: string) => api.get('/news/boss', { params: { start, end } }),
}
