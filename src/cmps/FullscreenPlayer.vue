<template>
    <section class="fullscreen-player" ref="fullscreenPlayer">
        <section class="station-info">
            <span v-icon="`logo`"></span>
            <section class="playing-from">
                <h1 class="uppercase">Playing from {{ stationType }}</h1>
                <h2 class="station-name">{{ currStation?.name }}</h2>
            </section>
        </section>
        <section class="next-track" v-if="nextTrack" :class="{
            'fade-in': playbackProgressPercentage > 80,
            'fade-out': playbackProgressPercentage > 99
        }">
            <img :src="nextTrack.imgUrl[1].url" alt="">
            <section class="next-track-text">
                <h1 class="uppercase">up next</h1>
                <h2>{{ nextTrack.title }} • {{ nextTrack.artists[0].name }}</h2>
            </section>
        </section>
        <section class="track-info">
            <img :src="currTrack.imgUrl[0].url" alt="" crossorigin="anonymous" @load="setBackgroundClr" ref="trackImg">
            <div class="track-text">
                <h1 class="track-title">{{ currTrack.title }}</h1>
                <h3 class="track-artist">{{ currTrack.artists[0].name }}</h3>
            </div>
        </section>
        <section class="player-mid-container-fs" ref="playerControls">
            <section class="progress-bar">
                <span>{{ secsToTimeFormat(elapsedTime) }}</span>
                <input :value="elapsedTime" class="playback-slider slider" type="range" min="0" :max="currTrackDuration"
                    @input="emitChangeTime"
                    :style="{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0) ${playbackProgressPercentage}%, rgb(77,77,77) ${playbackProgressPercentage}%)` }">
                <span>{{ secsToTimeFormat(currTrackDuration) }}</span>
            </section>
            <section class="track-controls-container">
                <section class="liked">
                    <span v-if="!hasLiked(currTrack.id)" class="btn-like btn" v-icon="`smallLikeDis`"
                        @click="$emit('likeTrack', currTrack)" title="Add to your liked tracks"></span>
                    <span v-else-if="hasLiked(currTrack.id)" class="btn-dislike btn" v-icon="`smallLikeEna`"
                        @click="$emit('dislikeTrack', currTrack.id)" title="Remove from your liked tracks"></span>
                </section>
                <section class="playback-controls">
                    <button class="shuffle btn" :class="{ 'is-shuffle': isShuffle }" @click="$emit('toggleShuffle')"
                        title="Shuffle">
                        <span v-icon="'shuffle'"></span>
                    </button>
                    <button v-icon="'previous'" class="previous btn" @click="$emit('previousNextVideo', -1)"
                        title="Previous"></button>
                    <button class="play-fs btn" @click="$emit('togglePlayPause')" title="Play">
                        <span v-if="!isPlaying" v-icon="'detailsPlay'"></span>
                        <span v-else v-icon="'detailsPause'"></span>
                    </button>
                    <button v-icon="'next'" class="next btn" @click="$emit('previousNextVideo', 1)" title="Next"></button>
                    <button class="repeat btn" @click="$emit('cycleRepeatStates')" title="Repeat" :class="{
                        'no-repeat': repeatStateIdx === 0,
                        'repeat-playlist': repeatStateIdx === 1,
                        'repeat-song': repeatStateIdx === 2
                    }">
                        <span v-if="this.repeatStateIdx === 2" v-icon="'repeatSong'"></span>
                        <span v-else v-icon="'repeat'"></span>
                    </button>
                </section>
                <section class="volume-controls">
                    <button class="mute btn" @click="$emit('toggleMute')" title="Mute">
                        <span v-if="currVolume >= 66.66" v-icon="'vol1'"></span>
                        <span v-if="currVolume >= 33.33 && currVolume < 66.66" v-icon="'vol2'"></span>
                        <span v-if="currVolume >= 1 && currVolume < 33.33" v-icon="'vol3'"></span>
                        <span v-if="currVolume <= 0" v-icon="'vol4'"></span>
                    </button>
                    <input class="vol-slider slider" @input="emitChangeVolume" type="range" min="0" max="100"
                        :value="currVolume"
                        :style="{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0) ${currVolume}%, rgb(77,77,77) ${currVolume}%)` }">
                    <span v-icon="`fullScreen`" class="fullscreen-btn btn" @click="$emit('closeFullscreen')"
                        title="Full screen"></span>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
import { utilService } from '../services/util.service'
import { stationService } from '../services/station.service'
export default {
    name: 'FullscreenPlayer',
    props: {
        playbackProgressPercentage: Number,
        repeatStateIdx: Number,
        currTrackDuration: Number,
        elapsedTime: Number,
        currTrackDuration: Number,
        currVolume: Number,
        isShuffle: Boolean,
        secsToTimeFormat: Function,
        hasLiked: Function,
    },
    created() {
        let opacityTimeout
        this.mouseMoveHandler = () => {
            const playerDiv = this.$refs.playerControls
            playerDiv.style.transition = 'none'
            playerDiv.style.opacity = '1'
            clearTimeout(opacityTimeout)
            opacityTimeout = setTimeout(() => {
                playerDiv.style.transition = 'opacity .3s'
                playerDiv.style.opacity = '0'
            }, 2000)
        }
        window.document.addEventListener('mousemove', this.mouseMoveHandler)
    },
    methods: {
        emitChangeTime(ev) {
            this.$emit('changeTime', ev.target.value)
        },
        emitChangeVolume(ev) {
            this.$emit('changeVolume', ev.target.value)
        },
        async setBackgroundClr() {
            const elFullscreen = this.$refs.fullscreenPlayer
            const elImg = this.$refs.trackImg
            try {
                const avgColor = await utilService.getAvgImgClr(elImg)
                const [darkerColor] = utilService.generateColors(avgColor)
                elFullscreen.style.backgroundImage = `linear-gradient(to bottom, ${avgColor} 0%, ${darkerColor})`
            }
            catch (err) {
                console.log(err.message)
            }
        },
    },
    unmounted() {
        window.document.removeEventListener('mousemove', this.mouseMoveHandler)
    },
    computed: {
        stationType() {
            if (this.currStation?.isArtist) return 'Artist'
            return this.currStation?.isAlbum ? 'Album' : 'Playlist'
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
        nextTrack() {
            return this.$store.getters.currStation?.tracks[this.currTrackIdx + 1]
        },
    },
}
</script>