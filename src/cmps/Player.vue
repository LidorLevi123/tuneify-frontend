<template>
    <YouTube ref="youtubePlayer" v-if="currTrack?.youtubeId" :src="currTrack.youtubeId" @state-change="onStateChange"
        @ready="playVideo" style="display: none;" />

    <section class="main-player-container">
        <section class="track-info-container">
            <section class="img-container">
                <img v-if="currTrack" :src="`${currTrack.imgUrl}`" alt="">
            </section>
            <section class="text-container">
                <div v-if="currTrack" class="track-title">{{ currTrack.title }}</div>
                <div v-if="currTrack" class="track-artist">{{ currTrack.artists?.length > 0 ? currTrack.artists[0] : '' }}
                </div>
            </section>
            <span v-if="!hasLiked(currTrack?.id) && currTrack" class="btn-like" v-icon="`smallLikeDis`"
                @click="likeTrack(currTrack)"></span>
            <span v-else-if="hasLiked(currTrack?.id) && currTrack" class="btn-dislike" v-icon="`smallLikeEna`"
                @click="dislikeTrack(currTrack.id)"></span>
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
                    :style="{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0) ${playbackProgressPercentage}%, rgb(77,77,77) ${playbackProgressPercentage}%)` }">
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
            <input class="vol-slider slider" @input="onChangeVolume" type="range" min="0" max="100" v-model="currVolume"
                :style="{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0) ${currVolume}%, rgb(77,77,77) ${currVolume}%)` }">
        </section>
    </section>
</template>


<script>

import { utilService } from '../services/util.service.js'
import { eventBus, showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { ytService } from '../services/yt.service.js'

import YouTube from 'vue3-youtube'

export default {
    data() {
        return {
            // currStation: null,
            idIdx: 0,
            playbackProgressPercentage: 0,
            volProgressPercentage: 0,
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
        eventBus.on('trackClicked', this.loadVideo)
        eventBus.on('trackPaused', this.pauseVideo)
    },
    methods: {
        updateCurrTrackIdx(trackIdx) {
            this.$store.commit({ type: 'setCurrTrackIdx', trackIdx })
        },
        togglePlayPause() {
            if (!this.currTrack) return

            if (this.isPlaying) this.pauseVideo()
            else this.playVideo()
        },
        async previousNextVideo(diff) {

            console.log(this.repeatStateIdx)

            if (this.currTrackIdx === this.currStation.tracks.length - 1 && diff === 1) {
                if (this.repeatStateIdx === 2) {
                    this.replayVideo()
                    return
                }
                else if (this.repeatStateIdx === 0) {
                    this.stopVideo()
                    return
                } else if (this.repeatStateIdx === 1) {
                    this.updateCurrTrackIdx(-1)
                }

            } else if (this.currTrackIdx === 0 && diff === -1) {
                this.replayVideo()
                return
            }

            if (this.repeatStateIdx === 2) {
                this.replayVideo()
                return
            }

            this.updateCurrTrackIdx(this.currTrackIdx + diff)

            if (this.isShuffle) {
                const randomIdx = utilService.getRandomIntInclusive(0, this.currTrackList.length - 1)
                this.updateCurrTrackIdx(randomIdx)
            }

            this.loadVideo()
        },
        async loadVideo() {
            // if (isSetCurrStation) this.currStation = JSON.parse(JSON.stringify(this.$store.getters.currStation))

            if (this.currTrack?.youtubeId) {
                console.log('Got yt id from storage')
                this.playVideo()
                return
            }
            // get youtubeId from YT
            try {
                console.log('Sending request to yt id...')
                const term = this.currTrack.title + ' ' + this.currTrack.artists[0]
                const youtubeId = await ytService.queryYT(term)
                // const youtubeId = this.getDemoYoutubeId()
                await this.$store.dispatch({ type: 'updateTrack', youtubeId })
                this.playVideo()
            } catch (err) {
                console.log('Could not set track youtube id')
            }
        },
        async likeTrack(trackToSave) {
            try {
                await this.$store.dispatch({ type: 'addTrack', trackToSave, stationId: this.user.likedId })
                if (this.currStation._id !== this.user.likedId) {
                    showSuccessMsg('Added to your Liked Songs')
                } else {
                    showSuccessMsg('Saved to Your Library')
                }
            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not like track')
            }
        },
        async dislikeTrack(trackId) {
            try {
                await this.$store.dispatch({ type: 'removeTrack', trackId, stationId: this.user.likedId })
                showSuccessMsg('Removed from your Liked Songs')
            } catch (err) {
                showErrorMsg('Could not dislike track')
            }
        },
        getDemoYoutubeId() {
            if (this.idIdx > 3) this.idIdx = 0
            const ids = ['UNZJQw8cr6o', 'nyuo9-OjNNg', 'ic8j13piAhQ', 'EfWmWlW2PvM']
            return ids[this.idIdx++]
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
            if (this.currVolume > 0 && this.isMute === true) {
                this.isMute = false
                this.$refs.youtubePlayer.unMute()
            }
        },
        onChangeTime() {
            this.$refs.youtubePlayer.seekTo(this.elapsedTime, true)
            this.updatePlaybackProgress()
        },
        updatePlaybackProgress() {
            this.playbackProgressPercentage = (this.elapsedTime / this.currTrackDuration) * 100
        },
        updateVolProgress() {
            // this.volProgressPercentage = (this.elapsedTime / this.currTrackDuration) * 100
        },
        stopVideo() {
            this.$store.commit({ type: 'setIsPlaying', isPlaying: false })
            this.$refs.youtubePlayer?.stopVideo()
            this.playbackProgressPercentage = 0
            this.elapsedTime = 0
            this.handlePlaybackInterval(false)
        },
        pauseVideo() {
            this.$store.commit({ type: 'setIsPlaying', isPlaying: false })
            this.$refs.youtubePlayer?.pauseVideo()
            this.handlePlaybackInterval(false)
        },
        playVideo() {
            this.$store.commit({ type: 'setIsPlaying', isPlaying: true })
            this.$refs.youtubePlayer?.playVideo()
            this.handlePlaybackInterval(true)
        },
        replayVideo() {
            this.$refs.youtubePlayer.stopVideo()
            this.$refs.youtubePlayer.playVideo()
        },
        onStateChange(event) {
            if (event.data === this.youtubePlayerStates.ENDED) {

                this.previousNextVideo(1)

            } else if (event.data === this.youtubePlayerStates.UNSTARTED) {
                let duration = this.$refs.youtubePlayer?.getDuration()
                this.currTrackDuration = duration ? duration : 0
            } else return
        },
        async updateElapsedTime() {
            if (this.isPlaying) {
                this.elapsedTime = await this.$refs.youtubePlayer?.getCurrentTime()
            }
            this.updatePlaybackProgress()
            // if (youtubePlayer && this.isPlaying) {
            //     this.elapsedTime = await this.$refs.youtubePlayer?.getCurrentTime()
            // }
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
        hasLiked(trackId) {
            return this.likedTracks?.some(track => track.id === trackId)
        },
    },

    beforeunmount() {
        eventBus.off('trackClicked', this.loadVideo)
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
        },
        user() {
            return this.$store.getters.loggedinUser
        },
        likedTracks() {
            return this.$store.getters.likedTracks
        },
    },
}

</script>