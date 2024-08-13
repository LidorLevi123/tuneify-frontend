<template>
    <article @click="goToDetails(station._id)" @mouseover="emitAvgImgClr()"
        :class="{ 'main-preview-container': !horizontalDesign, 'main-preview-container-hor': horizontalDesign, 'category-station': this.$route.path.startsWith('/category/') || this.$route.path.startsWith('/recent-searches') }">
        <button class="remove-btn btn" v-icon="'close'" v-if="isSearchHistory" @click.stop="removeFromSearchHistory(station.spotifyId)"></button>
        <div class="prev-img-container">
            <img :class="{ artist: station.isArtist }" crossorigin="anonymous" :src="`${station.imgUrl}`" alt=""
                ref="stationImg">
            <button v-if="!isStationPlaying" @click="onPlayStation" class="play-btn" v-icon="'mPlay'"></button>
            <button v-else @click="pauseTrack" class="play-btn pause-btn" v-icon="'pause'"></button>
        </div>

        <h4 :class="{ visible: isVisible, alineRight: isHebrew }">{{ station.name }}</h4>
        <span :class="{ alineRight: isHebrew }">{{ stationDescription }}</span>
    </article>
</template>
<script>
import { eventBus } from '../services/event-bus.service'
import { utilService } from '../services/util.service'

export default {
    name: 'StationPreview',

    props: {
        station: { type: Object, required: true },
        horizontalDesign: { type: Boolean, default: false },
        isSearchHistory: { type: Boolean, default: false }
    },

    computed: {
        isStationPlaying() {
            return this.$store.getters.currStation?.spotifyId === this.station.spotifyId && this.$store.getters.isCurrTrackPlaying
        },
        stationDescription() {
            if (this.station.isAlbum && this.$route.path.startsWith('/artist')) return this.station.releaseDate.substr(0, 4) + ' • ' + this.station.type
            else if (this.station.isAlbum) return this.station.releaseDate.substr(0, 4) + ' • ' + this.station.artists[0].name
            else if (this.station.isArtist) return 'Artist'
            else return this.station.description
        },
        isVisible() {
            return (this.station.isArtist || this.$route.path !== '/')
        },
        isHebrew() {
            const hebrewRegExp = /[\u0590-\u05FF]/
            return hebrewRegExp.test(this.station.name)
        }
    },

    methods: {
        goToDetails(stationId) {
            if (!this.isSearchHistory) eventBus.emit('addToSearchHistory' , this.station)
    
            stationId = stationId ? stationId : this.station.spotifyId
            if (this.station.isAlbum) this.$router.push(`/album/${stationId}`)
            else if (this.station.isArtist) this.$router.push(`/artist/${stationId}`)
            else this.$router.push(`/station/${stationId}`)
        },
        removeFromSearchHistory() {  
            eventBus.emit('removeFromSearchHistory', this.station.spotifyId)
        },
        pauseTrack(ev) {
            ev.stopPropagation()
            eventBus.emit('trackPaused')
        },

        async onPlayStation(ev) {
            ev.stopPropagation()
            this.$emit('playStation', this.station)
        },
        async emitAvgImgClr() {
            if (this.horizontalDesign) {
                const hex = await utilService.getAvgImgClr(this.$refs.stationImg)
                eventBus.emit('changeBgColor', hex)
                eventBus.emit('backgroundColor', hex)
            }
        },
    },
}

</script>
