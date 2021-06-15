import axios from 'axios'


export default {
  auth: {
    me: () => axios.get('auth/me'),
    login: (data) => axios.post('/api/v1/admin/general', data),
    general:(data) => axios.post('/api/v1/admin/general', data),
  }
}
