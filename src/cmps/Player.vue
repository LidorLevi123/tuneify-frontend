<template>
    <FullscreenPlayer ref="fullscreenPlayer" v-if="showFullscreen" :secsToTimeFormat="secsToTimeFormat"
        :isShuffle="isShuffle" :elapsedTime="+elapsedTime" :currTrackDuration="currTrackDuration"
        :repeatStateIdx="repeatStateIdx" :playbackProgressPercentage="playbackProgressPercentage" :hasLiked="hasLiked"
        :currVolume="+currVolume" @changeVolume="changeVolumefromFsPlayer" @changeTime="changeTimefromFsPlayer"
        @togglePlayPause="togglePlayPause" @previousNextVideo="previousNextVideo" @toggleShuffle="toggleShuffle"
        @cycleRepeatStates="cycleRepeatStates" @closeFullscreen="toggleFullscreen" @toggleMute="toggleMute"
        @likeTrack="likeTrack" @dislikeTrack="dislikeTrack" />

    <YouTube v-if="cookieLoaded" ref="youtubePlayer" :src="currTrack?.youtubeId || ''" @state-change="onStateChange"
        style="display: none;" />
    <section class="main-player-container" :class="{ 'is-shown': screenWidth < 890 && currTrack }"
        :style="rsbOpen ? { gridColumn: '1 / span 3' } : { gridColumn: '1 / -1' }">
        <section class="track-info-container">
            <section class="img-container" @click="goToStation" :title="`Go to playlist: ${this.currStation?.name}`">
                <img v-if="currTrack" :src="`${currTrack.imgUrl[2].url}`" alt="">
            </section>
            <section class="text-container">
                <div v-if="currTrack" class="track-title">{{ currTrack.title }}</div>
                <div class="track-artists">
                    <span v-if="currTrack" class="track-artist" v-for="(artist, idx) in currTrack.artists"
                        :key="artist.spotifyId">
                        <RouterLink :to="`/artist/${artist.spotifyId}`" @click.stop>{{ artist.name }}</RouterLink>
                        {{ idx < currTrack.artists.length - 1 ? ', ' : '' }} </span>
                </div>
            </section>
            <span v-if="!hasLiked(currTrack?.id) && currTrack" class="btn-like" v-icon="`smallLikeDis`"
                @click="likeTrack(currTrack)" title="Add to your liked tracks"></span>
            <span v-else-if="hasLiked(currTrack?.id) && currTrack" class="btn-dislike" v-icon="`smallLikeEna`"
                @click="dislikeTrack(currTrack?.id)" title="Remove from your liked tracks"></span>
            <img v-if="isPlaying" class="eq"
                src="https://res.cloudinary.com/dmmsf57ko/image/upload/v1683729372/Song_hoitzd.gif" alt="">
            <span v-if="screenWidth < 890" class="lyrics-btn" v-icon="`lyrics`" title="Lyrics" @click="showLyrics"
                :class="{ active: $route.path === '/lyrics' }"></span>
            <span v-if="currTrack" @click="togglePIP" class="btn-pip" :class="{ 'is-active': pipWindow }" v-icon="`pip`"
                title="Picture in picture"></span>
        </section>
        <section class="player-mid-container" ref="playerMid">
            <section class="track-controls-container">
                <button class="shuffle btn" @click="toggleShuffle" title="Shuffle">
                    <span v-icon="'shuffle'" :class="{ 'enabled': this.isShuffle }"></span>
                </button>
                <button v-icon="'previous'" class="previous btn" @click="previousNextVideo(-1)" title="Previous"></button>
                <button class="play btn" @click="togglePlayPause" title="Play">
                    <span v-if="!isPlaying" v-icon="'play'"></span>
                    <span v-else v-icon="'pause'"></span>
                </button>
                <button v-icon="'next'" class="next btn" @click="previousNextVideo(1)" title="Next"></button>
                <button class="repeat btn" @click="cycleRepeatStates" title="Repeat" :class="{
                    'no-repeat': repeatStateIdx === 0,
                    'repeat-playlist': repeatStateIdx === 1,
                    'repeat-song': repeatStateIdx === 2
                }
                    ">
                    <span v-if="this.repeatStateIdx === 2" v-icon="'repeatSong'"></span>
                    <span v-else v-icon="'repeat'"></span>
                </button>
            </section>
            <section v-show="pipWindow" class="pipContent" ref="pipContent"
                style="position: relative; display: flex; justify-content: center;">

                <img v-show="pipWindow" :src="`${currTrack?.imgUrl[0].url}`" alt=""
                    style="width: 100vw; object-fit: cover; height: 100vh;">
                <div
                    style="justify-content: center; display: flex; height: 20%; width: 100%; position: fixed; bottom: 0px; background-color:rgba(62, 62, 62, 0.7);">
                    <button v-icon="'previousPIP'" class="previous btn" @click="previousNextVideo(-1)" title="Previous"
                        style="padding-inline: 1.5rem;background: transparent;border: none;">
                    </button>
                    <button class="play btn" @click="togglePlayPause" title="Play"
                        style="padding-inline: 1.5rem;background: transparent;border: none;">
                        <span v-if="!isPlaying" v-icon="'playPIP'"></span>
                        <span v-else v-icon="'pausePIP'"></span>
                    </button>
                    <button v-icon="'nextPIP'" class="next btn" @click="previousNextVideo(1)" title="Next"
                        style="padding-inline: 1.5rem;background: transparent;border: none;">
                    </button>
                </div>
            </section>
            <section class="playback-container">
                <span>{{ secsToTimeFormat(elapsedTime) }}</span>
                <input class="playback-slider slider" @input="onChangeTime" type="range" min="0" :max="currTrackDuration"
                    v-model="elapsedTime"
                    :style="{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0) ${playbackProgressPercentage}%, rgb(77,77,77) ${playbackProgressPercentage}%)` }">
                <span>{{ secsToTimeFormat(currTrackDuration) }}</span>
            </section>
        </section>
        <section class="playback-container-mobile">
            <input class="playback-slider slider" @input="onChangeTime" type="range" min="0" :max="currTrackDuration"
                v-model="elapsedTime"
                :style="{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0) ${playbackProgressPercentage}%, rgb(77,77,77) ${playbackProgressPercentage}%)` }">
        </section>
        <section class="vol-container">
            <span v-if="currTrack" v-icon="`toggleRSB`" class="toggleRSB-btn" :class="{ active: this.rsbOpen }"
                @click="toggleRSB" title="Now Playing View"></span>
            <span v-if="currTrack" class="lyrics-btn" v-icon="`lyrics`" title="Lyrics" @click="showLyrics"
                :class="{ active: $route.path === '/lyrics' }"></span>
            <button class="mute btn" @click="toggleMute" title="Mute">
                <span v-if="this.currVolume >= 66.66" v-icon="'vol1'"></span>
                <span v-if="this.currVolume >= 33.33 && this.currVolume < 66.66" v-icon="'vol2'"></span>
                <span v-if="this.currVolume >= 1 && this.currVolume < 33.33" v-icon="'vol3'"></span>
                <span v-if="this.currVolume <= 0" v-icon="'vol4'"></span>
            </button>
            <input class="vol-slider slider" @input="onChangeVolume" type="range" min="0" max="100" v-model="currVolume"
                :style="{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0) ${currVolume}%, rgb(77,77,77) ${currVolume}%)` }">
            <span v-if="currTrack" v-icon="`fullScreen`" class="fullscreen-btn" @click="toggleFullscreen"
                title="Full screen"></span>
        </section>
    </section>
</template>
<script>
import { utilService } from '../services/util.service.js'
import { eventBus, showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { ytService } from '../services/yt.service.js'
import YouTube from 'vue3-youtube'
import { socketService, SOCKET_EVENT_ADD_MSG, SOCKET_EMIT_BROADCAST_TRACK } from '../services/socket.service.js'
import FullscreenPlayer from './FullscreenPlayer.vue'
export default {
    data() {
        return {
            cookieLoaded: false,
            pipWindow: null,
            screenWidth: window.innerWidth,
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
            currVolume: 30,
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
            showFullscreen: false,
        }
    },
    components: {
        YouTube,
        FullscreenPlayer
    },
    created() {
        eventBus.on('trackClicked', this.loadVideo)
        eventBus.on('trackPaused', this.pauseVideo)
        eventBus.on('playNextTrack', () => this.previousNextVideo(1))

        // sockets
        socketService.on(SOCKET_EVENT_ADD_MSG, this.onSocketMessage)
        socketService.on(SOCKET_EMIT_BROADCAST_TRACK, this.updateByBroadcast)

        this.loadCookie()
        document.addEventListener('keydown', this.handleKeyPress)
    },
    methods: {

        toggleFullscreen() {
            const doc = window.document
            const docEl = doc.documentElement
            const isFullscreen = doc.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement
            const exitFullscreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen

            if (isFullscreen) {
                exitFullscreen.call(doc)
                this.showFullscreen = false
            } else {
                const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
                requestFullScreen.call(docEl)
                this.showFullscreen = true

                const fullscreenChangeHandler = () => {
                    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                        this.showFullscreen = false
                        eventListeners.forEach(ev => doc.removeEventListener(ev, fullscreenChangeHandler))
                    }
                }

                const eventListeners = ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange']
                eventListeners.forEach(ev => doc.addEventListener(ev, fullscreenChangeHandler))
            }
        },



        handleKeyPress(ev) {
            const { tagName } = document.activeElement
            const { code } = ev

            if (tagName === 'INPUT') return

            switch (code) {
                case 'Space':
                    ev.preventDefault()
                    this.togglePlayPause()
                    break
                case 'ArrowRight':
                    this.previousNextVideo(1)
                    break
                case 'ArrowLeft':
                    this.previousNextVideo(-1)
                    break
                case 'NumpadAdd':
                    this.currVolume = Math.min(100, this.currVolume + 10)
                    this.onChangeVolume()
                    break
                case 'NumpadSubtract':
                    this.currVolume = Math.max(0, this.currVolume - 10)
                    this.onChangeVolume()
                    break
            }
        },
        async loadCookie() {
            await this.$store.dispatch({ type: 'setLastTrackFromCookie' })
            this.cookieLoaded = true
        },
        toggleRSB() {
            this.$store.commit('toggleRsb')
        },
        showLyrics() {
            if (this.$route.path !== '/lyrics') this.$router.push('/lyrics')
            else this.$router.go(-1)
        },
        async togglePIP() {
            const eventListener = (event) => {
                const playerContainer = this.$refs.playerMid
                const pipPlayer = event.target.querySelector('.pipContent')
                playerContainer.append(pipPlayer)
                this.pipWindow = null
            }

            try {
                if (this.pipWindow) {
                    this.pipWindow.removeEventListener("pagehide", eventListener)
                    this.pipWindow.close()
                    this.pipWindow = null

                } else {
                    const player = this.$refs.pipContent
                    this.pipWindow = await documentPictureInPicture.requestWindow({ width: 300, height: 302 })
                    this.pipWindow.document.body.append(player)
                    this.pipWindow.document.body.style.margin = 0
                    this.pipWindow.addEventListener("pagehide", eventListener)
                }
            } catch (err) {
                console.log(err)
                throw new Error
            }
        },
        updateCurrTrackIdx(trackIdx) {
            this.$store.commit({ type: 'setCurrTrackIdx', trackIdx })
        },
        togglePlayPause() {
            if (!this.currTrack) return showSuccessMsg('Choose track or playlist to begin')
            if (!this.$refs.youtubePlayer) return
            if (this.isPlaying) {
                this.pauseVideo(false)
            }
            else {
                this.playVideo()
            }
            this.broadcastTrackInfo()
        },
        async previousNextVideo(diff) {
            if (!this.currTrack) return
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
            if (this.currTrack?.youtubeId) {
                console.log('Got yt id from storage')
                this.elapsedTime = 0
                this.playVideo()
                this.broadcastTrackInfo()
                return
            }
            // get youtubeId from YT
            try {
                console.log('Sending request to yt id...')

                let term
                if (this.currTrack.artists[1]?.name) term = `${this.currTrack.artists[1].name} ${this.currTrack.artists[0].name} ${this.currTrack.title} `
                else term = `${this.currTrack.artists[0].name} ${this.currTrack.title}`

                const youtubeId = await ytService.queryYT(term, this.currTrack.id)
                // const youtubeId = this.getDemoYoutubeId()
                await this.$store.dispatch({ type: 'updateTrack', youtubeId })
                this.elapsedTime = 0
                this.playVideo()
                this.broadcastTrackInfo()
            } catch (err) {
                console.log('Could not set track youtube id', err.message)
            }
        },
        async likeTrack(trackToSave) {
            try {
                await this.$store.dispatch({ type: 'addTrack', trackToSave, stationId: this.user.likedId })
                eventBus.emit('loadLibrary')
                showSuccessMsg('Added to your Liked Songs')
            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not like track')
            }
        },
        async dislikeTrack(trackId) {
            try {
                await this.$store.dispatch({ type: 'removeTrack', trackId, stationId: this.user.likedId })
                eventBus.emit('loadLibrary')
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
            this.broadcastTrackInfo()
        },
        cycleRepeatStates() {
            this.repeatStateIdx++
            if (this.repeatStateIdx >= this.repeatStates.length) this.repeatStateIdx = 0
            this.broadcastTrackInfo()
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
        changeVolumefromFsPlayer(volume) {
            this.currVolume = volume
            this.onChangeVolume()
        },
        onChangeVolume() {
            this.$refs.youtubePlayer.setVolume(this.currVolume)
            if (this.currVolume > 0 && this.isMute === true) {
                this.isMute = false
                this.$refs.youtubePlayer.unMute()
            }
        },
        changeTimefromFsPlayer(time) {
            this.elapsedTime = +time
            this.onChangeTime()
        },
        onChangeTime() {
            this.changeTime()
            this.broadcastTrackInfo()
        },
        changeTime() {
            this.$refs.youtubePlayer?.seekTo(this.elapsedTime, true)
            this.updatePlaybackProgress()
        },
        updatePlaybackProgress() {
            this.playbackProgressPercentage = (this.elapsedTime / this.currTrackDuration) * 100
        },
        stopVideo() {
            this.$store.commit({ type: 'setIsPlaying', isPlaying: false })
            this.$refs.youtubePlayer?.stopVideo()
            this.playbackProgressPercentage = 0
            this.elapsedTime = 0
            this.handlePlaybackInterval(false)
        },
        pauseVideo(isBroadcast) {
            this.$store.commit({ type: 'setIsPlaying', isPlaying: false })
            this.$refs.youtubePlayer?.pauseVideo()
            this.handlePlaybackInterval(false)
            if (isBroadcast) this.broadcastTrackInfo()
        },
        playVideo() {
            this.$store.commit({ type: 'setIsPlaying', isPlaying: true })
            this.$refs.youtubePlayer?.playVideo()
            this.handlePlaybackInterval(true)
        },
        replayVideo() {
            this.$refs.youtubePlayer?.stopVideo()
            this.$refs.youtubePlayer?.playVideo()
            this.$store.commit({ type: 'setIsPlaying', isPlaying: true })
        },
        onStateChange(event) {
            if (event.data === this.youtubePlayerStates.ENDED) {
                this.previousNextVideo(1)
            } else {
                let duration = this.$refs.youtubePlayer?.getDuration()
                this.currTrackDuration = duration ? duration : 0
            }
        },
        async updateElapsedTime() {
            if (this.isPlaying) {
                this.elapsedTime = await this.$refs.youtubePlayer?.getCurrentTime()
            }
            this.updatePlaybackProgress()
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
            return this.likedTracks?.some(track => track?.id === trackId)
        },
        broadcastTrackInfo() {
            const trackInfo = {
                trackId: this.currTrack?.id,
                trackIdx: this.currTrackIdx,
                youtubeId: this.currTrack?.youtubeId,
                isPlaying: this.isPlaying,
                elapsedTime: this.elapsedTime,
                repeatStateIdx: this.repeatStateIdx,
                isShuffle: this.isShuffle,
            }

            socketService.emit(SOCKET_EMIT_BROADCAST_TRACK, trackInfo)
        },
        async updateByBroadcast(trackInfo) {

            const youtubeId = trackInfo['youtubeId']
            // if youtubeplayer not loaded - load it
            this.updateCurrTrackIdx(trackInfo.trackIdx)
            await this.$store.dispatch({ type: 'updateTrack', youtubeId })

            this.elapsedTime = trackInfo.elapsedTime
            this.changeTime()
            this.repeatStateIdx = trackInfo.repeatStateIdx
            this.isShuffle = trackInfo.isShuffle

            if (trackInfo.isPlaying) {
                this.playVideo()
            } else {
                this.pauseVideo(false)
            }
        },
        goToStation() {
            if (this.currStation._id) {
                this.$router.push(`/station/${this.currStation._id}`)
                window.scrollTo(0, 0)
            }
            else this.$router.push(`/search`)
        },
    },
    beforeunmount() {
        eventBus.off('trackClicked', this.loadVideo)
        eventBus.off('trackPaused', this.pauseVideo)
        eventBus.off('playNextTrack', () => this.previousNextVideo(1))
        document.removeEventListener('keydown', this.handleKeyPress)
    },
    computed: {
        rsbOpen() {
            return this.$store.getters.isRsbOpen
        },
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
            const stations = this.$store.getters.libraryStations
            const likedSongsStation = stations?.find(station => station._id === this.user?.likedId)
            return likedSongsStation?.tracks
        },
        nextTrack() {
            return this.$store.getters.currStation?.tracks[this.currTrackIdx + 1]
        },
    },
}
</script>