<template>
    <section class="search-list">
        <ul v-if="tracks" class="clean-list">
            <li v-for="(track, idx) in tracks" :key="track.id" @click="onTrackClicked(idx)">
                <SearchPreview @track-add="onAddTrack" :track="track" :station="station" />
            </li>
        </ul>
    </section>
</template>

<script>
import { eventBus } from '../services/event-bus.service'
import SearchPreview from './SearchPreview.vue'
export default {
    name: 'SearchList',

    props: {
        station: { type: Object },
        tracks: { type: Array },
        fromRecommendations: { type: Boolean },
    },
    methods: {
        onAddTrack(track, stationId) {
            this.$emit('track-add', track, stationId)
        },
        onTrackClicked(trackIdx) {
            if (this.fromRecommendations) eventBus.emit('clickFromUserPlaylist', trackIdx, 'recommendations')
            else eventBus.emit('clickFromUserPlaylist', trackIdx, 'search')
        },
    },
    computed: {
        searchResStation() {
            return this.$store.getters.searchRes
        },
    },
    components: {
        SearchPreview,
    },

}
</script>


