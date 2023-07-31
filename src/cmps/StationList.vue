<template>
    <h1>{{ stations[0]?.category }}</h1>
    <ul v-if="stations" class="clean-list"
        :class="{ 'station-list': !horizontalDesign, 'station-list-hor': horizontalDesign }">
        <li v-for="station in stations" :key="station._id">
            <StationPreview :station="station" :horizontalDesign="horizontalDesign" />
        </li>
    </ul>
</template>

<script>
import StationPreview from './StationPreview.vue'

export default {
    props: {
        stations: { type: Array, required: true },
        horizontalDesign: {
            type: Boolean, default: false
        }
    },

    components: {
        StationPreview,
    },

    name: 'StationList',
}
</script>

