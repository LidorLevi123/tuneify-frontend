<template>
    <section class="artist-data-containter">
        <div>
            <button v-icon="`close`" @click="closeBio" class="closeBio-btn"></button>
        </div>
        <section class="img-container">
            <img :src="artistImage" alt="">
        </section>
        <section class="artist-bio">
            <section class="followers" v-if="artistFollowers">
                <span class="followers-number">{{ artistFollowers.toLocaleString("en-US") }}</span>
                <span class="followers-text">Followers</span>
            </section>

            <h1 v-if="!artistSnippet">No bio available</h1>
            <section v-else class="artist-wiki" v-html="artistSnippet"></section>
        </section>
    </section>
</template>

<script>
export default {
    name: 'ArtistData',
    props: {
        artistImage: { type: String },
        artistSnippet: { type: String },
        artistFollowers: { type: Number }
    },
    methods: {
        closeBio() {
            this.$emit('closeBio')
        }
    }
}
</script>