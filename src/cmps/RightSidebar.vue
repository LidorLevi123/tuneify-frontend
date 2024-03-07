<template>
    <section v-if="currTrack" class="rsb-main-container">
        <header class="rsb-header">
            <RouterLink :to="`/station/${currStation._id}`">{{ currStation.name }}</RouterLink>
            <button v-icon="`close`" @click="closeRSB" class="closeRSB-btn"></button>
        </header>
        <img class="track-img" :src="currTrack.imgUrl[0].url" alt="">
        <section class="track-info">
            <h1>{{ currTrack.title }}</h1>
            <h4 v-for="(artist, idx) in currTrack.artists" :key="idx">
                <RouterLink :to="`/artist/${artist.spotifyId}`" @click.stop>{{ artist.name }}</RouterLink>
                <span v-if="idx < currTrack.artists.length - 1">, </span>
            </h4>
        </section>
        <section v-if="this.nextTrack" class="next-track">
            <header>Next in queue</header>
            <section class="next-track-info" @click="emitToNextTrack" @mouseover="onMouseOver"
                @mouseleave="onMouseLeave">
                <button class="next-track-btn">
                    <span v-if="this.nextTrackHovered" v-icon="`sPlay`" class="rsb-play"></span>
                    <span v-else v-icon="`note`"></span>
                </button>
                <img :src="nextTrack.imgUrl[2].url" alt="">
                <section>
                    <span class="next-track-name">{{ nextTrack.title }}</span>
                    <span v-for="(artist, idx) in nextTrack.artists" :key="idx" class="next-track-artist">
                        <RouterLink :to="`/artist/${artist.spotifyId}`" @click.stop>
                            {{ artist.name }}
                        </RouterLink>
                        <span v-if="idx < nextTrack.artists.length - 1">, </span>
                    </span>
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
        <ul v-if="artistEvents" class="artist-events clean-list">
            <h4>On Tour</h4>
            <a :href="event.url" v-for="event in artistEvents" :key="event.id" target="_blank">
                <li class="event">
                    <div class="date">
                        <span class="month">{{ event.month }}</span>
                        <span class="day">{{ event.day }}</span>
                    </div>
                    <div class="event-info">
                        <h3>{{ event.city }}</h3>
                        <p>{{ event.artist }}</p>
                        <div>{{ event.weekday }} {{ event.time }}
                            <span v-if="event.venue">&bull;</span>
                            {{ event.venue }}
                        </div>
                    </div>
                </li>
            </a>
        </ul>
    </section>
    <ArtistData v-if="artistBioOpen" :artistSnippet="artistSnippet" :artistImage="artistImage"
        :artistFollowers="artistFollowers" :artistSocials="artistSocials" @closeBio="closeBio" />
</template>

<script>
import { eventBus } from '../services/event-bus.service'
import { wikiService } from '../services/wiki.service'
import { mapGetters } from 'vuex'
import ArtistData from './ArtistData.vue'
import { stationService } from '../services/station.service'
import { eventsService } from '../services/events.service'

export default {
    name: 'RightSidebar',
    data() {
        return {
            nextTrackHovered: false,
            artistImage: null,
            artistSnippet: null,
            artistFollowers: null,
            artistEvents: null,
            artistBioOpen: false,
            artistSocials: null
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
        async getArtistData(artist, artistId) {

            const metaData = await wikiService.getArtistData(artist)
            this.artistSnippet = metaData

            const { imgUrl, followers } = await stationService.getArtistData(artistId, true)
            this.artistImage = imgUrl
            this.artistFollowers = followers

            const { events, socials } = await eventsService.getEventsAndSocials(artist)
            this.artistEvents = events
            this.artistSocials = socials
        },
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
                    this.artistImage = null
                    this.artistEvents = null
                    this.getArtistData(this.currTrack.artists[0].name, this.currTrack.artistId)
                }
            }
        }
    },
    components: {
        ArtistData
    }
}

</script>
