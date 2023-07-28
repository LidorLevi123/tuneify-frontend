<template>
    <section class="station-details" v-if="station">
        <section class="img-photo">
            <section class="img">
                <img class="station-img" :src="station.imgUrl" alt="">
            </section>
            <section class="station-info">
                <span>Playlist</span>
                <h1 @click="openStationEditor">{{ station.name }}</h1>
                <p class="description">{{ station.description }}</p>
            </section>
        </section>
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
        <StationEdit />
        <TrackList :tracks="station.tracks" />
    </section>
</template>

<script>
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
            this.setBackgroundClr()
            this.setTracksTotalDuration()
        },
        setBackgroundClr() {
            const clr = utilService.getRandomColor()

            document.querySelector('.station-details').style.backgroundImage =
                `linear-gradient(to bottom, ${clr} 0%, #121212 50%, #121212 100%)`
        },
        openStationEditor() {
            if (!this.station.owner) return
            document.body.classList.add('modal-open')
        },
        setTracksTotalDuration() {
            this.tracksTotalDuration = this.station.tracks?.reduce((sum, track) => sum = sum + track.formalDuration, 0)
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
