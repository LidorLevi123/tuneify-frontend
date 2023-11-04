<template>
    <article class="library-station-preview" :style="{ columnGap: sidebarCollapsed ? '0' : '0.8rem' }">
        <img v-if="libraryView === 'list'" :src="imgUrl[2].url || imgUrl" alt=""
            :style="{ borderRadius: station.isArtist ? '50%' : 'unset' }">
        <h5 :class="{ 'is-current': currStation?._id === station._id }"
            :style="{ display: sidebarCollapsed ? 'none' : 'block' }">{{ stationName }}</h5>
        <small v-if="libraryView === 'list'" :style="{ display: sidebarCollapsed ? 'none' : 'block' }">
            <span>{{ stationType }}</span>
            <span v-if="!station.isArtist" v-html="stationBelonging"></span>
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
        stationType() {
            if (this.station.name === 'Liked Songs') return `${this.station.tracks.length} songs`
            else if (this.station.isArtist) return 'Artist'
            return this.station.isAlbum ? 'Album' : 'Playlist'
        },
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
            if (this.station.name !== 'Liked Songs') return ` &bull; ${this.station.owner.fullname}`
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
