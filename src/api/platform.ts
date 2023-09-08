import api from './api'

export default {
    getPlatform: () => api.get('/platform')
}
