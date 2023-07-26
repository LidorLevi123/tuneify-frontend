<template>

    <YouTube
        ref="youtubePlayer"
        :src="currentTrack.YTid"
        @ready="onPlayerReady"
        @state-change="onStateChange"
        />


    <section class="main-player-container">
        <section class="player-main-controls">
            <button class="play btn" @click="playVideo">Play</button>
            <button class="pause btn" @click="pauseVideo">Pause</button>
            <button class="stop btn" @click="stopVideo">Stop</button>
            <button class="next btn" @click="nextVideo">Next</button>
            <button class="previous btn" @click="previousVideo">Back</button>
        </section>
    </section>
</template>


<script>

import { stationService } from '../services/station.service.local.js'

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
            }
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
           if(this.currentTrack.currIdx > this.station.length-1) this.currentTrack.currIdx = 0
           this.loadVideo()
        },
        previousVideo() {
           this.currentTrack.currIdx -= 1
           if(this.currentTrack.currIdx < 0) this.currentTrack.currIdx = this.station.length-1
           this.loadVideo()
        },
        loadVideo() {
            this.currentTrack.YTid = this.station[this.currentTrack.currIdx].YTid
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
            if(event.data === this.playerStates.ENDED) this.nextVideo()
        }
    },
}
</script>