<template>
    <section v-if="this.isRsbOpen && this.currTrack" class="rsb-main-container">
        <header class="rsb-header">
            <RouterLink :to="`/station/${currStation._id}`">{{ currStation.name }}</RouterLink>
            <button v-icon="`close`" @click="closeRSB" class="closeRSB-btn"></button>
        </header>
        <img class="track-img" :src="currTrack.imgUrl" alt="">
        <section class="track-info">
            <h1>{{ currTrack.title }}</h1>
            <h4>{{ currTrack.artists[0] }}</h4>
        </section>
        <section v-if="this.nextTrack" class="next-track">
            <header>Next in queue</header>
            <section class="next-track-info" @click="emitToNextTrack" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
                <button class="next-track-btn">
                    <span v-if="this.nextTrackHovered" v-icon="`sPlay`" class="rsb-play"></span>
                    <span v-else v-icon="`note`"></span>
                </button>
                <img :src="nextTrack.imgUrl" alt="">
                <section>
                    <span class="next-track-name">{{ nextTrack.title }}</span>
                    <span class="next-track-artist">{{ nextTrack.artists[0] }}</span>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
import { eventBus } from '../services/event-bus.service'

export default {
    name: 'RightSidebar',
    data() {
        return {
            nextTrackHovered: false
        }
    },
    created() {
        eventBus.on('toggleRSB', () => this.toggleRSB())

    },
    methods: {
        onMouseOver() { this.nextTrackHovered = true },
        onMouseLeave() { this.nextTrackHovered = false },
        emitToNextTrack() { eventBus.emit('playNextTrack') },
        closeRSB() { this.$store.commit('toggleRsb') }
    },
    computed: {
        currTrack() {
            return this.$store.getters.currTrack
        },
        currStation() {
            return this.$store.getters.currStation
        },
        currTrackIdx() {
            return this.$store.getters.currTrackIdx
        },
        nextTrack() {
            return this.$store.getters.currStation.tracks[this.$store.getters.currTrackIdx + 1]
        },
        isRsbOpen() {
            return this.$store.getters.isRsbOpen
        }
    }

}
</script>

