<template>
    <article class="library-station-preview">
        <img :src="station.imgUrl" alt="">
        <h5 :class="{ 'is-current': currStation?._id === station._id }">{{ stationName }}</h5>
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
        user() {
            return this.$store.getters.loggedinUser
        },
        stationBelonging() {
            return this.station.owner === 'Tuneify' ? this.station.owner : this.user?.fullname
        },
        currStation() {
            return this.$store.getters.currStation
        }
    },

    name: 'LibraryStationPreview',
}

</script>
