<template>
    <ul class="station-list clean-list grid gap-2 m-2">
        <StationPreview
            @removeStation="removeStation"
            v-for="station in stations"
            :station="station"
            :key="station._id" />
    </ul>
</template>
<script>
import StationPreview from './StationPreview.vue'

export default {
    name: 'StationList',
    props: {
        stations: {
            type: [Array, null],
            required: true,
        },
    },
    components: {
        StationPreview,
    },
    methods: {
        removeStation(stationId) {
            this.$emit('removeStation', stationId)
        },
    },
}
</script>

<style>
.station-list {
    grid-template-columns: repeat(auto-fill, 15rem)
}
</style>
