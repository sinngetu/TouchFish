import api from './api'

export default {
    getNews: (start: number, end: number) => api.get('/news', { params: { start, end } })
}
