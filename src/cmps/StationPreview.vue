<template>
    <article @click="goToDetails(station._id)" class="main-preview-container">
        <div class="prev-img-container">
            <img :src="`${station.imgUrl}`" alt="">
            <button class="play-btn"><svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24"
                    data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq">
                    <path
                        d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                    </path>
                </svg>
            </button>

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
    },

    methods: {
        goToDetails(stationId) {
            // await this.getStationTracks(stationId)
            this.$router.push(`station/${stationId}`)
        }
    },
}

</script>
