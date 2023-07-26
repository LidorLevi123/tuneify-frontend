<template>
    <ul class="station-list clean-list">
        <li v-for="station in stations" :key="station._id">
            <StationPreview :station="station" />
        </li>
    </ul>
</template>

<script>
import StationPreview from './StationPreview.vue'

export default {
    props: {
        stations: { type: Array, required: true },
    },

    components: {
        StationPreview,
    },

    name: 'StationList',
}
</script>

