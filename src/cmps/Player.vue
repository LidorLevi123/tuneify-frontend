<template>
    <h1 style="color:white; font-size: 30px;">{{ this.currentTrack.currIdx + 1 }}</h1>
    <YouTube
        ref="youtubePlayer"
        :src="currentTrack.YTid"
        @ready="onPlayerReady"
        @state-change="onStateChange"
        style="display: none;"/>

    <!-- <h1 style="color:white;">{{ this.station[this.currentTrack.currIdx].trackList.title }}</h1> -->

    <section class="main-player-container">
        <section></section>
        <section class="player-main-controls">
            <button class="shuffle btn" @click="toggleShuffle" title="Shuffle"><span v-icon="'shuffle'" :class="{ 'enabled': this.isShuffle }"></span></button>
            <button class="previous btn" @click="previousVideo" title="Previous"><span class="material-symbols-outlined">skip_previous</span></button>
            <button class="play btn" @click="togglePlayPause" title="play"><span v-icon="'play'"></span></button>
            <button class="next btn" @click="nextVideo" title="Next"><span class="material-symbols-outlined">skip_next</span></button>
            <button class="repeat btn" @click="toggleRepeat" title="Repeat" :class="{ 'enabled': this.isRepeat }"><span v-icon="'repeat'"></span></button>
        </section>
        <section class="vol-container">
            <button class="mute btn" @click="toggleMute" title="Mute"><span class=" material-symbols-outlined vol-btn">volume_up</span></button>
            <input class="vol-slider" @input="onChangeVolume" type="range" min="0" max="100" v-model="currVolume" >
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
                currIdx: 0,
                name: ''
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
            isRepeat: false,
            isMute: false,
            currVolume: 80
        }
    },
    components: {
        YouTube,
    },
    created() {
        this.station = stationService.getEmptyStation().trackList

        this.currentTrack.YTid = this.station[this.currentTrack.currIdx].YTid
    },
    methods: {
        onPlayerReady(event) {
            console.log('onPlayerReady')
            console.log('ev', event)
            this.player = event.target
            // event.target.playVideo()
        },
        nextVideo() {
            this.currentTrack.currIdx += 1

            if (this.isShuffle) {
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
            this.isShuffle = !this.isShuffle
            console.log('shuffle', this.isShuffle)
        },
        toggleRepeat() {
            this.isRepeat = !this.isRepeat
            console.log('repeat', this.isRepeat)
        },
        toggleMute() {
            console.log(this.isMute)
            if(this.isMute) {
                this.isMute = false
                this.$refs.youtubePlayer.unMute()
            } else {
                this.isMute = true
                this.$refs.youtubePlayer.mute()
            }
        },
        togglePlayPause() {
            console.log(this.isPlaying)
            if(this.isPlaying) {
                this.isPlaying = false
                this.$refs.youtubePlayer.pauseVideo()
            } else {
                this.isPlaying = true
                this.$refs.youtubePlayer.playVideo()
            }
        },
        onChangeVolume() {
            console.log('currVolume', this.currVolume)
            this.$refs.youtubePlayer.setVolume(this.currVolume)
        },
        stopVideo() {
            this.isPlaying = false
            this.$refs.youtubePlayer.stopVideo()
        },
        onStateChange(event) {
            // console.log(event)
            if (event.data === this.playerStates.ENDED) {
                this.nextVideo()
            } else return
        },
    },
}
</script>