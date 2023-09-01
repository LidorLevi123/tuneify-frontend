<template>
    <section class="station-list-container">
        <div v-if="stations[0]?.category" class="sub-header">
            <h1>{{ stations[0]?.category }}</h1>
            <RouterLink v-if="this.$route.path === '/'"
                :to="`/category/${stations[0]?.categoryId}/${stations[0]?.category}`" class="category-link">Show all
            </RouterLink>
        </div>
        <ul v-if="stations" class="clean-list"
            :class="{ 'station-list': !horizontalDesign, 'station-list-hor': horizontalDesign }">
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