<template>
    <article class="library-station-preview" :style="{ columnGap: sidebarCollapsed ? '0' : '0.8rem' }">
        <img v-if="libraryView === 'list'" :src="imgUrl" alt="">
        <h5 :class="{ 'is-current': currStation?._id === station._id }"
            :style="{ display: sidebarCollapsed ? 'none' : 'block' }">{{ stationName }}</h5>
        <small v-if="libraryView === 'list'" :style="{ display: sidebarCollapsed ? 'none' : 'block' }"><span>{{
            station.tracks.length }} songs</span>
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
        libraryView() {
            return this.$store.getters.libraryView
        },
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
        },
        imgUrl() {
            return this.station.imgUrl || this.station.tracks[0]?.imgUrl || 'https://res.cloudinary.com/dys1sj4cd/image/upload/v1697929192/note_cu2ps5.png'
        }
    },
}
</script>
