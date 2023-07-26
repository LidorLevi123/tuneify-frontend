<template>
    <section class="track-list">
        <div class="list-header track-preview-layout">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span>Date Added</span>
            <span>Track Length</span>
        </div>
        <hr>
        <ul v-if="tracks" class="clean-list">
            <li v-for="(track, idx) in tracks" :key="track.id">
                <template>{{ track.idx = idx+1 }} </template>
                <TrackPreview :track="track" />
            </li>
        </ul>
    </section>
</template>

<script>
import TrackPreview from './TrackPreview.vue'

export default {
    props: {
        tracks: { type: Array },
    },

    components: {
        TrackPreview,
    },

    name: 'TrackList',
}
</script>

<style lang="scss" scoped>

.track-list {
    .list-header {
        margin-block-start: 0.5em;
    }

}

</style>