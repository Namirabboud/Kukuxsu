<template>
    <div>

        <h4 v-if="_field_type == 'label'" class="text-decoration-underline">
            {{_field_label}}
        </h4>


        <v-text-field v-if="_field_type == 'small_text'"
                      :label="_field_label" :name="_field_name" :rules="rules" v-model="field"
        ></v-text-field>


        <v-text-field v-if="_field_type == 'number'"
                      :label="_field_label" :name="_field_name"
                      :rules="rules" v-model="field" type="number"
        ></v-text-field>


        <v-text-field v-if="_field_type == 'email'"
                      :label="_field_label"
                      :rules="rules"
                      :name="_field_name"
                      v-model="field"

        ></v-text-field>




        <div v-if="_field_type == 'date-picker'"
             :label="_field_label"
        >
            <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
            >

                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                            v-model="field"
                            :name="_field_name"
                            :label="_field_label"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="rules"
                    ></v-text-field>
                </template>

                <v-date-picker
                        v-model="field"
                        @input="menu = false"
                ></v-date-picker>

            </v-menu>
        </div>


        <div v-if="_field_type == 'date-time-picker'">
          <v-datetime-picker
            :label="_field_label"
            v-model="field"
            :name="_field_name"
            @input="onDateTimeUpdate()"
            dateFormat="yyyy-MM-dd"
            timeFormat="HH:mm:ss"
          >
            <template slot="dateIcon">
              <i class="mdi mdi-calendar" style="font-size:30px"></i>
            </template>
            <template slot="timeIcon">
              <i class="mdi mdi-clock" style="font-size:30px"></i>
            </template>


          </v-datetime-picker>

          <input type="hidden" :name="_field_name" v-model="dateTimeModel">

        </div>


        <v-text-field v-if="_field_type == 'password'"
                      v-model="field"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="rules"
                      :type="show ? 'text' : 'password'"
                      :name="_field_name"
                      :label="_field_label"
                      hint="At least 8 characters"
                      counter
                      @click:append="show = !show"
        ></v-text-field>


        <v-select v-if="_field_type == 'select-box'"
                  item-text="key"
                  item-value="value"
                  :items="_options"
                  :name="_field_name"
                  :label="_field_label"
                  v-model="field"
                  clearable
        ></v-select>

        <v-select v-if="_field_type == 'multiple-select-box'"
                  item-text="key"
                  item-value="value"
                  :items="_options"
                  :name="_field_name"
                  :label="_field_label"
                  v-model="field"
                  clearable
                  multiple
        ></v-select>


        <image-gallery v-if="_field_type == 'image'"
                       :_default="_default"
                       :_model_name="_model_name"
                       :_field_type="_field_type"
                       :_field_name="_field_name"
                       :_field_label="_field_label"
                       :_multiple="false"
        ></image-gallery>



        <textArea v-if="_field_type == 'text_area'"
                  :_default="_default"
                  :_field_type="_field_type"
                  :_field_name="_field_name"
                  :_field_label="_field_label"
        ></textArea>


        <v-checkbox v-if="_field_type == 'checkbox' && _foreign_relation != 'many-to-many'"
                    v-model="field"
                    :label="_field_label"
                    :value="field"
                    :name="_field_name"
        ></v-checkbox>


        <v-checkbox v-if="_field_type == 'checkbox' && _foreign_relation == 'many-to-many'"
                    v-model="field"
                    :label="_field_label"
                    :value="_value"
                    :name="_field_name"
        ></v-checkbox>



        <!--

        <div v-if="_field_type == 'multiple-image'">
            <multiple-image-upload
                    :_default="_default"
                    :_model_name="_model_name"
                    :_field_type="_field_type"
                    :_field_name="_field_name"
            ></multiple-image-upload>
        </div>
        -->


    </div>
</template>

<script>
    import imageGallery from './ImageGallery'
    import textArea from './TextAreaComponent'
    import Vue from 'vue'
    import DatetimePicker from 'vuetify-datetime-picker'

    Vue.use(DatetimePicker)



    export default {
        name: "FormField",
        props: ['_class', '_field_label', '_field_name', '_field_type', '_mandatory','_options','_default','_model_name','_foreign_relation','_value'],

        data: function(){
            return {
              rules_mapping: {
                  required: v => !!v || 'Required.',
                  min: v => v.length >= 8 || 'Min 8 characters',
                  emailRules:  v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
              },

              field: null,
              menu: null,
              show: true,
              options:null,
              attrs: null,
              dateTimeModel: null,
            };
        },

        mounted(){
          this.handleShowInput();
          if(this._default && this._value !== null)
              this.field = this._value;
          else this.field = this._default

          if(this._field_type == 'date-time-picker'){
            this.default = '';
            this.dateTimeModel = this.field
          }
        },

        methods: {
          handleShowInput: function ()
          {
            if(this._field_type == 'password')
              this.show = false;
          },

          onDateTimeUpdate: function ()
          {

            let date_ob = this.field;


            let date = ("0" + date_ob.getDate()).slice(-2);

            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

            let year = date_ob.getFullYear();

            let hours = ("0" + date_ob.getHours()).slice(-2);

            let minutes = ("0" + date_ob.getMinutes()).slice(-2);

            let seconds = ("0" + date_ob.getSeconds()).slice(-2);

            this.dateTimeModel =  year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

          }

        },
        computed: {
          rules: function () {

              const rules_local = [];

              if(this._mandatory)
                  rules_local.push(this.rules_mapping.required);

              if(this._field_type == 'email')
                  rules_local.push(this.rules_mapping.emailRules);

              return rules_local;
          },
          /*
          dateTimeModel: function(){
            if(this._field_type === 'date-time-picker'){

              if(!this.field)
                return null;

              else{

                if(typeof this.field == 'string')
                  return this.field;

              }
            }
          }
           */
        },
        components: {
          imageGallery,
          textArea,
          DatetimePicker
        }
    }
</script>

<style scoped>

</style>
