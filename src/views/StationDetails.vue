<template>
    <section class="station-details" v-if="station">
        <div class="top-gradient">
            <section class="img-photo">
                <section class="img">
                    <img crossorigin="anonymous" class="station-img" :src="station.imgUrl" alt="">
                </section>
                <section class="station-info">
                    <span>Playlist</span>
                    <h1 @click="openStationEditor">{{ station.name }}</h1>
                    <p class="description">{{ station.description }}</p>
                    <div>
                        <img src="../../public/favicon.svg" alt="">
                        <span class="logo">Tunify ⚬</span>
                        <span class="songs-num">{{ station.tracks?.length }} songs,</span>
                        <span class="songs-time">about {{ formttedTime }} hours</span>
                    </div>
                </section>
            </section>
        </div>
        <div class="bottom-gradient">
            <section class="details-player">
                <button class="details-play">
                    <span class="details-play" v-icon="'detailsPlay'"></span>
                </button>
                <button v-show="!station.owner" class="details-like">
                    <span v-icon="'like'"></span>
                </button>
                <button class="btn details-edit">
                    <span v-icon="'moreOptions'"></span>
                </button>
            </section>
            <TrackList :tracks="station.tracks" />
        </div>
        <StationEdit />
    </section>
</template>

<script>
import { FastAverageColor } from 'fast-average-color'
const fac = new FastAverageColor()
import { utilService } from '../services/util.service'

import StationEdit from '../cmps/StationEdit.vue'
import TrackList from '../cmps/TrackList.vue'

export default {

    data() {
        return {
            tracksTotalDuration: 0
        }
    },

    computed: {
        formttedTime() {
            const hours = this.tracksTotalDuration / (1000 * 60 * 60)
            return Math.floor(hours)
        },
        stationId() {
            return this.$route.params.stationId
        },
        station() {
            return this.$store.getters.currStation
        },
    },

    created() {
        this.loadStation()
    },

    methods: {
        async loadStation() {
            await this.$store.dispatch({ type: 'setCurrStation', stationId: this.$route.params.stationId })
            this.getAvgImgClr()
            this.setTracksTotalDuration()
        },
        setBackgroundClr(avgColor) {
            const [darkerColor, darkerDarkerColor] = utilService.generateColors(avgColor)

            document.querySelector('.top-gradient').style.backgroundImage =
                `linear-gradient(to bottom, ${avgColor} 0%, ${darkerColor} 100%)`
            document.querySelector('.bottom-gradient').style.backgroundImage =
                `linear-gradient(to bottom, ${darkerDarkerColor} 0%, #121212 6%, #121212 100%)`
        },
        openStationEditor() {
            if (!this.station.owner) return
            document.body.classList.add('modal-open')
        },
        setTracksTotalDuration() {
            this.tracksTotalDuration = this.station.tracks?.reduce((sum, track) => sum = sum + track.formalDuration, 0)
        },
        async getAvgImgClr() {
            try {
                const { hex } = await fac.getColorAsync(document.querySelector('.station-img'))
                this.setBackgroundClr(hex)
            } catch (err) {
                console.log(err)
                throw new Error('cant get average color')
            }
        }


    },
    watch: {
        stationId() {
            if (!this.stationId) return
            this.loadStation()
        },
    },
    components: {
        StationEdit,
        TrackList
    }
}
</script>

