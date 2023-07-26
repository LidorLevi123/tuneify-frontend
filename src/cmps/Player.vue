<template>

    <YouTube ref="youtubePlayer"
        :src="getVideoIdFromUrl(currentTrack.videoUrl)"
        @ready="onPlayerReady"></YouTube>


    <section class="main-player-container">
        <section class="player-main-controls">
            <button class="play btn" @click="playVideo">Play</button>
            <button class="pause btn" @click="pauseVideo">Pause</button>
            <button class="stop btn" @click="stopVideo">Stop</button>
            <button class="next btn" @click="nextVideo">Next</button>
            <button class="previous btn" @click="previouspVideo">Back</button>
        </section>
    </section>
</template>


<script>

import YouTube from 'vue3-youtube'

export default {
    data() {
        return {
            currentTrack: {
                videoUrl: 'https://www.youtube.com/watch?v=F1B9Fk_SgI0&ab_channel=ChildishGambinoVEVO',
            },
            isPlaying: false,
            player: null
        }
    },
    components: {
        YouTube,
    },
    created() {
    },
    methods: {
        onYouTubeIframeAPIReady() {
            console.log('onYouTubeIframeAPIReady')
            this.player = new YT.Player('youtube-player', {
                height: '390',
                width: '640',
                videoId: this.getVideoIdFromUrl(this.currentTrack.videoUrl),
                playerVars: {
                    'playsinline': 1,
                },
                events: {
                    'onReady': this.onPlayerReady,
                    'onStateChange': this.onPlayerStateChange,
                },
            })
        },
        getVideoIdFromUrl(url) {
            const videoIdRegex = /[?&]v=([^&]+)/;
            const match = url.match(videoIdRegex);
            return match ? match[1] : null;
        },

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
        onPlayerReady(event) {
            console.log('onPlayerReady')
            console.log('ev', event)
            this.player = event.target
            event.target.playVideo()
        },
    },
}
</script>