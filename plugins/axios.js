import axios from "axios";

export default function ({ store,$axios, redirect }) {
  axios.interceptors.response.use(
    response => response,
    error => {
      const {
        status
      } = error.response || {}

      //console.log('token',context.auth.token)

      if(error.response.data.hasOwnProperty('error') && error.response.data.error.code === 111){
        //reset token and redirect to login

        store.dispatch('auth/reset_token')
        redirect('/login')
      }


      return Promise.reject(error)
    }
  )

}

