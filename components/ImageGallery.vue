<template>
    <div class="row">
        <v-dialog
                v-model="dialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
        >

            <template v-slot:activator="{ on, attrs }">
                <v-label>{{_field_label}}</v-label>

                <div
                        v-bind="attrs"
                        v-on="on"
                        class="col-md-12 blue-grey lighten-5 justify-center d-flex"

                >
                    <v-img
                            max-height="100"
                            max-width="100"
                            :src="default_image_preview"
                            contain

                    ></v-img>

                    <input type="hidden" :name="_field_name" v-model="image_input">

                    <span>+</span>
                </div>

            </template>
            <v-card class="blue-grey lighten-5">
                <v-toolbar
                        dark
                        color="primary"
                >
                    <v-btn
                            icon
                            dark
                            @click="dialog = false"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn
                                dark
                                text
                                @click="save"
                        >
                            Save
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                    <v-subheader>Images</v-subheader>
                    <v-row class="pa-5">

                        <v-col cols="8">
                            <v-item-group
                                    @change="groupImageChange"
                                    :multiple="_multiple"
                                    v-model="imageGroup">

                                <v-row>

                                    <v-col
                                            v-for="(image, index) in images"
                                            class="justify-center d-flex"
                                            :key="index"
                                            cols="12"
                                            md="3"
                                    >

                                        <v-item v-slot="{ active, toggle }" >
                                            <v-col
                                                    md="9"
                                                    class="gallery-image-wrapper elevation-3 align-self-md-center rounded pa-1 align-center"
                                                    :class="active ? 'primary': 'white'"


                                            >
                                                <v-img
                                                        :color="active ? 'primary' : ''"
                                                        max-height="200"
                                                        max-width="200"
                                                        :src="image.url"
                                                        contain
                                                        @click="toggle"
                                                >
                                                </v-img>


                                            </v-col>

                                        </v-item>

                                    </v-col>
                                </v-row>
                            </v-item-group>
                        </v-col>

                        <v-col cols="4">
                            <!-- the uploader here -->
                            <single-image-upload :_model_name="_model_name"></single-image-upload>
                        </v-col>
                    </v-row>
                <v-divider></v-divider>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>

    import singleImageUpload from './SingleImageUpload'


    export default {
        name: "ImageGallery",
        props: ['_default','_field_type','_model_name','_field_name','_field_label','_multiple'],

        data: function () {
            return {
                dialog: false,
                notifications: false,
                sound: true,
                widgets: false,
                images: null,
                imageGroup: null,
                image_input: null,
                default_image: 'images/cms/gallery_icon_2.png',
                default_image_preview: null,
            }
        },

        mounted() {
            this.fetchImages()
            this.setDefaultImage()
        },

        methods: {
            fetchImages: function()
            {
                axios.post("/admin/get-images", {
                    'model': this._model_name,
                })
                .then(response => {
                    console.log(response);
                    this.images = response.data.reverse();
                }).catch(err => {

                });
            },

            groupImageChange: function()
            {
                console.log(this.imageGroup)
            },

            save: function()
            {
                this.dialog = false

                console.log('save function')

                //save the images
                if(!this._multiple){

                    //save image in path and ur ready to go
                    if(this.imageGroup !== null){
                        var image = this.images[this.imageGroup]

                        console.log(image)

                        this.default_image_preview = image.url
                        this.image_input = image.name
                    }
                }

            },

            setDefaultImage: function()
            {
                if(this._default){
                    let default_split = this._default.split("/")
                    this.image_input = default_split[default_split.length - 1]
                    this.default_image_preview = this._default
                }else{
                    this.default_image_preview = this.default_image
                }

            },


        },

        created() {
            bus.$on('refresh_gallery',(obj) => {
                this.fetchImages();
            });

        },

        components: {
            singleImageUpload,
        }

    }
</script>

<style scoped>

</style>
