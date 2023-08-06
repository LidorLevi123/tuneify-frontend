<template>
    <section class="station-details" v-if="station">
        <div ref="topGradient" class="top-gradient">
            <section class="img-photo">
                <section class="img">
                    <img crossorigin="anonymous" class="station-img" :src="station.imgUrl" alt="" @load="getAvgImgClr"
                        ref="stationImg">
                </section>
                <section class="station-info">
                    <span class="pl">Playlist</span>
                    <h1 @click="openStationEditor">{{ station.name }}</h1>
                    <p class="description">{{ station.description }}</p>
                    <div>
                        <img src="http://res.cloudinary.com/dys1sj4cd/image/upload/v1691227930/favicon_juzdft.svg" alt="">
                        <span class="logo">{{ stationOwner }}</span>
                        <span class="songs-num" v-if="station.tracks">&bull; {{ station.tracks?.length }} songs</span>
                        <span class="songs-time" v-show="formttedTime">, about {{ formttedTime }} hours</span>
                    </div>
                </section>
            </section>
        </div>
        <div ref="botGradient" class="bottom-gradient">
            <section class="details-player">

                <button v-if="!isPlaying" class="details-play" v-icon="'detailsPlay'" v-show="hasTracks"
                    @click="clickTrack(currTrackIdx)" title="Play">
                </button>

                <button v-else class="details-play" v-icon="'detailsPause'" v-show="hasTracks" @click="pauseTrack"
                    title="Pause">
                </button>

                <button class="details-like" v-icon="'like'" v-show="!hasLiked && !isOwner" @click="likeStation">
                </button>

                <button class="details-unlike" v-icon="'unlike'" v-show="hasLiked && !isOwner"
                    @click="removeStation"></button>
                <!-- <span class="material-symbols-outlined df ai" title="Listen With Friends">group_add</span> -->
                <!-- <button v-icon="'moreOptions'" class="btn details-edit"></button> -->

                <div class="bubbling-heart" v-show="hasLiked && !isOwner">
                    <input type="checkbox" @click="removeStation" class="heart-input" id="like-undefined">
                    <label class="label" for="like-undefined"><span v-icon="`bHearts`"></span></label>
                </div>
            </section>
            <TrackList @track-clicked="clickTrack" @track-add="addTrack" @track-remove="removeTrack"
                @track-dislike="dislikeTrack" @station-update="loadStation" @search="getTracks" :station="station" />
        </div>
        <StationEdit @station-edit="loadStation" />
    </section>
    <section v-else>
        <h1>Loading...</h1>
    </section>
</template>

<script>
import historyTracker from '../services/history.service'
import StationEdit from '../cmps/StationEdit.vue'
import TrackList from '../cmps/TrackList.vue'

import { FastAverageColor } from 'fast-average-color'
import { stationService } from '../services/station.service'
import { utilService } from '../services/util.service'
import { eventBus, showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

import { SOCKET_EMIT_SET_TOPIC, SOCKET_EMIT_SEND_MSG, socketService } from '../services/socket.service.js';


export default {

    data() {
        return {
            station: null,
            tracksTotalDuration: 0
        }
    },

    computed: {
        stationId() {
            return this.$route.params.stationId
        },
        formttedTime() {
            const hours = this.tracksTotalDuration / (1000 * 60 * 60)
            return Math.floor(hours)
        },
        stationOwner() {
            return this.station.owner?.fullname
        },
        hasLiked() {
            const libraryStations = this.$store.getters.libraryStations
            return libraryStations.some(station => station._id === this.station._id)
        },
        hasTracks() {
            return this.station.tracks.length > 0
        },
        isOwner() {
            return this.station.owner._id === this.user?._id
        },
        isPlaying() {
            return this.$store.getters.isCurrTrackPlaying && this.station._id === this.currStation?._id
        },
        currStation() {
            return this.$store.getters.currStation
        },
        currTrackIdx() {
            return this.$store.getters.currTrackIdx
        },
        user() {
            return this.$store.getters.loggedinUser
        }
    },

    created() {
        this.loadStation()
        historyTracker.push(this.$route.fullPath)
    },

    methods: {
        async loadStation() {
            try {
                const station = await stationService.getById(this.stationId)
                this.station = station
                this.$emit('station', station)
                this.setTracksTotalDuration()

                console.log('Socket room name:', this.stationId)
                socketService.emit(SOCKET_EMIT_SET_TOPIC, this.stationId)
                socketService.emit(SOCKET_EMIT_SEND_MSG, 'Hello to everyone in this room')

            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not set current station')
            }
        },
        async likeStation() {
            console.log('liked station')
            try {
                await this.$store.dispatch({ type: 'updateUserStations', stationId: this.station._id, action: 'add' })
                const stationToSave = JSON.parse(JSON.stringify(this.station))
                this.$store.commit({ type: 'addStation', stationToSave })
                showSuccessMsg('Saved to Your Library')
            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not add station')
            }
        },
        async removeStation() {
            try {
                await this.$store.dispatch({ type: 'updateUserStations', stationId: this.station._id, action: 'remove' })
                await this.$store.dispatch({ type: 'removeStation', stationId: this.station._id })
                showSuccessMsg('Removed from Your Library')
            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not remove station')
            }
        },
        async getAvgImgClr() {
            try {
                const fac = new FastAverageColor()
                const elImg = this.$refs.stationImg
                const { hex } = await fac.getColorAsync(elImg)

                this.setBackgroundClr(hex)
            } catch (err) {
                console.log(err)
                throw new Error('cant get average color')
            }
        },
        async dislikeTrack(trackId) {
            try {
                await this.$store.dispatch({ type: 'removeTrack', trackId, stationId: this.user.likedId })
                showSuccessMsg('Removed from Your Library')
            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not dislike track')
            }
        },
        async addTrack(trackToSave, stationId) {
            try {
                await this.$store.dispatch({ type: 'addTrack', trackToSave, stationId })
                this.loadStation()
                eventBus.emit('track-add')
                if (stationId !== this.user.likedId) {
                    showSuccessMsg('Saved to station')
                } else {
                    showSuccessMsg('Saved to Your Library')
                }
            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not add track')
            }
        },
        async removeTrack(trackId) {
            try {
                await this.$store.dispatch({ type: 'removeTrack', trackId, stationId: this.station._id })
                showSuccessMsg('Removed from station')
            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not dislike track')
            }
        },
        async getTracks(query) {
            try {
                await this.$store.dispatch({ type: 'getTracks', query })
            } catch (err) {
                console.log(err.message)
                showErrorMsg(`Could not load tracks`)
            }
        },
        setBackgroundClr(avgColor) {
            const [darkerColor, darkerDarkerColor] = utilService.generateColors(avgColor)

            const elTopGrad = this.$refs.topGradient
            const elBotGrad = this.$refs.botGradient

            elTopGrad.style.backgroundImage = `linear-gradient(to bottom, ${avgColor} 0%, ${darkerColor})`
            elBotGrad.style.backgroundImage = `linear-gradient(to bottom, ${darkerDarkerColor} 0%, #121212 14.5rem, #121212)`
        },
        setTracksTotalDuration() {
            this.tracksTotalDuration = this.station.tracks?.reduce((sum, track) => sum = sum + track.formalDuration, 0)
        },
        openStationEditor() {
            if (this.station.owner.fullname !== this.user.fullname || this.station._id === this.user.likedId) return
            document.body.classList.add('modal-open')
        },
        clickTrack(trackIdx) {
            trackIdx = trackIdx === -1 ? 0 : trackIdx
            this.$store.commit({ type: 'setCurrTrackIdx', trackIdx })

            if (this.currStation?._id !== this.station._id) {
                const station = JSON.parse(JSON.stringify(this.station))
                this.$store.commit({ type: 'setCurrStation', station })
            }
            eventBus.emit('trackClicked')
        },
        pauseTrack() {
            eventBus.emit('trackPaused', true)
        },
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

