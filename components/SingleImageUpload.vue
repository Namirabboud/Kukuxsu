<template>
    <div>
        <div v-if="progressInfos">
            <div class="mb-2"
                 v-for="(progressInfo, index) in progressInfos"
                 :key="index"
            >
                <span>{{progressInfo.fileName}}</span>
                <div class="progress">
                    <div class="progress-bar progress-bar-info"
                         role="progressbar"
                         :aria-valuenow="progressInfo.percentage"
                         aria-valuemin="0"
                         aria-valuemax="100"
                         :style="{ width: progressInfo.percentage + '%' }"
                    >
                        {{progressInfo.percentage}}%
                    </div>
                </div>
            </div>
        </div>

        <label class="btn btn-default">
            <input type="file" accept="image/*" multiple @change="selectFile" />
        </label>

        <button class="btn btn-success"
                :disabled="!selectedFiles"
                @click="uploadFiles"
        >
            Upload
        </button>

        <div v-if="message" class="alert alert-light" role="alert">
            <ul>
                <li v-for="(ms, i) in message.split('\n')" :key="i">
                    {{ ms }}
                </li>
            </ul>
        </div>
    </div>

</template>

<script>

    export default {
        name: "SingleImageUpload",
        props: ['_default','_field_type','_model_name','_field_name'],

        data: function () {
            return {
                selectedFiles: undefined,
                progressInfos: [],
                message: "",

                fileInfos: [],


            }
        },

        mounted() {

        },

        methods: {

            uploadFiles() {
                this.message = "";

                for (let i = 0; i < this.selectedFiles.length; i++) {
                    this.upload(i, this.selectedFiles[i]);
                }
            },

            upload(idx, file) {
                this.progressInfos[idx] = { percentage: 0, fileName: file.name };

                this.uploadServiceUpload(file, (event) => {
                    console.log('brogress bar: ',this.progressInfos[idx].percentage, 'event '.event)
                    this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total);
                })
                .then((response) => {

                    let prevMessage = this.message ? this.message + "\n" : "";
                    this.message = prevMessage + response.data.image;

                    bus.$emit('refresh_gallery');

                    /*
                    return uploadServiceGetFiles();
                    */

                })
                .then((files) => {
                    //this.fileInfos = files.data;
                })
                .catch((err) => {
                    console.log(err);
                    this.progressInfos[idx].percentage = 0;
                    this.message = "Could not upload the file:" + file.name;
                });
            },


            selectFile() {
                this.progressInfos = [];
                this.selectedFiles = event.target.files;
            },

            previewImage() {

                if(!this.image)
                    this.url = null;
                else
                    this.url= URL.createObjectURL(this.image)
            },

            uploadServiceUpload(file, onUploadProgress) {
                var formData = new FormData();

                formData.append("file", file);
                formData.append("model", this._model_name);

                return axios.post("/admin/upload-image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    onUploadProgress
                });
            },

            uploadServiceGetFiles() {
                //return axios.get("/files");


                return axios.post("/admin/get-images", {
                    model: this._model_name
                })
            }


        },
        components: {
        }

    }
</script>

<style scoped>

</style>
