<template>
    <article class="library-station-preview" :style="{ columnGap: sidebarCollapsed ? '0' : '0.8rem' }">
        <img :src="station.imgUrl" alt="">
        <h5 :class="{ 'is-current': currStation?._id === station._id }"
            :style="{ display: sidebarCollapsed ? 'none' : 'block' }">{{ stationName }}</h5>
        <small :style="{ display: sidebarCollapsed ? 'none' : 'block' }"><span>{{ station.tracks.length }} songs</span>
            &bull;
            <span>{{ stationBelonging }}</span>
        </small>
    </article>
</template>

<script>
export default {
    name: 'LibraryStationPreview',
    props: {
        station: { type: Object, required: true },
    },

    computed: {
        stationName() {
            return this.station.name
        },
        user() {
            return this.$store.getters.loggedinUser
        },
        stationBelonging() {
            return this.station.owner.fullname === 'Tuneify' ? this.station.owner.fullname : this.user?.fullname
        },
        currStation() {
            return this.$store.getters.currStation
        },
        sidebarCollapsed() {
            return this.$store.getters.sidebarCollapsed
        }
    },
}
</script>
