<template>
    <section class="station-list-container" :style="{ maxWidth: maxWidth }">
        <ul v-if="stations" class="clean-list" :class="{
            'station-list': !horizontalDesign,
            'station-list-hor': horizontalDesign,
            'category-list': this.$route.path.startsWith('/category/'),
            'search-list': this.$route.path.startsWith('/search')
        }">
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

    computed: {
        maxWidth() {
            const stationsSize = this.stations.length * 11.9
            const gaps = (this.stations.length - 1) * 1.5
            if (this.stations.length < 9 && !this.horizontalDesign && this.$route.path !== '/') return `${stationsSize + gaps}rem`
        }
    },

    components: {
        StationPreview,
    },
}
</script>