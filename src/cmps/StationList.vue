<template>
    <section class="station-list-container">
        <ul v-if="stations" class="clean-list" :class="{
            'station-list': !horizontalDesign,
            'station-list-hor': horizontalDesign,
            'category-list': this.$route.path.startsWith('/category/'),
            'search-list': this.$route.path.startsWith('/search'),
            'search-history': isSearchHistory,
            'recent-searches': this.$route.path.startsWith('/recent-searches')
        }">
            <li v-for="station in stations" :key="station._id">
                <StationPreview :station="station" :horizontalDesign="horizontalDesign" @playStation="playStation" :isSearchHistory="isSearchHistory"/>
            </li>
        </ul>

    </section>
</template>

<script>
import StationPreview from './StationPreview.vue'
import { eventBus } from '../services/event-bus.service'

export default {
    name: 'StationList',
    props: {
        stations: { type: Array, required: true },
        horizontalDesign: { type: Boolean, default: false },
        isSearchHistory: { type: Boolean, default: false }
    },
    methods: {
        async playStation(station) {
            if (this.currStation?.spotifyId !== station.spotifyId) {
                const stationType = station.isAlbum ? 'album' : (station.isArtist ? 'artist' : 'station')
                const stationToPlay = await this.$store.dispatch({ type: 'getStation', stationId: station.spotifyId, stationType })

                this.$store.commit({ type: 'setCurrStation', station: stationToPlay })
                this.$store.commit({ type: 'setCurrTrackIdx', trackIdx: 0 })
            }
            eventBus.emit('trackClicked')
        }
    },
    computed: {
        currStation() {
            return this.$store.getters.currStation
        }
    },

    components: {
        StationPreview,
    },
}
</script>