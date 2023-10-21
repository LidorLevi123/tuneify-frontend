<template>
    <section class="station-list-container">
        <ul v-if="stations" class="clean-list"
            :class="{ 'station-list': !horizontalDesign, 'station-list-hor': horizontalDesign, 'category-list': this.$route.path.startsWith('/category/') }">
            <li v-for="station in stations" :key="station._id">
                <StationPreview :station="station" :horizontalDesign="horizontalDesign" />
            </li>
        </ul>
    </section>
</template>

<script>
import StationPreview from './StationPreview.vue'

export default {
    name: 'StationList',
    props: {
        stations: { type: Array, required: true },
        horizontalDesign: { type: Boolean, default: false }
    },

    components: {
        StationPreview,
    },
}
</script>