<template>
    <section class="song-list">
        <div class="list-header song-preview-layout">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span>Date Added</span>
            <span>Song Length</span>
        </div>
        <hr>
        <ul class="clean-list">
            <li v-for="song in songs" :key="song._id">
                <SongPreview :song="song" />
            </li>
        </ul>
    </section>
</template>

<script>
import SongPreview from './SongPreview.vue'

export default {
    props: {
        songs: { type: Array },
    },

    components: {
        SongPreview,
    },

    name: 'SongList',
}
</script>

<style lang="scss" scoped>

.song-list {
    .list-header {
        margin-block-start: 0.5em;
    }

}

</style>