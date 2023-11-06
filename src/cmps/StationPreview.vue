<template>
    <article @click="goToDetails(station._id)" @mouseover="emitAvgImgClr()"
        :class="{ 'main-preview-container': !horizontalDesign, 'main-preview-container-hor': horizontalDesign, 'category-station': this.$route.path.startsWith('/category/') }">
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
import { stationService } from '../services/station.service'
import { utilService } from '../services/util.service'

export default {
    name: 'StationPreview',

    props: {
        station: { type: Object, required: true },

        horizontalDesign: {
            type: Boolean,
            default: false
        }
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
            stationId = stationId ? stationId : this.station.spotifyId
            if (this.station.isAlbum) this.$router.push(`/album/${stationId}`)
            else if (this.station.isArtist) this.$router.push(`/artist/${stationId}`)
            else this.$router.push(`/station/${stationId}`)
        },

        pauseTrack(ev) {
            ev.stopPropagation()
            eventBus.emit('trackPaused')
        },

        async onPlayStation(ev) {
            ev.stopPropagation()
            let station
            if (this.station.isAlbum) station = await stationService.getById(this.station.spotifyId, 'album')
            else if (this.station.isArtist) station = await stationService.getById(this.station.spotifyId, 'artist')
            else station = await stationService.getById(this.station.spotifyId)
            station = JSON.parse(JSON.stringify(station))

            this.$store.commit({ type: 'setCurrStation', station })
            this.$store.commit({ type: 'setCurrTrackIdx', trackIdx: 0 })
            eventBus.emit('trackClicked')
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
