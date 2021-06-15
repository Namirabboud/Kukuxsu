<template>
  <div class="px-2">

    <table-template
      :_page="page_slug"
      :_item_per_page="item_per_page"
    >


      <template v-slot:formFieldsDisplay>
        <v-col v-for="(field, index) in form_fields" :key="field.id"
               :class="field.class"
               cols="12"
        >
          <form-field :_field_type="field.field_type"
                      :_field_label="field.field_label"
                      :_field_name="field.field_name"
                      :_mandatory="field.mandatory"
                      :_options="field.options"
                      :_default="field.default"
                      :_model_name="field.model_name"
                      :_foreign_relation="field.foreign_relation"
                      :_value="field.value"
          ></form-field>
        </v-col>

      </template>
    </table-template>
  </div>
</template>

<script>

import tableTemplate  from '../../../templates/TableTemplate';

export default {
  name: "table_slug",

  layout: 'dashboard',

  data: function(){
    return {
      item_per_page: 5,
      page_slug: null,
    };
  },

  mounted() {
    this.$store.dispatch('cms/setTableType', null);
  },

  created (){

  },

  methods: {


  },
  watch: {
    '$route.params': {
      handler(obj) {
        this.page_slug = this.$route.params.slug;


        /*
        this.$bus.$emit('tableTemplateRefreshData',{
          'model': this.model,
        });
         */
      },
      immediate: true,
    },
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
    /*
    form_fields(val){
      console.log('form_fields',val)
    }
     */

  },
  computed: {
    form_fields: {
      get(){
        return this.$store.state.cms.form_fields
      },
      set(newName){
        return newName
      },
    }
  },

  components: {
    tableTemplate,
  }
}
</script>

<style scoped>

</style>
