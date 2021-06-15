import api from '~/api'
import cookies from 'js-cookie'

export const state = () => ({
  user: null,
  token: null,
})

export const mutations = {
  set_user (store, data) {
    store.user = data
  },
  reset_user (store) {
    store.user = null
  },
  set_token(store,data){
    store.token = data
    cookies.set('x-access-token', data, {expires: 7})
  },
  reset_token(store){

    console.log('reset token')
    store.token = null
    cookies.remove('x-access-token')
  }
}

export const actions = {
  fetch ({commit,state}) {
    return api.auth.general({
      method: 'fetch-user',
      token: state.token,
    })

  },

  login ({commit}, data) {
    return api.auth.login({
      method: 'login',
      email: data.email,
      password: data.password,
    })
    .then(response => {
      commit('set_token',response.data.token)
      return response
    })
  },

  reset_token({commit}){
    console.log('reset token')
    commit('reset_token')
    return Promise.resolve()
  },

  set_token({commit}, data){
    commit('set_token', data)
  },

  reset ({commit}) {
    commit('reset_user')
    commit('reset_token')
    return Promise.resolve()
  },

  logout({commit,state}){
    return api.auth.general({
      method: 'logout',
      token: state.token,
    })
    .then(response => {
      commit('reset_token')

      return response
    })
  }
}

export const getters = {
  token: state => state.token ? state.token : cookies.get('x-access-token')
}
