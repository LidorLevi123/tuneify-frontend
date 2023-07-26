<template>
    <section class="library-station-list">
            <ul class="clean-list">
                <li v-for="station in libraryStations" :key="station.id">
                    <LibraryStationPreview :station="station"/>
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
