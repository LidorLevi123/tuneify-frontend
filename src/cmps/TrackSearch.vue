<template>
    <section class="track-search-container">
        <section class="track-search" v-if="modalOpen">
            <div>
                <h1>Let's find something for your playlist</h1>
                <div class="track-search-input">
                    <span class="df ai" v-icon="`sSearch`"></span>
                    <input type="text" v-model="query" placeholder="Search for songs or episodes">
                    <div v-if="query">
                        <span class="df ai" v-icon="'close'" @click="onClearFilter"></span>
                    </div>
                </div>
            </div>
            <button @click="toggleModal" class="close-btn" v-icon="`bClose`"></button>
        </section>
        <button v-else @click="toggleModal" class="find-btn">Find more</button>
        <SearchList :tracks="tracks" v-if="modalOpen" :station="station" @track-add="onAddTrack" />
        <section v-if="station.tracks.length && !modalOpen && recommendationsStation" class="recommendations">
            <div class="recommendations-header">
                <h1>Recommended</h1>
                <span>Based on what's in this playlist</span>
            </div>
            <SearchList :tracks="tracksToDisplay" :station="station" @track-add="onAddTrack" :fromRecommendations="true" />
            <button @click="cycleRecommendations" class="find-btn refresh-btn">Refresh</button>
        </section>
    </section>
</template>

<script>
import { eventBus } from '../services/event-bus.service'
import { utilService } from '../services/util.service'
import SearchList from './SearchList.vue'

export default {
    name: 'TrackSearch',
    props: {
        station: { type: Object },
    },
    data() {
        return {
            query: '',
            modalOpen: true,
            scrollDown: false,
            currPage: 0
        }
    },
    computed: {
        tracks() {
            return this.$store.getters.searchRes.tracks
        },
        recommendationsStation() {
            return this.$store.getters.recommendationsStation
        },
        tracksToDisplay() {
            const start = this.currPage * 10
            const end = start + 10
            return this.recommendationsStation.tracks.slice(start, end)
        },
    },
    created() {
        this.getRecommendations()

        this.search = utilService.debounce(() => {
            this.$emit('search', this.query)
            if (!this.scrollDown && this.query && window.innerWidth > 890) {
                setTimeout(this.scrollToResults, 500)
                this.scrollDown = true
            }
        }, 500)
    },
    methods: {
        onClearFilter() {
            this.query = ''
        },
        toggleModal() {
            this.modalOpen = !this.modalOpen
        },
        onAddTrack(track, stationId) {
            this.$emit('track-add', track, stationId)
        },
        scrollToResults() {
            eventBus.emit('scrollDown')
        },
        getRecommendations() {
            if (this.station.tracks.length) {
                this.modalOpen = false
                console.log('gettin Recommendations')
                this.$emit('getRecommendations')
            }
        },
        cycleRecommendations() {
            this.currPage = (this.currPage + 1) % 10
        }
    },
    watch: {
        query: {
            handler() {
                this.search()
                if (!this.query) this.scrollDown = false
            },
            deep: true,
        },
        'station': {
            handler(oldStation, newStation) {
                if (oldStation._id !== newStation._id) this.getRecommendations()
            },
            deep: true,
        }
    },
    components: {
        SearchList,
    },
}
</script>