<template>
    <YouTube ref="youtubePlayer" :src="currTrack?.youtubeId" @state-change="onStateChange" style="display: none;" />

    <section class="main-player-container">
        <section v-if="currTrack" class="playing-track">
            <section class="img-container">
                <img v-if="currTrack.imgUrl" :src="`${currTrack?.imgUrl}`" alt="">
            </section>
            <section>
                <div class="track-title">{{ currTrack?.title }}</div>
                <div class="track-artist">{{ currTrack.artists?.length > 0 ? currTrack.artists[0] : '' }}</div>
            </section>
        </section>

        <section class="player-mid">

            <section class="player-main-controls">

                <button class="shuffle btn" @click="toggleShuffle" title="Shuffle">
                    <span v-icon="'shuffle'" :class="{ 'enabled': this.isShuffle }"></span>
                </button>

                <button class="previous btn" @click="previousNextVideo(-1)" title="Previous">
                    <span v-icon="'previous'"></span>
                </button>

                <button class="play btn" @click="togglePlayPause" title="Play">
                    <span v-if="!this.isPlaying" v-icon="'play'"></span>
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
                <span style="color:white;">{{ secsToTimeFormat(elapsedTime) }}</span>
                <input class="playback-slider slider" @input="onChangeTime" type="range" min="0" :max="currTrackDuration"
                    v-model="elapsedTime">
                <span style="color:white;">{{ secsToTimeFormat(currTrackDuration) }}</span>
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

import YouTube from 'vue3-youtube'

export default {
    data() {
        return {
            intervalId: null,
            elapsedTime: 0,
            isPlaying: false,
            isShuffle: false,
            isRepeat: false,
            repeatStates: ['noRepeat', 'repeatPlaylist', 'repeatSong'],
            repeatStateIdx: 0,
            isMute: false,
            lastVolume: 0,
            currVolume: 80,
            currStation: {},
            currTrackList: [],
            currTrack: {},
            prevTrack: {},
            playbackPos: 0,
            currTrackDuration: 0,
            currTrackIdx: -1,
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
        this.currTrack.youtubeId = ''
    },
    methods: {
        togglePlayPause() {
            // if (!this.currStation.keys) return

            if (this.isPlaying) {
                this.isPlaying = false
                this.$refs.youtubePlayer.pauseVideo()
                this.playbackPos = this.$refs.youtubePlayer.getCurrentTime()
                this.handlePlaybackInterval(false)
            } else {
                this.isPlaying = true
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



            this.currTrack.isPlaying = false

            this.currTrackIdx = this.currTrackIdx + diff

            // if (
            //     this.repeatStateIdx === 1
            //     && this.currTrackIdx
            //     && diff === 1)

            if (this.isShuffle) {
                this.currTrackIdx = utilService.getRandomIntInclusive(0, this.currTrackList.length - 1)
            }

            if (
                (this.repeatStateIdx === 1) &&
                (this.currTrackIdx > this.currTrackList.length - 1)) this.currTrackIdx = 0

            if (this.currTrackIdx < 0) this.currTrackIdx = this.currTrackList.length - 1

            this.currTrack = this.currTrackList[this.currTrackIdx]

            this.currTrack.isPlaying = false

            const term = this.currTrack.title + ' ' + this.currTrack.artists[0]
            let youtubeId = await ytService.queryYT(term)

            this.loadVideo(youtubeId)
        },
        loadVideo(youtubeId) {
            this.currTrack.youtubeId = youtubeId
            this.isPlaying = true
            this.handlePlaybackInterval(true)

        },
        toggleShuffle() {
            this.isShuffle = !this.isShuffle
        },
        cycleRepeatStates() {
            // this.isRepeat = !this.isRepeat
            this.repeatStateIdx++
            if (this.repeatStateIdx >= this.repeatStates.length) this.repeatStateIdx = 0
            console.log(this.repeatStateIdx)
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
        onChangeVolume() {
            this.$refs.youtubePlayer.setVolume(this.currVolume)
        },
        onChangeTime() {
            this.playbackPos = this.elapsedTime
            this.$refs.youtubePlayer.seekTo(this.playbackPos, true)
        },
        stopVideo() {
            this.isPlaying = false
            this.$refs.youtubePlayer.stopVideo()
        },
        onStateChange(event) {
            if (event.data === this.youtubePlayerStates.ENDED) {

                this.currTrack.isPlaying = false

                // this.currStation.tracks.length - 1 is NAN check why

                // console.log('this.currStation.length-1', (this.currStation.length)-1)
                // console.log('this.repeatStateIdx', this.repeatStateIdx)
                // if ((this.currTrackIdx === this.currStation.tracks.length - 1) && (this.repeatStateIdx === 1)) return
                this.previousNextVideo(1)
            } else if (event.data === this.youtubePlayerStates.UNSTARTED) {
                let duration = this.$refs.youtubePlayer.getDuration()
                this.currTrackDuration = duration ? duration : 0
            } else return
        },
        async updateElapsedTime() {
            if (this.isPlaying) {
                this.elapsedTime = await this.$refs.youtubePlayer.getCurrentTime()
            }
        },
        async onTrackClicked(trackId, station) {

            // deep copy so we can edit
            let stationCopy = JSON.parse(JSON.stringify(station))

            this.updateData(trackId, stationCopy)

            if (this.currTrack.youtubeId) {
                console.log('song has youtubeId in local')
            } else {
                console.log('song doesn\'t have youtubeId in local')
                await this.setTrackYoutubeId()
            }

            this.saveStationToStore(this.currStation)
            this.loadVideo(this.currTrack.youtubeId)
        },
        updateData(trackId, stationCopy) {

            this.currTrack.isPlaying = false

            this.currStation = stationCopy
            this.currTrackList = this.currStation.tracks
            this.currTrack = this.currStation.tracks.find((track) => track.id === trackId)
            this.currTrackIdx = this.currTrackList.findIndex(track => track.id === trackId)

            this.currTrack.isPlaying = true

        },
        async setTrackYoutubeId() {


            // get youtubeId from YT
            const term = this.currTrack.title + ' ' + this.currTrack.artists[0]
            this.currTrack.youtubeId = await ytService.queryYT(term)

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
        async saveStationToStore(station) {

            try {
                await this.$store.dispatch({ type: 'saveStation', stationToSave: station })
            } catch (err) {
                console.log(err.message)
            }
        }
    },
    beforeunmount() {
        eventBus.off('trackClicked', this.onTrackClicked)
    },
    computed: {
        repeatState() {
            return this.repeatStates[this.repeatStateIdx];
        },
    }
}

</script>



