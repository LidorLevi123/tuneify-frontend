<template>
    <section class="track-list">
        <div class="list-header track-preview-layout">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span>Date added</span>
            <span v-icon="'clock'"></span>
        </div>
        <hr>
        <ul v-if="station?.tracks" class="clean-list">
            <li v-for="(track, idx) in station.tracks" :key="track.id" @click="onTrackClicked(idx)">
                <TrackPreview 
                @track-add="onAddTrack"
                @track-remove="onRemoveTrack"
                @track-dislike="onDislikeTrack"
                :track="track" 
                :trackIdx="idx"/>
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
        onTrackClicked(trackIdx) {
            this.$emit('track-clicked', trackIdx)
        },
        onAddTrack(track, stationId) {
            this.$emit('track-add', track, stationId)
        },
        onRemoveTrack(track) {
            this.$emit('track-remove', track)
        },
        onDislikeTrack(track) {
            this.$emit('track-dislike', track)
        },
    },

    components: {
        TrackPreview,
    },

    name: 'TrackList',
}
</script>
