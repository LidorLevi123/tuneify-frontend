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
            <li v-for="(track, idx) in station.tracks" :key="track.id" @click="trackClicked(idx)">
                <TrackPreview :track="track" :trackIdx="idx" />
                <section class="track-actions">
                    <span class="btn-like" v-icon="`smallLikeDis`" @click="onLikeTrack(track)"></span>
                </section>
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
        },
        onLikeTrack(track) {
            this.$emit('track-like', track)
            console.log(track)
        }
    },

    components: {
        TrackPreview,
    },

    name: 'TrackList',
}
</script>
