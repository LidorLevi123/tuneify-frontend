<template>
    <section class="track-search-container">
        <section class="track-search" v-if="modalOpen">
            <div>
                <h1>Let's find something for your playlist</h1>
                <div class="track-search-input">
                    <span class="df ai" v-icon="`sSearch`"></span>
                    <input type="text" v-model="query"
                        placeholder="Search for songs or episodes">
                    <div v-if="query">
                        <span class="df ai" v-icon="'close'" @click="onClearFilter"></span>
                    </div>
                </div>
            </div>
            <button @click="toggleModal" class="close-btn" v-icon="`bClose`"></button>
        </section>
        <button v-if="!modalOpen" @click="toggleModal" class="find-btn">Find more</button>

        <pre v-show="tracks.length" style="color: white;"> {{ tracks }} </pre>
    </section>
</template>

<script>
import { utilService } from '../services/util.service'

export default {
    name: 'TrackSearch',

    data() {
        return {
            query: '',
            modalOpen: true
        }
    },

    computed: {
        tracks() {
            return this.$store.getters.tracks
        }
    },

    created() {
        this.search = utilService.debounce(() => {
            this.$emit('search', this.query)
        }, 700)
    },

    methods: {
        onClearFilter() {
            this.query = ''
        },
        toggleModal() {
            this.modalOpen = !this.modalOpen
        }
    },

    watch: {
        query: {
            handler() {
                this.search()
            },
            deep: true,
        },
    },
}
</script>