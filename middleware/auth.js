export default function ({context,store, redirect, route,rootGetters}) {

  const userIsLoggedIn = !!store.getters['auth/token']
  const urlRequiresAuth = /^\/admin(\/|$)/.test(route.fullPath)
  const urlRequiresNonAuth = /^\/login(\/|$)/.test(route.fullPath)
  if (!userIsLoggedIn && urlRequiresAuth) {
    return redirect('/login')
  }
  if (userIsLoggedIn && urlRequiresNonAuth) {

    return redirect('/admin')
  }
  return Promise.resolve()
}
