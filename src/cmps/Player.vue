<template>
    <h1 style="color:white; font-size: 30px;">Track {{ this.currTrack.currIdx + 1 }}</h1>

    <YouTube ref="youtubePlayer" :src="currTrack.YTid" @ready="onPlayerReady" @state-change="onStateChange"
        style="display: none;" />

    <section class="main-player-container">
        <section></section>
        <section class="player-main-controls">

            <button class="shuffle btn" @click="toggleShuffle" title="Shuffle">
                <span v-icon="'shuffle'" :class="{ 'enabled': this.isShuffle }"></span>
            </button>

            <button class="previous btn" @click="previousVideo" title="Previous">
                <span class="material-symbols-outlined">skip_previous</span>
            </button>

            <button class="play btn" @click="togglePlayPause" title="play">
                <span v-if="!this.isPlaying" v-icon="'play'"></span>
                <span v-if="this.isPlaying" v-icon="'pause'"></span>
            </button>

            <button class="next btn" @click="nextVideo" title="Next">
                <span class="material-symbols-outlined">skip_next</span>
            </button>

            <button class="repeat btn" @click="toggleRepeat" title="Repeat" :class="{ 'enabled': this.isRepeat }">
                <span v-icon="'repeat'"></span>
            </button>

        </section>
        <section class="vol-container">
            <button class="mute btn" @click="toggleMute" title="Mute"><span
                    class=" material-symbols-outlined vol-btn">volume_up</span></button>
            <input class="vol-slider" @input="onChangeVolume" type="range" min="0" max="100" v-model="currVolume">
        </section>
    </section>
</template>


<script>

import { utilService } from '../services/util.service.js'
import { eventBus } from '../services/event-bus.service.js'

import YouTube from 'vue3-youtube'

export default {
    data() {
        return {
            isPlaying: false,
            isShuffle: false,
            isRepeat: false,
            isMute: false,
            currTrackList: [],
            currVolume: 80,
            currTrack: {
                YTid: '',
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
            this.player = event.target
            // event.target.playVideo()
        },
        async nextVideo() {
            this.currTrack.currIdx += 1

            if (this.isShuffle) {
                this.currTrack.currIdx = utilService.getRandomIntInclusive(0, this.currTrackList.length - 1)
            }

            if (this.currTrack.currIdx > this.currTrackList.length - 1) this.currTrack.currIdx = 0

            let clickedTrack = this.currTrackList[this.currTrack.currIdx]
            let YTid = await this.queryYT(clickedTrack.title, clickedTrack.artists[0])
            this.loadVideo(YTid)
        },
        async previousVideo() {
            this.currTrack.currIdx -= 1

            if (this.isShuffle) {
                this.currTrack.currIdx = utilService.getRandomIntInclusive(0, this.currTrackList.length - 1)
            }

            if (this.currTrack.currIdx < 0) this.currTrack.currIdx = this.currTrackList.length - 1

            let clickedTrack = this.currTrackList[this.currTrack.currIdx]
            let YTid = await this.queryYT(clickedTrack.title, clickedTrack.artists[0])
            this.loadVideo(YTid)
        },
        loadVideo(YTid) {
            this.currTrack.YTid = YTid
            this.isPlaying = true
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
            } else {
                this.isPlaying = true
                this.$refs.youtubePlayer.playVideo()
            }
        },
        onChangeVolume() {
            this.$refs.youtubePlayer.setVolume(this.currVolume)
        },
        stopVideo() {
            this.isPlaying = false
            this.$refs.youtubePlayer.stopVideo()
        },
        onStateChange(event) {
            if (event.data === this.playerStates.ENDED) {
                this.nextVideo()
            } else return
        },
        async onPlayTrack(trackId, tracks) {
            this.currTrackList = tracks
            this.currTrack.currIdx = this.currTrackList.findIndex(track => track.id === trackId)

            let clickedTrack = this.currTrackList[this.currTrack.currIdx]

            let YTid = await this.queryYT(clickedTrack.title, clickedTrack.artists[0])
            this.loadVideo(YTid)

        },
        async queryYT(trackName, artists) {
            const API_KEY = 'AIzaSyCy-U5zlHg4WobQ9TIYb_Y3d7uMvFqFv9A'
            const SEARCH = trackName + ' ' + artists
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${API_KEY}&q=${SEARCH}`

            try {
                const response = await fetch(url)
                const data = await response.json()
                return data.items[0].id.videoId

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
    },
}

</script>


