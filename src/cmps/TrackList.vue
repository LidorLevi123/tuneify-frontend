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
            <li v-for="(track, idx) in station.tracks" :key="track.id" @click="trackClicked(track.id)">
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
        station: { type: Object },
    },

    methods: {
        trackClicked(trackId) {
            eventBus.emit('trackClicked', trackId, this.station)
        }
    },

    components: {
        TrackPreview,
    },

    name: 'TrackList',
}
</script>
