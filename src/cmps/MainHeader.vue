<template>
    <section class="main-header" :style="{ backgroundColor: this.scrollPosition > 50 ? '#121212' : 'transparent' }">
        <button v-icon="`navBack`" class="nav-btn" title="Go back"></button>
        <button v-icon="`navNext`" class="nav-btn" title="Go forward"></button>
        <button v-icon="'play'" v-if="$route.path.startsWith('/station/') && !isPlaying" class="play-btn-header" @click="playStation(0)"
            :style="{ opacity: this.scrollPosition > 50 ? '1' : '0' }">
        </button>
        <button v-icon="'pause'" v-else class="play-btn-header" @click="playStation(0)"
            :style="{ opacity: this.scrollPosition > 50 ? '1' : '0' }">
        </button>
        <span v-if="$route.path.startsWith('/station/')" class="station-header"
            :style="{ opacity: this.scrollPosition > 50 ? '1' : '0' }">{{ currStation?.name }}</span>
        <div v-if="$route.path === '/search'" class="search-input-container">
            <span class="material-symbols-outlined">search</span>
            <input type="text" v-model="filterBy.txt" @input="onSetFilterBy" placeholder="What do you want to listen to?">
            <div v-if="filterBy.txt">
                <span class="material-symbols-outlined search-clear" @click="onClearFilter"> close </span>
            </div>
        </div>
        <button v-icon="`profile`" class=" profile-btn" title="Logout"></button>
        <RouterLink to="/login">
            <button class="login-btn">Log in</button>
        </RouterLink>
    </section>
</template>

<script>
import { eventBus } from '../services/event-bus.service'
export default {
    name: 'SearchPage',

    props: {
        davar: { type: Object }
    },

    data() {
        return {
            filterBy: {
                txt: '',
            },
            scrollPosition: null
        }
    },
    created() {
        eventBus.on('handleScroll', this.logScroll)

    },
    methods: {
        onSetFilterBy() {
            console.log(this.filterBy)
            this.$emit('filter', this.filterBy)
        },
        onClearFilter() {
            this.filterBy.txt = ''
        },
        logScroll({ scrollTop }) {
            this.scrollPosition = scrollTop
        },
        playStation(trackIdx) {
            this.$store.commit({ type: 'setCurrTrackIdx', trackIdx })
            eventBus.emit('trackClicked')
        }

    },
    computed: {
        currStation() {
            return this.$store.getters.currStation
        },
        isPlaying() {
            return this.$store.getters.isCurrTrackPlaying
        }
    }
}
</script>


