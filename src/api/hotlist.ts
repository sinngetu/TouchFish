import api from './api'

export default {
    getList: (start: number, end: number) => api.get('/hotlist', { params: { start, end } }),
    addKeyword: (content: string) => api.post<{ id: number }>('/hotlist/keyword/add', { content }),
    delKeyword: (id: number) => api.post<{ success: boolean }>('/hotlist/keyword/del', { id })
}
