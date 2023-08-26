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
        <button v-if="!modalOpen" @click="toggleModal" class="find-btn">Find more</button>
        <SearchList :tracks="tracks" v-if="modalOpen" :station="station" @track-add="onAddTrack" />
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
            modalOpen: true
        }
    },

    computed: {
        tracks() {
            return this.$store.getters.searchRes.tracks
        }
    },

    created() {
        this.search = utilService.debounce(() => {
            this.$emit('search', this.query)
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
        }


    },

    watch: {
        query: {
            handler() {
                this.search()
                this.scrollToResults()
            },
            deep: true,
        },
    },
    components: {
        SearchList,
    },
}
</script>