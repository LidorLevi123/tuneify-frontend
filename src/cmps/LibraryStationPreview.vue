<template>
    <article class="library-station-preview">
        <img :src="station.imgUrl" alt="">
        <h5>{{ stationName }}</h5>
        <small>Playlist &bull; Guest</small>
        <div ref="he">hello</div>
    </article>
</template>
<script>

export default {
    props: {
        station: { type: Object, required: true },
    },

    data() {
        return {
            elTitle: this.$refs.he
        }
    },

    computed: {
        stationName() {
            return this.station.name || `My Playlist`
        }
    },

    name: 'LibraryStationPreview',
}

</script>
