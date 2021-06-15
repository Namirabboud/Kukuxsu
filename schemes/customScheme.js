import { LocalScheme } from '~auth/runtime'
import {RequestHandler, Token} from "@nuxtjs/auth-next/dist/runtime.mjs";


const DEFAULTS = {
  name: "customScheme",
  endpoints: {
    login: {
      url: "/api/v1/admin/general",
      method: "post",
      propertyName: 'token',
      data: {
        method: 'login'
      },
    },
    logout: {
      url: "/api/auth/logout",
      method: "post"
    },
    user: {
      url: "/api/auth/user",
      method: "get"
    }
  },
  token: {
    property: "token",
    type: "Bearer",
    name: "Authorization",
    maxAge: 1800,
    global: true,
    required: true,
    prefix: "_token.",
    expirationPrefix: "_token_expiration."
  },
  user: {
    property: "user",
    autoFetch: true
  },
  clientId: false,
  grantType: false,
  scope: false
};

export default class CustomScheme extends LocalScheme {

  constructor($auth, options, ...defaults) {
    super($auth, options, ...defaults, DEFAULTS);
    this.token = new Token(this, this.$auth.$storage);
    this.requestHandler = new RequestHandler(this, this.$auth.ctx.$axios);
  }


  // Override `fetchUser` method of `local` scheme
  async fetchUser (endpoint) {

    // Token is required but not available
    if (!this.check().valid) {
      return
    }
    console.log('custom chi');


    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user and then set
    return this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    ).then((response) => {
      const user = getProp(response.data, this.options.user.property)

      // Transform the user object
      const customUser = {
        ...user,
        fullName: user.firstName + ' ' + user.lastName,
        roles: ['user']
      }

      // Set the custom user
      // The `customUser` object will be accessible through `this.$auth.user`
      // Like `this.$auth.user.fullName` or `this.$auth.user.roles`
      this.$auth.setUser(customUser)

      return response
    }).catch((error) => {
      this.$auth.callOnError(error, { method: 'fetchUser' })
    })
  }
}
