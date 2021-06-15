import cookie from 'cookie'


/*
this was make on refresh to each page from the server side
this to pass the token that was been set in the cookies to
the store auth token
 */


export const actions = {
  nuxtServerInit ({dispatch}, context) {
    return new Promise((resolve, reject) => {
      const cookies = cookie.parse(context.req.headers.cookie || '')
      if (cookies.hasOwnProperty('x-access-token')) {
        dispatch('auth/set_token',cookies['x-access-token'])
        resolve(true)
      } else {

        dispatch('auth/reset_token')
        resolve(false)
      }
    })
  }
}
