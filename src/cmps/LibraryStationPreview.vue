<template>
    <article class="library-station-preview" :class="{ 'grid': libraryView === 'grid' }" :style="containerStyles"
        :title="title">
        <img v-if="libraryView !== 'compact'" :src="imgUrl[1].url || imgUrl" alt="" :style="imgStyles">
        <button v-if="playBtnTerms" @click.stop="onPlayStation" class="play-btn" :class="{ 'grid-mode3': gridMode === '3' }"
            v-icon="'mPlay'"></button>
        <button v-if="pauseBtnTerms" @click.stop="pauseTrack" class="play-btn pause-btn"
            :class="{ 'grid-mode3': gridMode === '3' }" v-icon="'pause'"></button>
        <h5 v-if="terms" :class="{ 'is-current': currStation?._id === station._id }">
            <span v-html="highlightStationName"></span>
        </h5>
        <small v-if="terms">
            <span>{{ stationType }}</span>
            <span v-if="!station.isArtist" v-html="stationBelonging"></span>
        </small>
    </article>
</template>

<script>
import { eventBus } from '../services/event-bus.service'
export default {
    name: 'LibraryStationPreview',
    props: {
        station: { type: Object, required: true },
        query: { type: String },
    },

    computed: {
        highlightStationName() {
            if (this.query && this.stationName.toLowerCase().includes(this.query.toLowerCase())) {
                const regex = new RegExp(`(${this.query})`, 'gi')
                return this.stationName.replace(regex, '<span style="background-color: #2e77d0; border-radius: .25rem">$1</span>')
            }
            return this.stationName;
        },
        stationType() {
            if (this.station.name === 'Liked Songs' && this.station.tracks.length === 1) return '1 song'
            if (this.station.name === 'Liked Songs') return `${this.station.tracks.length} songs`
            if (this.station.isArtist) return 'Artist'
            return this.station.isAlbum ? 'Album' : 'Playlist'
        },
        gridMode() {
            return this.$store.getters.libraryView.gridMode
        },
        libraryView() {
            return this.$store.getters.libraryView.view
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
            return this.station.imgUrl || this.station.tracks[0]?.imgUrl || 'https://res.cloudinary.com/dys1sj4cd/image/upload/v1699955746/note1_zaakp6.png'
        },
        containerStyles() {
            const columnGap = this.sidebarCollapsed ? '0' : '0.8rem'
            const padding = (this.libraryView === 'grid' && (this.gridMode === '3' || this.gridMode === '4')) ? '0.8rem' : '0.3rem'
            return { columnGap, padding }
        },
        imgStyles() {
            const borderRadius = this.station.isArtist ? '50%' : 'unset';
            const width = this.libraryView === 'grid' ? '100%' : '3rem';
            return { borderRadius, width }
        },
        title() {
            if (this.gridMode === '1' || this.gridMode === '2' || this.sidebarCollapsed) return `${this.stationName} · ${this.stationType}`
        },
        terms() {
            return !(this.libraryView === 'grid' && (this.gridMode === '1' || this.gridMode === '2')) && !this.sidebarCollapsed
        },
        isStationPlaying() {
            const id = this.station._id ? this.station._id : this.station.spotifyId
            return this.currStation?._id === id && this.$store.getters.isCurrTrackPlaying
        },
        playBtnTerms() {
            return !(this.isStationPlaying || this.libraryView !== 'grid' || this.gridMode === '1' || this.gridMode === '2' || this.sidebarCollapsed || !this.station.tracks.length)
        },
        pauseBtnTerms() {
            return !(!this.isStationPlaying || this.libraryView !== 'grid' || this.gridMode === '1' || this.gridMode === '2' || this.sidebarCollapsed || !this.station.tracks.length)
        }
    },

    methods: {
        onPlayStation() {
            this.$emit('playStation', this.station)
        },
        pauseTrack() {
            eventBus.emit('trackPaused')
        }
    }
}
</script>