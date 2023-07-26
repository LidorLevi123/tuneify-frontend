<template>
    <section class="library-station-list">
            <ul class="clean-list">
                <li v-for="station in libraryStations" :key="station.id">
                    <LibraryStationPreview :station="station"/>
                    <button @click="removeStation(station._id)">X</button>
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
        removeStation(stationId) {
            this.$store.dispatch({ type: 'removeStation', stationId })
        },
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
