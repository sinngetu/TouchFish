import api from './api'

export default {
  getLoginLog: <T>(params: T) => api.get('/account/log/queryLoginLog', { params }),
  getOperationLog: <T>(params: T) => api.get(`/account/log/queryOperationLog`, { params }),
}
