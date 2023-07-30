<template>
    <section class="track-list">
        <div class="list-header track-preview-layout">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span>Date Added</span>
            <span v-icon="'clock'"></span>
        </div>
        <hr>
        <ul v-if="station?.tracks" class="clean-list">
            <li v-for="(track, idx) in station.tracks" :key="track.id" @click="trackClicked(idx)">
                <TrackPreview :track="track" :trackIdx="idx" />
            </li>
        </ul>
    </section>
</template>

<script>
import TrackPreview from './TrackPreview.vue'

export default {
    props: {
        station: { type: Object },
    },

    methods: {
        trackClicked(trackIdx) {
            this.$emit('track-clicked', trackIdx)
        }
    },

    components: {
        TrackPreview,
    },

    name: 'TrackList',
}
</script>
