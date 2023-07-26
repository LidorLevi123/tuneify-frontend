<template>
    <section class="song-list">
        <div class="list-header grid-layout">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span>Date Added</span>
            <span>Song Length</span>
        </div>
        <hr>
        <ul class="clean-list grid-layout">
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

<style scoped>
.grid-layout {
    display: grid;
    grid-template-columns: 16px 6fr 4fr 3fr minmax(120px, 1fr);
    gap: 16px;
    padding: 0 16px;

    border: 1px solid transparent;
    border-radius: 4px;
    height: 56px;
    position: relative;
}
</style>