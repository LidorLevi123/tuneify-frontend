<template>
    <section v-if="currTrack" class="rsb-main-container">
        <header class="rsb-header">
            <RouterLink :to="`/station/${currStation._id}`">{{ currStation.name }}</RouterLink>
            <button v-icon="`close`" @click="closeRSB" class="closeRSB-btn"></button>
        </header>
        <img class="track-img" :src="currTrack.imgUrl" alt="">
        <section class="track-info">
            <h1>{{ currTrack.title }}</h1>
            <h4 v-for="(artist, idx) in currTrack.artists" :key="idx">{{ artist }} <span
                    v-if="idx < currTrack.artists.length - 1">, </span></h4>
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
        <section v-if="artistImage" class="artist-meta" @click="openBio">
            <h4>About the artist</h4>
            <img :src="this.artistImage" alt="">
            <section v-if="artistSnippet" class="mini-bio-container">
                <section v-html="artistSnippet" class="mini-bio"></section>
            </section>
        </section>
    </section>
    <ArtistData v-if="artistBioOpen" :artistSnippet="artistSnippet" :artistImage="artistImage" @closeBio="closeBio" />
</template>

<script>
import { eventBus } from '../services/event-bus.service'
import { wikiService } from '../services/wiki.service'
import { mapGetters } from 'vuex';
import ArtistData from './ArtistData.vue';

export default {
    name: 'RightSidebar',
    data() {
        return {
            nextTrackHovered: false,
            artistImage: null,
            artistSnippet: null,
            artistBioOpen: false
        }
    },
    created() {
        eventBus.on('toggleRSB', () => this.toggleRSB())
    },
    methods: {
        onMouseOver() { this.nextTrackHovered = true },
        onMouseLeave() { this.nextTrackHovered = false },
        emitToNextTrack() { eventBus.emit('playNextTrack') },
        closeRSB() { this.$store.commit('toggleRsb') },
        openBio() {
            this.artistBioOpen = true
            document.body.classList.add('ad-modal-open')
        },
        closeBio() {
            this.artistBioOpen = false
            document.body.classList.remove('ad-modal-open')
        },
        async getArtistData(artist) {
            const metaData = await wikiService.getArtistData(artist)
            this.artistImage = metaData.artistImage
            this.artistSnippet = metaData.artistSnippet
        }
    },
    computed: {
        ...mapGetters([
            'currTrack',
            'currStation',
            'currTrackIdx',
            'isRsbOpen'
        ]),
        nextTrack() {
            return this.$store.getters.currStation.tracks[this.$store.getters.currTrackIdx + 1]
        },
    },
    unmounted() {
        eventBus.off('toggleRSB', () => this.toggleRSB())
    },
    watch: {
        currTrack: {
            immediate: true,
            handler(newTrackName, oldTrackName) {
                if (newTrackName !== oldTrackName) {
                    this.getArtistData(this.currTrack.artists[0])
                }
            }
        }
    },
    components: {
        ArtistData
    }
}

</script>

