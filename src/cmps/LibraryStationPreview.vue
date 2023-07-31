<template>
    <article class="library-station-preview">
        <img :src="station.imgUrl" alt="">
        <h5>{{ stationName }}</h5>
        <small><span>{{ station.tracks.length }} songs</span> &bull;
            <span>{{ stationBelonging }}</span>
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
        },
        loggedinUser() {
            return this.$store.getters.loggedinUser
        },
        stationBelonging() {
            return this.station.owner === 'Tuneify' ? this.station.owner : this.loggedinUser.fullname
        }
    },

    name: 'LibraryStationPreview',
}

</script>
