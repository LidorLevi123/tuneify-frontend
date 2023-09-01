<template>
    <section ref="lyricsContainer" class="lyrics-container" :style="{ backgroundColor: bgColor }">
        <h1 v-if="!lyrics">Looking for lyrics...</h1>
        <h1 v-else class="lyrics">{{ lyrics }}</h1>
    </section>
</template>

<script>
import historyTracker from '../services/history.service'
import { eventBus } from '../services/event-bus.service'
import { lyricsService } from '../services/lyrics.service'
import { utilService } from '../services/util.service'

export default {
    name: 'LyricsPage',

    data() {
        return {
            lyrics: '',
            bgColor: ''
        }
    },
    created() {
        if (!this.currTrack) this.$router.push(`/`)
        historyTracker.push(this.$route.fullPath)
        eventBus.emit('backgroundColor', this.bgColor)
    },
    methods: {
        async getLyrics() {
            if (!this.currTrack.lyrics) {
                console.log('fetching lyrics from api')
                try {
                    const res = await lyricsService.getLyrics(this.currTrackName)
                    this.$store.dispatch('updateTrack', { lyrics: res })
                    res === '' ? this.lyrics = 'No lyrics found' : this.lyrics = res
                } catch (error) {
                    console.error('Error fetching lyrics:', error)
                }
            } else {
                console.log('got lyrics from storage')
                this.lyrics = this.currTrack.lyrics
            }
        },
        async setBackgroundClr() {
            const elImg = this.currTrack?.imgUrl
            const color = await utilService.getAvgImgClr(elImg)
            this.bgColor = color
        },
    },
    computed: {
        currTrack() {
            return this.$store.getters?.currTrack
        },
        currTrackName() {
            const artist = this.$store.getters.currTrack?.artists[0]
            const title = this.$store.getters.currTrack?.title
            return `${artist} ${title}`
        }
    },
    watch: {
        currTrackName: {
            immediate: true,
            handler(newTrackName, oldTrackName) {
                if (newTrackName !== oldTrackName) {
                    this.lyrics = null
                    this.getLyrics()
                    this.setBackgroundClr()
                }
            }
        }
    },
}
</script>
