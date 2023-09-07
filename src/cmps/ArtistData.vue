<template>
    <section class="artist-data-containter">
        <div>
            <button v-icon="`close`" @click="closeBio" class="closeBio-btn"></button>
        </div>
        <section class="img-container">
            <img :src="artistImage" alt="">
        </section>
        <section class="artist-bio">
            <h1 v-if="!artistSnippet">No bio available</h1>
            <section class="artist-wiki" v-html="artistSnippet"></section>
        </section>
    </section>
</template>

<script>
export default {
    name: 'ArtistData',
    props: {
        artistImage: { type: String },
        artistSnippet: { type: String }
    },
    methods: {
        closeBio() {
            this.$emit('closeBio')
        }
    }
}
</script>