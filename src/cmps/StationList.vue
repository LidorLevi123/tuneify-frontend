<template>
    <ul class="station-list clean-list grid gap-2 m-2">
        <li v-for="station in stations" :key="station._id">
            <StationPreview :station="station" />
        </li>
    </ul>
</template>

<script>
import StationPreview from './StationPreview.vue'

export default {
    name: 'StationList',
    props: {
        stations: { type: Array, required: true },
    },
    components: {
        StationPreview,
    },
}
</script>

<style>
.station-list {
    grid-template-columns: repeat(auto-fill, 15rem)
}
</style>
