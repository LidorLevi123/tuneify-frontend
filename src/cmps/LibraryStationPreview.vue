<template>
    <section class="library-station-preview">
        <img :src="station.imgUrl" alt="">
        <h5>{{ stationName }}</h5>
        <small>Playlist &bull; Guest</small>
    </section>
</template>
<script>

export default {
    props: {
        station: { type: Object, required: true },
    },

    computed: {
        stationName() {
            return this.station.name || `My Playlist`
        }
    },

    name: 'LibraryStationPreview',
}

</script>
