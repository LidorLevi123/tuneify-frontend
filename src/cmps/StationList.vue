<template>
    <ul class="station-list">
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

