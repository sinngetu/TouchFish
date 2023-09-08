import api from './api'

export default {
    getMedia: () => api.get('/common/media'),
    getKeyword: () => api.get('/common/keyword'),
    getPlatform: () => api.get('/common/platform'),
}
