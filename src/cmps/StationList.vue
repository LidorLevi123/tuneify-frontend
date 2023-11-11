<template>
    <section class="station-list-container" :style="{ maxWidth: maxWidth }">
        <ul v-if="stations" class="clean-list" :class="{
            'station-list': !horizontalDesign,
            'station-list-hor': horizontalDesign,
            'category-list': this.$route.path.startsWith('/category/'),
            'search-list': this.$route.path.startsWith('/search')
        }">
            <li v-for="station in stations" :key="station._id">
                <StationPreview :station="station" :horizontalDesign="horizontalDesign" @playStation="playStation" />
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
        horizontalDesign: { type: Boolean, default: false }
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
        maxWidth() {
            const stationsSize = this.stations.length * 11.9
            const gaps = (this.stations.length - 1) * 1.5
            if (this.stations.length < 9 && !this.horizontalDesign && this.$route.path !== '/') return `${stationsSize + gaps}rem`
        },
        currStation() {
            return this.$store.getters.currStation
        }
    },

    components: {
        StationPreview,
    },
}
</script>