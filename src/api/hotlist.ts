import api from './api'

export default {
    getList: (start: number, end: number) => api.get('/hotlist', { params: { start, end } })
}
