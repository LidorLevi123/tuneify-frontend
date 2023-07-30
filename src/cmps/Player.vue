<template>
    <YouTube ref="youtubePlayer" v-if="currTrack?.youtubeId" :src="currTrack.youtubeId" @state-change="onStateChange" style="display: none;" />

    <section class="main-player-container">
        <section class="track-info-container">
            <section class="img-container">
                <img v-if="currTrack" :src="`${currTrack.imgUrl}`" alt="">
            </section>
            <section>
                <div v-if="currTrack" class="track-title">{{ currTrack.title }}</div>
                <div v-if="currTrack" class="track-artist">{{ currTrack.artists?.length > 0 ? currTrack.artists[0] : '' }}
                </div>
            </section>
        </section>

        <section class="player-mid-container">

            <section class="track-controls-container">

                <button class="shuffle btn" @click="toggleShuffle" title="Shuffle">
                    <span v-icon="'shuffle'" :class="{ 'enabled': this.isShuffle }"></span>
                </button>

                <button class="previous btn" @click="previousNextVideo(-1)" title="Previous">
                    <span v-icon="'previous'"></span>
                </button>

                <button class="play btn" @click="togglePlayPause" title="Play">
                    <span v-if="!isPlaying" v-icon="'play'"></span>
                    <span v-else v-icon="'pause'"></span>
                </button>

                <button class="next btn" @click="previousNextVideo(1)" title="Next">
                    <span v-icon="'next'"></span>
                </button>

                <button class="repeat btn" @click="cycleRepeatStates" title="Repeat" :class="{
                    'no-repeat': repeatStateIdx === 0,
                    'repeat-playlist': repeatStateIdx === 1,
                    'repeat-song': repeatStateIdx === 2
                }">
                    <span v-if="this.repeatStateIdx === 2" v-icon="'repeatSong'"></span>
                    <span v-else v-icon="'repeat'"></span>
                </button>

            </section>

            <section class="playback-container">
                <span>{{ secsToTimeFormat(elapsedTime) }}</span>
                <input class="playback-slider slider" @input="onChangeTime" type="range" min="0" :max="currTrackDuration"
                    v-model="elapsedTime"
                    :style="{ background: `linear-gradient(to right, white ${currProgressPercentage}%, hsla(0, 0%, 100%, .3) ${currProgressPercentage}%)`}">
                <span>{{ secsToTimeFormat(currTrackDuration) }}</span>
            </section>
        </section>
        <section class="vol-container">
            <button class="mute btn" @click="toggleMute" title="Mute">
                <span v-if="this.currVolume >= 66.66" v-icon="'vol1'"></span>
                <span v-if="this.currVolume >= 33.33 && this.currVolume < 66.66" v-icon="'vol2'"></span>
                <span v-if="this.currVolume >= 1 && this.currVolume < 33.33" v-icon="'vol3'"></span>
                <span v-if="this.currVolume <= 0" v-icon="'vol4'"></span>
            </button>
            <input class="vol-slider slider" @input="onChangeVolume" type="range" min="0" max="100" v-model="currVolume">
        </section>
    </section>
</template>


<script>

import { utilService } from '../services/util.service.js'
import { eventBus } from '../services/event-bus.service.js'
import { ytService } from '../services/yt.service.js'

import YouTube from 'vue3-youtube'

export default {
    data() {
        return {
            currProgressPercentage: 0,
            intervalId: null,
            elapsedTime: 0,
            isShuffle: false,
            isRepeat: false,
            repeatStates: ['noRepeat', 'repeatPlaylist', 'repeatSong'],
            repeatStateIdx: 0,
            isMute: false,
            lastVolume: 0,
            currVolume: 80,
            playbackPos: 0,
            currTrackDuration: 0,
            youtubePlayerStates: {
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
        eventBus.on('trackClicked', this.onTrackClicked)
    },
    methods: {
        updateCurrTrackIdx(trackIdx) {
            this.$store.commit({ type: 'setCurrTrackIdx', trackIdx })
        },
        togglePlayPause() {
            // if (!this.currStation.keys) return

            if (this.isPlaying) {
                this.$store.commit({ type: 'setIsPlaying', isPlaying: false })
                this.$refs.youtubePlayer.pauseVideo()
                this.handlePlaybackInterval(false)
            } else {
                this.$store.commit({ type: 'setIsPlaying', isPlaying: true })
                this.$refs.youtubePlayer.playVideo()
                this.handlePlaybackInterval(true)
            }
        },
        async previousNextVideo(diff) {
            // if (!this.currStation.keys) return


            if (this.repeatStateIdx === 2) {
                this.$refs.youtubePlayer.stopVideo()
                this.$refs.youtubePlayer.playVideo()
                return
            }

            this.updateCurrTrackIdx(this.currTrackIdx + diff)

            // if ((this.currTrackIdx === this.currStation.tracks.length - 1) && (this.repeatStateIdx === 1)) return

            if (this.isShuffle) {
                const randomIdx = utilService.getRandomIntInclusive(0, this.currTrackList.length - 1)
                this.updateCurrTrackIdx(randomIdx)
            }

            if (
                (this.repeatStateIdx === 1) &&
                (this.currTrackIdx > this.currTrackList.length - 1)) this.updateCurrTrackIdx(0)

            if (this.currTrackIdx < 0) this.updateCurrTrackIdx(this.currTrackList.length - 1)

            if (this.currTrack?.youtubeId) {
                console.log('song has youtubeId in local')
                this.loadVideo()
            } else {
                console.log('song doesn\'t have youtubeId in local')
                await this.setTrackYoutubeId()
                this.loadVideo()
            }
        },
        loadVideo() {
            // this.currTrack.youtubeId = youtubeId
            this.$store.commit({ type: 'setIsPlaying', isPlaying: true })
            this.handlePlaybackInterval(true)
        },
        toggleShuffle() {
            this.isShuffle = !this.isShuffle
        },
        cycleRepeatStates() {
            this.repeatStateIdx++
            if (this.repeatStateIdx >= this.repeatStates.length) this.repeatStateIdx = 0
        },
        toggleMute() {
            if (this.isMute) {
                this.currVolume = this.lastVolume
                this.lastVolume = 0
                this.$refs.youtubePlayer.unMute()
            } else {
                this.lastVolume = this.currVolume
                this.currVolume = 0
                this.$refs.youtubePlayer.mute()
            }
            this.isMute = !this.isMute
        },
        onChangeVolume() {
            this.$refs.youtubePlayer.setVolume(this.currVolume)
            if(this.currVolume > 0 && this.isMute === true) {
                this.isMute = false
                this.$refs.youtubePlayer.unMute()
            }
        },
        onChangeTime() {
            this.$refs.youtubePlayer.seekTo(this.elapsedTime, true)
            this.currProgressPercentage = (this.elapsedTime / this.currTrackDuration) * 100
        },
        stopVideo() {
            this.$store.commit({ type: 'setIsPlaying', isPlaying: false })
            this.$refs.youtubePlayer.stopVideo()
        },
        onStateChange(event) {
            if (event.data === this.youtubePlayerStates.ENDED) {

                // if ((this.currTrackIdx === this.currStation.tracks.length - 1) && (this.repeatStateIdx === 1)) return

                this.previousNextVideo(1)
            } else if (event.data === this.youtubePlayerStates.UNSTARTED) {
                let duration = this.$refs.youtubePlayer.getDuration()
                this.currTrackDuration = duration ? duration : 0
            } else return
        },
        async updateElapsedTime() {
            if (youtubePlayer && this.isPlaying) {
                this.elapsedTime = await this.$refs.youtubePlayer?.getCurrentTime()
            }
        },
        async onTrackClicked() {
            if (this.currTrack.youtubeId) {
                console.log('song has youtubeId in local')
                this.loadVideo()
            } else {
                console.log('song doesn\'t have youtubeId in local')
                await this.setTrackYoutubeId()
                this.loadVideo()
            }
        },
        async setTrackYoutubeId() {
            // get youtubeId from YT
            const term = this.currTrack.title + ' ' + this.currTrack.artists[0]
            const youtubeId = await ytService.queryYT(term)
            this.$store.dispatch({ type: 'updateTrack', youtubeId })
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
        eventBus.off('trackClicked', this.onTrackClicked)
    },

    computed: {
        repeatState() {
            return this.repeatStates[this.repeatStateIdx]
        },
        currStation() {
            return this.$store.getters.currStation
        },
        currTrackIdx() {
            return this.$store.getters.currTrackIdx
        },
        currTrackList() {
            return this.currStation?.tracks
        },
        currTrack() {
            return this.currStation?.tracks[this.currTrackIdx]
        },
        isPlaying() {
            return this.$store.getters.isCurrTrackPlaying
        }
    },
}

</script>