<template>
    <article @click="goToDetails(station._id)" @mouseover="emitAvgImgClr()"
        :class="{ 'main-preview-container': !horizontalDesign, 'main-preview-container-hor': horizontalDesign }">
        <div class="prev-img-container">
            <img crossorigin="anonymous" :src="`${station.imgUrl}`" alt="" ref="stationImg">
            <button v-if="!isStationPlaying" @click="onPlayStation" class="play-btn" v-icon="'mPlay'"></button>
            <button v-else @click="pauseTrack" class="play-btn pause-btn" v-icon="'pause'"></button>
        </div>

        <h4>{{ station.name }}</h4>
        <span>{{ station.description }}</span>
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
    },

    methods: {
        goToDetails(stationId) {
            stationId = stationId ? stationId : this.station.spotifyId
            this.$router.push(`/station/${stationId}`)
        },

        pauseTrack(ev) {
            ev.stopPropagation()
            eventBus.emit('trackPaused')
        },

        async onPlayStation(ev) {
            ev.stopPropagation()
            let station = await stationService.getById(this.station.spotifyId)
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
