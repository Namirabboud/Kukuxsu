<template>

    <div>
        <label>{{_field_label}}</label>
        <tiptap-vuetify
                v-model="content"
                :extensions="extensions"
        />
        <input type="hidden" :name="_field_name" v-model="field">
    </div>
</template>

<script>
    import { TiptapVuetify, Heading, Bold, Italic, Strike, Underline, Code, Paragraph, BulletList, OrderedList, ListItem, Link, Blockquote, HardBreak, HorizontalRule, History } from 'tiptap-vuetify'

    export default {
        name: "TextAreaComponent",
        props: ['_field_name','_field_label','_default'],
        data: function () {
            return {
                field: null,
                extensions: [
                    History,

                    Blockquote,
                    Link,
                    Underline,
                    Strike,
                    Italic,
                    ListItem,
                    BulletList,
                    OrderedList,
                    [Heading, {
                        options: {
                            levels: [1, 2, 3]
                        }
                    }],
                    Bold,
                    Code,
                    HorizontalRule,
                    Paragraph,

                    HardBreak
                ],
                content: '',

            }
        },
        mounted() {
            this.content = this._default
        },

        components: {
            TiptapVuetify
        },
        watch: {
            content: function (val) {
                this.field=val
            },
        }



    }
</script>

<style scoped>

</style>
