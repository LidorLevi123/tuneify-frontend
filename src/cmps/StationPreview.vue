<template>
    <article @click="goToDetails(station._id)"
        :class="{ 'main-preview-container': !horizontalDesign, 'main-preview-container-hor': horizontalDesign }">
        <div class="prev-img-container">
            <img :src="`${station.imgUrl}`" alt="">
            <button class="play-btn" v-icon="'play'"></button>
        </div>

        <h4>{{ station.name }}</h4>
        <span>{{ station.description }}</span>
    </article>
</template>
<script>
export default {
    name: 'StationPreview',
    props: {
        station: { type: Object, required: true },
        horizontalDesign: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        goToDetails(stationId) {
            this.$router.push(`/station/${stationId}`)
        }
    },
}

</script>
