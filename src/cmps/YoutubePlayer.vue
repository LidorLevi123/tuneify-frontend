<template>
    <YouTube
        :src="videoUrl"
        @ready="onReady"
        @playing="onPlaying"
        @paused="onPaused"
        ref="youtube" />
</template>

<script>
import YouTube from 'vue3-youtube'

export default {
    props: {
        videoUrl: { type: String}
    },
    data() {
        return {
        }
    },
    components: {
        YouTube,
    },
    methods: {
        onReady() {
        },
        onPlaying() {
            this.$emit('play')
        },
        onPaused() {
            this.$emit('pause')
        },
    },
}
</script>