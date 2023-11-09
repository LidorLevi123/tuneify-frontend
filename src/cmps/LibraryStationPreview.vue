<template>
    <article class="library-station-preview" :class="{ 'grid': libraryView === 'grid' }" :style="containerStyles"
        @mouseover="isHoverd = true" @mouseleave="isHoverd = false">
        <img v-if="libraryView !== 'compact'" :src="imgUrl[2].url || imgUrl" alt="" :style="imgStyles">
        <h5 v-if="!sidebarCollapsed && gridMode !== '1' && gridMode !== '2'"
            :class="{ 'is-current': currStation?._id === station._id }">{{ stationName }}</h5>
        <small v-if="!sidebarCollapsed && gridMode !== '1' && gridMode !== '2'">
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
        gridMode: { required: true },
    },
    data() {
        return {
            isHoverd: null
        }
    },

    computed: {
        stationType() {
            if (this.station.name === 'Liked Songs' && this.station.tracks.length === 1) return '1 song'
            if (this.station.name === 'Liked Songs') return `${this.station.tracks.length} songs`
            if (this.station.isArtist) return 'Artist'
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
        },
        containerStyles() {
            const columnGap = this.sidebarCollapsed ? '0' : '0.8rem'
            const padding = (this.libraryView === 'grid' && this.gridMode === '3') ? '0.8rem' : '0.3rem'
            return { columnGap, padding }
        },
        imgStyles() {
            const borderRadius = this.station.isArtist ? '50%' : 'unset';
            const width = this.libraryView === 'grid' ? '100%' : '3rem';
            return { borderRadius, width }
        }
    },
}
</script>
