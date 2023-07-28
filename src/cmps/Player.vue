<template>
    <YouTube ref="youtubePlayer" :src="currTrack.ytId" @ready="onPlayerReady" @state-change="onStateChange"
        style="display: none;" />

    <section class="main-player-container">
        <section v-if="clickedTrack" class="playing-track">
            <section class="img-container">
                <img v-if="clickedTrack.imgUrl" :src="`${clickedTrack?.imgUrl}`" alt="">
            </section>
            <section>
                <div class="track-title">{{ clickedTrack?.title }}</div>
                <div class="track-artist">{{ clickedTrack.artists?.length > 0 ? clickedTrack.artists[0] : '' }}</div>
            </section>
        </section>

        <section class="player-mid">

            <section class="player-main-controls">

                <button class="shuffle btn" @click="toggleShuffle" title="Shuffle">
                    <span v-icon="'shuffle'" :class="{ 'enabled': this.isShuffle }"></span>
                </button>

                <button class="previous btn" @click="previousNextVideo(-1)" title="Previous">
                    <span class="material-symbols-outlined">skip_previous</span>
                </button>

                <button class="play btn" @click="togglePlayPause" title="Play">
                    <span v-if="!this.isPlaying" v-icon="'play'"></span>
                    <span v-else="this.isPlaying" v-icon="'pause'"></span>
                </button>

                <button class="next btn" @click="previousNextVideo(1)" title="Next">
                    <span class="material-symbols-outlined">skip_next</span>
                </button>

                <button class="repeat btn" @click="toggleRepeat" title="Repeat" :class="{ 'enabled': this.isRepeat }">
                    <span v-icon="'repeat'"></span>
                </button>

            </section>

            <section class="playback-container">
                <span style="color:white;">{{ elapsedTime }}</span>
                <input class="playback-slider slider" @input="onTimeChange" type="range" min="0"
                    :max="clickedTrack.formalDuration" v-model="elapsedTimeInSeconds">
                <span style="color:white;">{{ formattedTime }}</span>
            </section>
        </section>
        <section class="vol-container">
            <button class="mute btn" @click="toggleMute" title="Mute">
                <span v-if="this.currVolume > 66.66" v-icon="'vol1'"></span>
                <span v-if="this.currVolume > 33.33 && this.currVolume < 66.66" v-icon="'vol2'"></span>
                <span v-if="this.currVolume > 1 && this.currVolume < 33.33" v-icon="'vol3'"></span>
                <span v-if="this.currVolume == 0" v-icon="'vol4'"></span>
            </button>
            <input class="vol-slider slider" @input="onChangeVolume" type="range" min="0" max="100" v-model="currVolume">
        </section>
    </section>
</template>


<script>

import { utilService } from '../services/util.service.js'
import { eventBus } from '../services/event-bus.service.js'
import { ytService } from '../services/yt.service.js'
import { stationStore } from '../store/station.store.js'

import YouTube from 'vue3-youtube'
import { storageService } from '../services/async-storage.service'

export default {
    data() {
        return {
            clickedTrack: {},
            elapsedTimeInSeconds: 0,
            intervalId: null,
            elapsedTime: '0:00',
            lastPlayTime: 0,
            isPlaying: false,
            isShuffle: false,
            isRepeat: false,
            isMute: false,
            currTrackList: [],
            currVolume: 80,
            currTrack: {
                ytId: '',
                currIdx: 0,
                name: '',
                trackId: null
            },
            player: null,
            playerStates: {
                UNSTARTED: -1,
                ENDED: 0,
                PLAYING: 1,
                PAUSED: 2,
                BUFFERING: 3,
                CUED: 5,
            },
        }
    },
    components: {
        YouTube,
    },
    created() {
        eventBus.on('playTrack', this.onPlayTrack)
    },
    methods: {
        onPlayerReady(event) {
        },
        async previousNextVideo(diff) {
            this.currTrack.currIdx = this.currTrack.currIdx + diff

            if (this.isShuffle) {
                this.currTrack.currIdx = utilService.getRandomIntInclusive(0, this.currTrackList.length - 1)
            }

            if (this.currTrack.currIdx > this.currTrackList.length - 1) this.currTrack.currIdx = 0
            if (this.currTrack.currIdx < 0) this.currTrack.currIdx = this.currTrackList.length - 1

            this.clickedTrack = this.currTrackList[this.currTrack.currIdx]

            const term = this.clickedTrack.title + ' ' + this.clickedTrack.artists[0]
            let ytId = await ytService.queryYT(term)

            this.loadVideo(ytId)
        },
        loadVideo(ytId) {
            this.currTrack.ytId = ytId
            this.isPlaying = true
            this.lastPlayTime = new Date().getTime()
            // if(this.intervalId) clearInterval(this.intervalId)
            this.intervalId = setInterval(this.updateElapsedTime, 1000)

        },
        toggleShuffle() {
            this.isShuffle = !this.isShuffle
        },
        toggleRepeat() {
            this.isRepeat = !this.isRepeat
        },
        toggleMute() {
            if (this.isMute) {
                this.isMute = false
                this.$refs.youtubePlayer.unMute()
            } else {
                this.isMute = true
                this.$refs.youtubePlayer.mute()

            }
        },
        togglePlayPause() {
            if (this.isPlaying) {
                this.isPlaying = false
                this.$refs.youtubePlayer.pauseVideo()

                this.lastPlayTime = new Date().getTime()
                clearInterval(this.intervalId)
            } else {
                this.isPlaying = true
                this.$refs.youtubePlayer.playVideo()

                // if(this.intervalId) clearInterval(this.intervalId)
                this.intervalId = setInterval(this.updateElapsedTime, 1000)
            }
        },
        onChangeVolume() {
            this.$refs.youtubePlayer.setVolume(this.currVolume)
        },
        onTimeChange() {
            if (this.player && this.player.getPlayerState() !== this.playerStates.UNSTARTED) {

                const currentTimeInSeconds = parseInt(this.elapsedTimeInSeconds, 10)

                this.$refs.youtubePlayer.seekTo(currentTimeInSeconds, true)
                this.lastPlayTime = new Date().getTime() - currentTimeInSeconds * 1000
                this.updateElapsedTime()
            }
        },
        stopVideo() {
            this.isPlaying = false
            this.$refs.youtubePlayer.stopVideo()
        },
        onStateChange(event) {
            // console.log("event.data", event.data)
            if (event.data === this.playerStates.ENDED) {
                this.previousNextVideo(1)
            } else if (event.data === this.playerStates.UNSTARTED) {
                console.log("????????", this.$refs.youtubePlayer.getDuration())
            } else return
        },
        updateElapsedTime() {
            if (this.isPlaying) {
                const currentTime = new Date().getTime()
                const elapsedTimeSeconds = Math.floor((currentTime - this.lastPlayTime) / 1000)
                const minutes = Math.floor(elapsedTimeSeconds / 60)
                const seconds = elapsedTimeSeconds % 60
                this.elapsedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`

                // console.log("🚀 ~ file: Player.vue:193 ~ updateElapsedTime ~ this.elapsedTime:", this.elapsedTime)
            }
        },
        async onPlayTrack(trackId, station) {

            this.currTrackList = station.tracks
            console.log("🚀 this.currTrackList:", this.currTrackList)

            this.currTrack.currIdx = this.currTrackList.findIndex(track => track.id === trackId)

            this.clickedTrack = this.currTrackList[this.currTrack.currIdx]
            // console.log("🚀🚀🚀 this.clickedTrack:", this.clickedTrack)
            console.log("🚀🚀🚀 this.clickedTrack:", this.clickedTrack.artists)


            let ytId
            if (this.clickedTrack.youtubeId) {
                console.log('exists in local')

                ytId = this.clickedTrack.youtubeId
            } else {
                console.log('does not exist in local')

                // deep copy so we can edit store
                let stationCopy = JSON.parse(JSON.stringify(station))
                // get ytId from YT
                const term = this.clickedTrack.title + ' ' + this.clickedTrack.artists[0]
                ytId = await ytService.queryYT(term)
                // update deep copy with id
                stationCopy.tracks[this.currTrack.currIdx].youtubeId = ytId
                console.log(stationCopy.tracks[this.currTrack.currIdx])
                // save deep copy to storage
                await this.saveStationToLocal(stationCopy)
            }

            this.loadVideo(ytId)
        },
        async saveStationToLocal(station) {
            try {
                await this.$store.dispatch({ type: 'saveStation', stationToSave: station })
            } catch (err) {
                console.log(err.message)
            }
        }
    },
    beforeunmount() {
        eventBus.off('playTrack', this.onPlayTrack)
    },
    computed: {
        formattedTime() {
            const totalSeconds = Math.floor(this.clickedTrack.formalDuration / 1000)
            const hours = Math.floor(totalSeconds / 3600)
            const minutes = Math.floor((totalSeconds % 3600) / 60)
            const seconds = totalSeconds % 60
            const padZero = (num) => (num < 10 ? `0${num}` : num)
            return `${minutes}:${padZero(seconds)}`
        },
        timeSigToSecs(timeInSecs) {

        },
        timeSigTosecs(TimeSig) {

        },
        artist() {
            return this.clickedTrack.artists[0]
        }

    }
}


// this.$refs.youtubePlayer.getCurrentTime() - Returns the elapsed time in seconds since the video started playing.

// this.$refs.youtubePlayer.getDuration() - returns 0 til the metadata is loaded (mostly happens after vid starts playing).

// this.$refs.youtubePlayer.seekTo(secs, false) - plays the song "secs" number of secs from the start (if was paused - stays paused)

// best seekTo flow:
// while user grabs the slider this.$refs.youtubePlayer.seekTo(5, false)
// set to true while user lets releases the slider


</script>

<!--
{
    "addedAt": "2023-07-28T04:00:00Z",
    "id": "2KReCz1L5XkGIBhDncQ5VZ",
    "title": "BABY SAID",
    "artists": [
        "Måneskin"
    ],
    "imgUrl": "https://i.scdn.co/image/ab67616d0000b273c1b211b5fcdef31be5f806df",
    "formalDuration": 164682,
    "album": "RUSH!",
    "youtubeId": "Z8NiouNEivo"
} -->