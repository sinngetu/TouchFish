import api from './api'

export default {
    getList: (start: number, end: number) => api.get('/hotlist', { params: { start, end } }),
    getWeiboList: () => api.get('/hotlist/weibo'),
    addKeyword: (content: string) => api.post<{ id: number }>('/hotlist/keyword/add', { content }),
    delKeyword: (id: number) => api.delete<{ success: boolean }>('/hotlist/keyword/del', { params: { id } })
}
