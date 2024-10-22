import api from './api'

export default {
    getList: (start: string, end: string) => api.get('/hotlist', { params: { start, end } }),
    getWeiboList: () => api.get('/hotlist/weibo'),
    addKeyword: (content: string) => api.post<number>('/hotlist/keyword', { content }),
    delKeyword: (id: number) => api.delete<boolean>('/hotlist/keyword', { params: { id } })
}
