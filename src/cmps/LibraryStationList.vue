<template>
    <section class="library-station-list">
        <ul class="clean-list">
            <li @click="goToDetails(station._id)" v-for="station in libraryStations" :key="station.id">
                <LibraryStationPreview :station="station" />
                <button @click="removeStation(station._id, $event)">❌</button>
            </li>
        </ul>
    </section>
</template>

<script>
import LibraryStationPreview from './LibraryStationPreview.vue'

export default {
    props: {
        libraryStations: { type: Array },
    },

    methods: {
        async removeStation(stationId, ev) {
            ev.stopPropagation()
            await this.$store.dispatch({ type: 'removeStation', stationId })
            if(stationId === this.$route.params.stationId) this.$router.push('/')
        },
        goToDetails(stationId) {
            this.$router.push(`/station/${stationId}`)
        }
    },

    components: {
        LibraryStationPreview,
    },

    name: 'LibraryStationList',
}
</script>

<style>
.station-list {
    grid-template-columns: repeat(auto-fill, 15rem)
}
</style>
