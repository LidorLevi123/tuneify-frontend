<template>
    <section class="search-list">
        <ul v-if="tracks" class="clean-list">
            <li v-for="track in tracks" :key="track.id">
                <SearchPreview @track-add="onAddTrack" :track="track" :station="station" />
            </li>
        </ul>
    </section>
</template>

<script>
import SearchPreview from './SearchPreview.vue'
export default {
    name: 'SearchList',

    props: {
        station: { type: Object },
        tracks: { type: Array },
    },
    methods: {
        onAddTrack(track, stationId) {
            this.$emit('track-add', track, stationId)
        },
    },

    components: {
        SearchPreview,
    },

}
</script>


