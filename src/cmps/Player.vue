<template>
    <YouTube ref="youtubePlayer" :src="currentTrack.YTid" @ready="onPlayerReady" @state-change="onStateChange" />

    <!-- <section class="main-player-container">
        <section class="player-main-controls">
            <button class="play btn" @click="playVideo">Play</button>
            <button class="pause btn" @click="pauseVideo">Pause</button>
            <button class="stop btn" @click="stopVideo">Stop</button>
            <button class="next btn" @click="nextVideo">Next</button>
            <button class="previous btn" @click="previousVideo">Back</button>
            <button class="shuffle btn" @click="toggleShuffle">Shuffle</button>
            <button class="shuffle btn" @click="toggleRepeat">Repeat</button>
        </section>
    </section> -->

    <section class="main-player-container">
        <section></section>
        <section class="player-main-controls">
            <button class="shuffle btn"> <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"
                    data-encore-id="icon" class="icon">
                    <path
                        d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z">
                    </path>
                    <path
                        d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z">
                    </path>
                </svg></button>
            <button class="back btn" title="Previous"><span class="material-symbols-outlined">skip_previous</span></button>
            <button class="play btn" title="play"><svg role="img" height="16" width="16" aria-hidden="true"
                    viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq">
                    <path
                        d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z">
                    </path>
                </svg></button>
            <button class="forward btn" title="Next"><span class="material-symbols-outlined">skip_next</span></button>
            <button class="repeat btn"><svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"
                    data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq icon">
                    <path
                        d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z">
                    </path>
                </svg></button>
        </section>
        <section class="vol-container">
            <span class="material-symbols-outlined vol-btn">volume_up</span>
            <input class="vol-slider" type="range" min="0" max="100">
        </section>
    </section>
</template>


<script>

import { stationService } from '../services/station.service.local.js'
import { utilService } from '../services/util.service.js'

import YouTube from 'vue3-youtube'

export default {
    data() {
        return {
            currentTrack: {
                videoUrl: 'https://www.youtube.com/watch?v=F1B9Fk_SgI0&ab_channel=ChildishGambinoVEVO',
                YTid: null,
                currIdx: 0
            },
            isPlaying: false,
            player: null,
            station: [],
            playerStates: {
                UNSTARTED: -1,
                ENDED: 0,
                PLAYING: 1,
                PAUSED: 2,
                BUFFERING: 3,
                CUED: 5,
            },
            isShuffle: false,
            isRepeat: false
        }
    },
    components: {
        YouTube,
    },
    created() {
        // console.log(this.getVideoIdFromUrl(this.currentTrack.videoUrl))

        this.station = stationService.getEmptyStation().trackList

        this.currentTrack.YTid = this.station[this.currentTrack.currIdx].YTid


    },
    methods: {
        onPlayerReady(event) {
            console.log('onPlayerReady')
            console.log('ev', event)
            this.player = event.target
            event.target.playVideo()
        },
        nextVideo() {

            this.currentTrack.currIdx += 1

            if(this.isShuffle) {
                this.currentTrack.currIdx = utilService.getRandomIntInclusive(0, this.station.length - 1)
            }

            if (this.currentTrack.currIdx > this.station.length - 1) this.currentTrack.currIdx = 0
            this.loadVideo()
        },
        previousVideo() {
            this.currentTrack.currIdx -= 1
            if (this.currentTrack.currIdx < 0) this.currentTrack.currIdx = this.station.length - 1
            this.loadVideo()
        },
        loadVideo() {
            this.currentTrack.YTid = this.station[this.currentTrack.currIdx].YTid
        },
        toggleShuffle() {
            this.isShuffle = this.isShuffle? false : true
        },
        toggleRepeat() {
            this.isRepeat = isRepeat? false : true
        },
        // getVideoIdFromUrl(url) {
        //     const videoIdRegex = /[?&]v=([^&]+)/
        //     const match = url.match(videoIdRegex)
        //     return match ? match[1] : null
        // },
        playVideo() {
            this.isPlaying = true
            this.$refs.youtubePlayer.playVideo()
        },
        pauseVideo() {
            this.isPlaying = false
            this.$refs.youtubePlayer.pauseVideo()
        },
        stopVideo() {
            this.isPlaying = false
            this.$refs.youtubePlayer.stopVideo()
        },
        onStateChange(event) {
            console.log(event)
            if (event.data === this.playerStates.ENDED) {
                this.nextVideo()
            } else return
        }
    },
}
</script>