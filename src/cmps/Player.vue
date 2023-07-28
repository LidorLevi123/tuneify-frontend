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
                <span style="color:white;">{{ secsToTimeFormat(elapsedTime) }}</span>
                <input class="playback-slider slider" @input="onChangeTime" type="range" min="0"
                    :max="currTrack.duration" v-model="elapsedTime">
                <span style="color:white;">{{ secsToTimeFormat(currTrack.duration) }}</span>
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
            intervalId: null,
            elapsedTime: 0,
            isPlaying: false,
            isShuffle: false,
            isRepeat: false,
            isMute: false,
            lastVolume: 0,
            currVolume: 80,
            clickedTrack: {},
            currTrackList: [],
            currTrack: {
                ytId: '',
                currIdx: 0,
                duration: 0,
                currTime: 0,
                trackId: null,
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
            this.handlePlaybackInterval(true)
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
                this.currVolume = this.lastVolume
                this.lastVolume = 0
                this.$refs.youtubePlayer.unMute()
            } else {
                this.isMute = true
                this.lastVolume = this.currVolume
                this.currVolume = 0
                this.$refs.youtubePlayer.mute()
            }
        },
        togglePlayPause() {
            if (this.isPlaying) {
                this.isPlaying = false
                this.$refs.youtubePlayer.pauseVideo()
                this.currTrack.currTime = this.$refs.youtubePlayer.getCurrentTime()

                this.handlePlaybackInterval(false)
            } else {
                this.isPlaying = true
                this.$refs.youtubePlayer.playVideo()
                this.handlePlaybackInterval(true)
            }
        },
        onChangeVolume() {
            this.$refs.youtubePlayer.setVolume(this.currVolume)
        },
        onChangeTime() {
            console.log('time changed')
            console.log('currTime', this.currTrack.currTime)
            this.currTrack.currTime = this.elapsedTime
            // console.log('1', this.$refs.youtubePlayer.getCurrentTime())
            // console.log('2', this.elapsedTime)
            // console.log('3')
            this.$refs.youtubePlayer.seekTo(this.currTrack.currTime, true)
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
                let duration = this.$refs.youtubePlayer.getDuration()
                this.currTrack.duration = duration ? duration : 0
                console.log("duration:", duration)
                console.log("duration format:", this.secsToTimeFormat(duration))
            } else return
        },
        async updateElapsedTime() {
            if (this.isPlaying) {
                this.elapsedTime = await this.$refs.youtubePlayer.getCurrentTime()
                // this.elapsedTimeString = this.secsToTimeFormat(elapsedTimeInSecs)
            }
        },
        async onPlayTrack(trackId, station) {
        console.log("🚀 station:", station)

            this.currTrackList = station.tracks

            this.currTrack.currIdx = this.currTrackList.findIndex(track => track.id === trackId)

            this.clickedTrack = this.currTrackList[this.currTrack.currIdx]

            let ytId
            if (this.clickedTrack.youtubeId) {
                console.log('song has YT id in local')

                ytId = this.clickedTrack.youtubeId
            } else {
                console.log('song doesn\'t have YT id in local')

                ytId = 'nyuo9-OjNNg'

                // // deep copy so we can update it
                // let stationCopy = JSON.parse(JSON.stringify(station))
                // // get ytId from YT
                // const term = this.clickedTrack.title + ' ' + this.clickedTrack.artists[0]
                // ytId = await ytService.queryYT(term)
                // // update deep copy with id
                // stationCopy.tracks[this.currTrack.currIdx].youtubeId = ytId
                // console.log(stationCopy.tracks[this.currTrack.currIdx])
                // // save deep copy to storage
                // await this.saveStationToLocal(stationCopy)
            }

            this.loadVideo(ytId)
        },
        async saveStationToLocal(station) {
            try {
                await this.$store.dispatch({ type: 'saveStation', stationToSave: station })
            } catch (err) {
                console.log(err.message)
            }
        },
        handlePlaybackInterval(NewInterval) {
            if (this.intervalId) clearInterval(this.intervalId)
            if (NewInterval) this.intervalId = setInterval(this.updateElapsedTime, 1000)
        },
        secsToTimeFormat(totalSeconds) {
            const minutes = Math.floor(totalSeconds / 60)
            const seconds = Math.floor(totalSeconds % 60)
            return `${minutes}:${String(seconds).padStart(2, '0')}`
        },
        timeFormatToSecs(timeFormat) {
            const [minutesStr, secondsStr] = timeFormat.split(':')
            const minutes = parseInt(minutesStr)
            const seconds = parseInt(secondsStr)
            return minutes * 60 + seconds
        },
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
    }
}

</script>


<!--

    this.$refs.youtubePlayer.getCurrentTime() - Returns the elapsed time in seconds since the video started playing.

    this.$refs.youtubePlayer.seekTo(secs, false) - plays the song "secs" number of secs from the start (if was paused - stays paused)

    this.$refs.youtubePlayer.getDuration() - returns 0 til the metadata is loaded (mostly happens after vid starts playing).

    best seekTo flow:
    while user grabs the slider this.$refs.youtubePlayer.seekTo(5, false)
    set to true while user lets releases the slider -->

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