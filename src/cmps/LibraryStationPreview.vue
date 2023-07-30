<template>
    <article class="library-station-preview">
        <img :src="station.imgUrl" alt="">
        <h5>{{ stationName }}</h5>
        <small><span>{{ station.tracks.length }} songs</span> &bull;
            <span>{{ station.owner }}</span>
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
