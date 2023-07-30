<template>
    <article class="library-station-preview">
        <img :src="station.imgUrl" alt="">
        <h5>{{ stationName }}</h5>
        <small>Playlist &bull; 
            <span v-if="station._id === 'liked101'">{{ station.tracks.length }} songs</span>
            <span v-else>{{ station.owner }}</span>
        </small>
    </article>
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
