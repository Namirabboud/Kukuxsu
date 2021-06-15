<template>

  <div class='main-container' :class="{'collapsed': is_collapsed}">
    <v-app>
      <v-main>
        <v-toolbar dense id="cms-main-toolbar">

          <v-toolbar-title>Kukuxsu</v-toolbar-title>

          <v-spacer></v-spacer>


          <v-menu
            offset-y
            transition="slide-y-transition"
            bottom
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>

              <v-list-item-group
                color="primary"
              >
                <v-list-item @click="logout">
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      logout
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>



        </v-toolbar>


        <SidebarMenu @toggle-collapse="onToggleCollapse" :menu="menu">

        </SidebarMenu>

        <div class="main-content">

          <v-container id="cms-main-container">
            <!--
            TODO: check the alert component i want to change it
            <alerts></alerts>
            -->
            <Nuxt />
          </v-container>

        </div>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { SidebarMenu } from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

export default {
  name: "dashboard",

  data: function () {
    return {
      is_collapsed: false,
    }
  },

  mounted() {
    this.$store.dispatch('cms/setTableMenuLinks'); //headers of the table
  },

  methods: {

    onToggleCollapse: function(collapsed)
    {
      this.is_collapsed=collapsed;
    },

    logout: function()
    {
      this.$store.dispatch('auth/logout').then(result => {
        this.$router.push('/login')
      });
    }
  },

  computed: {
    menu: {
      get(){
        return this.$store.state.cms.menu_links ? this.$store.state.cms.menu_links : []
      },
    },

  },

  components: {
    SidebarMenu,
  }
}
</script>

<style scoped>

</style>
