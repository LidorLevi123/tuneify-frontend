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
            <li v-for="(track, idx) in station.tracks" :key="track.id" @click="playTrack(track.id)">
                <TrackPreview :track="track" :trackIdx="idx + 1" />
            </li>
        </ul>
    </section>
</template>

<script>
import TrackPreview from './TrackPreview.vue'
import { eventBus } from '../services/event-bus.service.js'

export default {
    props: {
        station: { type: Object},
    },

    methods: {
        playTrack(trackId) {
            eventBus.emit('playTrack', trackId, this.station)
        }
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