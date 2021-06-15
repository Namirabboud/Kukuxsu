<template>
    <div class="px-2">

        <div v-if="posts && headers">

            <div class="d-flex justify-space-between align-center">

                <h2 class="mb-0">{{model}}</h2>

                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    class="col-3"
                ></v-text-field>

            </div>


            <v-data-table
                v-model="selected"
                :headers="headers"
                :items="posts"
                :items-per-page="_item_per_page"
                :server-items-length="total_posts_length"
                :options.sync="options"
                :loading="loading"
                show-select
                class="elevation-1">


                <template v-slot:top >
                    <v-toolbar
                        flat
                    >
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    color="teal darken-1"
                                    dark
                                    small
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    With Selected
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item>
                                    <v-list-item-title class="pointer" @click="multipleDeleteAction">Delete</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>


                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>


                        <v-spacer></v-spacer>


                        <!--
                        ============================
                        FILTERS DIALOG
                        ============================
                        -->

                        <v-dialog v-if="filters && filters.length"
                                  v-model="filter_dialog"
                                  max-width="800px"
                        >
                            <v-card>


                                <v-card-title>
                                    <span class="headline">Filter</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-form
                                            ref="filter_form"
                                            lazy-validation
                                            enctype="multipart/form-data"
                                        >
                                            <v-row>
                                                <v-col v-for="(field, index) in filters" :key="field.id"
                                                       :class="field.class"
                                                       cols="12"
                                                >
                                                    <table-filter :_type="field.type"
                                                                  :_field_label="field.field_label"
                                                                  :_field_name="field.field_name"
                                                                  :_model_name="field.model_name"
                                                    ></table-filter>
                                                </v-col>

                                            </v-row>
                                        </v-form>

                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="closeFilter"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="saveFilter"
                                    >
                                        Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>

                        </v-dialog>


                        <!--
                        ============================
                        EXPORT DIALOG
                        ============================
                        -->

                        <v-dialog
                            v-model="exportDialog"
                            max-width="800px"
                        >
                            <v-card>


                                <v-card-title>
                                    <span class="headline">Choose Fields To Export </span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-form v-if="export_fields"
                                                ref="export_form"
                                                lazy-validation
                                                enctype="multipart/form-data"
                                        >
                                            <v-row>

                                                <v-col v-for="(field, index) in export_fields" :key="field.id"
                                                       class="col-md-3"
                                                       cols="12"
                                                >
                                                    <form-field :_field_type="'checkbox'"
                                                                :_field_label="field.field_label"
                                                                :_field_name="field.field_name"
                                                                :_default="'true'"
                                                                :_value="field.value"
                                                    ></form-field>
                                                </v-col>
                                            </v-row>
                                        </v-form>

                                        <v-skeleton-loader v-else
                                                           v-bind="attrs"
                                                           type="list-item-three-line, actions"
                                        ></v-skeleton-loader>

                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="closeExport"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="exportAction"
                                    >
                                        Export
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>


                        <!--
                        ============================
                        CREATE EDIT DIALOG
                        ============================
                        -->

                        <v-dialog
                            v-model="form_dialog"
                            max-width="800px"
                        >


                            <template v-slot:activator="{ on, attrs }">

                                <div v-if="!is_read_only">
                                    <v-btn
                                        color="primary"
                                        dark
                                        class="mr-2"
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="createFormClick"
                                    >
                                        <v-icon left>
                                            mdi-plus
                                        </v-icon>

                                        New Item
                                    </v-btn>
                                </div>

                                <div v-else>
                                </div>

                            </template>

                            <v-card>
                                <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-form v-if="form_fields"
                                                ref="form"
                                                lazy-validation
                                                enctype="multipart/form-data"
                                        >
                                            <v-row>

                                                <slot name="formFieldsDisplay"></slot>

                                            </v-row>
                                        </v-form>

                                        <v-skeleton-loader v-else
                                                           v-bind="attrs"
                                                           type="list-item-three-line, actions"
                                        ></v-skeleton-loader>

                                    </v-container>
                                </v-card-text>

                                <v-card-actions v-if="!is_read_only">
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="close"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="save"
                                    >
                                        Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <!--
                        ============================
                        DELETE DIALOG
                        ============================
                        -->

                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-menu
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
                                    <v-list-item v-if="filters && filters.length"
                                                 v-bind="attrs"
                                                 @click="filterDialogClick"
                                    >
                                        <v-list-item-icon>
                                            <v-icon>mdi-filter</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                Filter
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>



                                    <v-list-item
                                        v-bind="attrs"
                                        @click="dialogExportTrigger"
                                    >
                                        <v-list-item-icon>
                                            <v-icon>mdi-export</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                Export
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                </v-list-item-group>
                            </v-list>
                        </v-menu>
                    </v-toolbar>
                </template>


                <template v-for="(field, index) in custom_fields" v-slot:[`item.${field.name}`]="{item}">

                    <router-link :to="'/cms-table/'+field.link+'/'+item['foreign_'+field.name]">{{item[field.name]}}</router-link>

                </template>

                <template v-slot:item.actions="{ item }">
                    <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                    >
                        mdi-pencil
                    </v-icon>
                    <!--
                    <v-icon
                            small
                            @click="deleteItem(item)"
                    >
                        mdi-delete
                    </v-icon>
                    -->
                </template>

                <template v-slot:no-data>
                    <v-btn
                        color="primary"
                        @click="fetchData"
                    >
                        Reset
                    </v-btn>
                </template>

            </v-data-table>
        </div>


        <v-overlay :value="!(posts && headers)">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>

    </div>
</template>

<script>


export default {
    name: "TableTemplate",
    props: ['_page','_item_per_page'],
    data: function(){
        return {
            selected: [],
            options: {},
            attrs: null,
            filter_dialog: false,
            exportDialog: null,
            dialogDelete: false,
            editedIndex: -1,
            filter_fields: null,
            is_read_only: false,
            on:false,
            search: null,
            editedInstance: null,
            overlay: true,
        }
    },
    mounted() {


      //first we set the table model
      this.$store.dispatch('cms/setTablePage',this._page);

      //then we start fetching the data by model
      this.$store.dispatch('cms/setTableHeaders'); //headers of the table
      this.$store.dispatch('cms/setTablePosts'); //table data
      //this.$store.dispatch('cms/setTableFilters'); //custom filters for the table if any
      //this.$store.dispatch('cms/setTableExportFields'); //fields to be exported
      //this.$store.dispatch('cms/setTableCustomFields'); //custom fields for now are the href fields in the table where they take u to another table

    },
    methods: {

        fetchData()
        {
            //this.$store.commit('fetchData')
        },

        multipleDeleteAction: function()
        {
            if(this.selected.length){
                this.dialogDelete = true
            }
        },

        dialogExportTrigger(){
          this.exportDialog = true;
          this.$store.dispatch('cms/setTableExportFields'); //table data
        },

        save () {
            if(this.validateForm()){
                if (this.editedIndex > -1) {
                    this.updateRecord();
                } else {
                    //create record
                    this.createRecord();
                }
            }
        },

        clearFields()
        {
            this.form_fields = null;
        },


        validateForm()
        {
            return this.$refs.form.validate();
        },

        createFormClick()
        {
          this.editedIndex = -1;

          if(this.$refs.form)
              this.$refs.form.resetValidation()

          this.clearFields()
          this.$store.dispatch('cms/setTableForm',{});

        },

        editItem (item) {
          this.editedIndex = this.posts.indexOf(item)
          this.editedInstance = item

          this.clearFields()

          this.$store.dispatch('cms/setTableForm',{instance_id: this.editedInstance.id});
          this.$store.dispatch('cms/showFormDialog',true);
        },


        deleteItem (item) {
            this.editedIndex = this.posts.indexOf(item)
            this.dialogDelete = true
        },


        filterDialogClick(){
            this.filter_dialog = true;
        },

        close () {
          this.$store.dispatch('cms/showFormDialog',false);

          this.$nextTick(() => {
              this.editedIndex = -1
          })
        },

        closeFilter(){
            this.filter_dialog = false
        },


        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedIndex = -1
            })
        },


        closeExport(){
            this.exportDialog = false;
        },


        exportAction(){

          const myData = {};
          const formData =  new FormData(this.$refs.export_form.$el);

          for (var pair of formData.entries()) {
            myData[pair[0]] = pair[1];
          }

          this.$store.dispatch('cms/exportTable',myData).then(response => {

            console.log(response);
            const blob = new Blob(
              [response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
            const aEle = document.createElement('a');     // Create a label
            const href = window.URL.createObjectURL(blob);       // Create downloaded link
            aEle.href = href;
            aEle.download = this._page+'_'+this.currentDate()+'.xlsx';  // File name after download
            document.body.appendChild(aEle);
            aEle.click();     // Click to download
            document.body.removeChild(aEle); // Download complete remove element
            window.URL.revokeObjectURL(href) // Release blob object

          }).catch(err => {
            console.log(err);
          });
        },

        currentDate() {
            const current = new Date();
            const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
            return date;
        },


        deleteItemConfirm () {
            let ids = this.selected.map(a => a.id);

            axios.post("/admin/multiple-delete-records",{
                'model': this.model,
                'ids': ids,
            })
                .then(response => {

                    this.fetchData();
                    this.close()
                }).catch(err => {
                this.$bus.$emit('add_error_box',{text: err.response.data});
                this.close()
            });

            this.closeDelete()
            this.action = null
        },

        saveFilter(){
            const formData =  new FormData(this.$refs.filter_form.$el);
            var filters = {};
            //console.log(formData.entries());

            for(var pair of formData.entries()){
                filters[pair[0]] = pair[1];
            }

            this.filter_fields = filters;
            this.filter_dialog = false
        },


        createRecord()
        {

          const myData = {};
          const formData =  new FormData(this.$refs.form.$el);

          for (var pair of formData.entries()) {
            myData[pair[0]] = pair[1];
          }

          this.$store.dispatch('cms/createRecord', myData);
        },

        updateRecord()
        {

          const myData = {};
          const formData =  new FormData(this.$refs.form.$el);

          for (var pair of formData.entries()) {
            myData[pair[0]] = pair[1];
          }

          myData['instance_id'] = this.editedInstance.id

          this.$store.dispatch('cms/updateRecord', myData);

        },

    },

    created (){

        this.$bus.$on('tableTemplateCloseDialog', () => {
            this.close();
        });

        this.$bus.$on('tableTemplateGetFormFields', (param) => {
            //console.log('tableTemplateGetFormFields',param);
            this.form_fields = param.form_fields;
        });

        this.$bus.$on('tableTemplateRefreshData',(param) => {

            this.$store.commit('setTableModel',param.model);

            this.fetchHeaders();
            this.fetchFilters();
            this.fetchExportFields();
            this.fetchOptions();
            //this.fetchCustomFields();
        });

    },

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
        },
        //is_read_only ser only on edit
        /*
        is_read_only(){
            return this.is_read_only && this.editedIndex === -1
        },
        */

        params(nv) {
            return {
                ...this.options,
                query: this.search,
                filters: this.filter_fields,
                record_id: this.$route.params.recordId,
            };
        },


        total_posts_length: {
            get(){
                return this.$store.state.total_posts_length
            },
            set(newName){
                return newName
            },
        },

        loading: {
            get(){
                return this.$store.state.loading
            },
            set(newName){
                return newName
            },
        },

        model: {
            get(){
                return this.$store.state.model
            },
            set(newName){
                return newName
            },
        },

      form_dialog: {
        get(){
          return this.$store.state.cms.show_form_dialog
        },
        set(show){
          this.$store.dispatch('cms/showFormDialog', show);

          return show
        },
      },

      form_fields : {
        get(){
          return this.$store.state.cms.form_fields
        },
        set(newName){
          this.$store.dispatch('cms/clearTableForm');

          return newName
        },
      },

      headers: {
        get(){
          return this.$store.state.cms.headers
        },
      },

      posts: {
        get(){
          return this.$store.state.cms.posts
        },
      },

      filters: {
        get(){
          return this.$store.state.cms.filters
        },
      },

      export_fields: {
        get(){
          return this.$store.state.cms.export_fields
        }
      },

      custom_fields: {
        get(){
          return this.$store.state.cms.custom_fields
        }
      },
    },

    watch: {
      params: {
          handler (obj) {
            this.$store.dispatch('cms/setTableParams',obj);
            this.$store.dispatch('cms/setTablePosts'); //table data

            //this.fetchData()
            //this.$bus.$emit('fetchTableData', obj);
          },
          deep: true,
      },

      /*
      form_fields(val){
        console.log('form_fields',val);
      }
       */
    },

  components: {
  }
}
</script>

<style scoped>

</style>
