<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="details_form" enctype="multipart/form-data">
                <v-text-field
                  prepend-icon="person"
                  name="login"
                  label="Login"
                  type="text"
                  v-model="email"
                  :rules="[
                    v => !!v || 'Required.',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                  ]"

                ></v-text-field>
                <v-text-field
                  id="password"
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  type="password"
                  v-model="password"
                  :rules="[
                    v => !!v || 'Required.',
                  ]"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn  @click="formButtonClick" color="primary">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "login",

  data: function(){
    return {
      email: null,
      password: null,
    }
  },
  methods: {
    async formButtonClick() {


      //validate first
      if(!this.$refs.details_form.validate())
        return;

      this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password
      }).then(result => {
        this.$router.push('/admin/')
        console.log('login request',result);
      }).catch(error => {
        /*
        this.loading = false
        if (error.response && error.response.data) {
          this.alert = {type: 'error', message: error.response.data.message || error.reponse.status}
        }
         */
      })

      /*
      this.$auth.loginWith('customStrategy',{
        data: {
          username: this.email,
          password: this.password,
        }
      })
       */
    }

  }
}
</script>

<style scoped>

</style>
