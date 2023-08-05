<template>
    <section class="main-header" :style="{ backgroundColor: this.scrollPosition > 50 ? '#121212' : 'transparent' }">
        <button @click="goBack" v-icon="`navBack`" class="nav-btn" title="Go back"></button>
        <button @click="goNext" v-icon="`navNext`" class="nav-btn" title="Go forward"></button>
        <button v-icon="'mPlay'" v-if="showPlay" class="play-btn-header" @click="playStation(currTrackIdx)"
            :style="{ opacity: this.scrollPosition > 400 ? '1' : '0' }">
        </button>
        <button v-icon="'pause'" v-if="showPause" class="play-btn-header" @click="pauseStation"
            :style="{ opacity: this.scrollPosition > 400 ? '1' : '0' }">
        </button>
        <span v-if="$route.path.startsWith('/station/')" class="station-header"
            :style="{ opacity: this.scrollPosition > 400 ? '1' : '0' }">{{ station?.name }}</span>
        <div v-if="$route.path === '/search'" class="search-input-container">
            <span class="df ai" v-icon="`sSearch`"></span>
            <input type="text" v-model="filterBy.txt" @input="onSetFilterBy" placeholder="What do you want to listen to?">
            <div v-if="filterBy.txt">
                <span class="df ai" v-icon="'close'" @click="onClearFilter"></span>
            </div>
        </div>
        <button v-if="user" @click="doLogout" v-icon="`profile`" class="profile-btn" title="Logout"></button>
        <RouterLink v-if="!user" class="login-link" to="/login">
            <button class="login-btn">Log in</button>
        </RouterLink>
    </section>
</template>

<script>
import historyTracker from '../services/history.service'
import { eventBus } from '../services/event-bus.service'
export default {
    name: 'SearchPage',

    props: {
        station: { type: Object }
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
        async doLogout() {
            this.$router.push('/')
            this.$store.dispatch({ type: 'logout' })
            this.$store.commit({ type: 'loadStations', stations: [] })
        },
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
            trackIdx = trackIdx === -1 ? 0 : trackIdx
            this.$store.commit({ type: 'setCurrTrackIdx', trackIdx })

            if (this.currStation?._id !== this.station._id) {
                const station = JSON.parse(JSON.stringify(this.station))
                this.$store.commit({ type: 'setCurrStation', station })
                this.$store.commit({ type: 'setCurrTrackIdx', trackIdx: 0 })
            }
            eventBus.emit('trackClicked')
            eventBus.emit('trackClicked')
        },
        pauseStation() {
            eventBus.emit('trackPaused')
        },
        goBack() {
            const previousPath = historyTracker.back()
            if (previousPath) {
                this.$router.push(previousPath)
            }
        },
        goNext() {
            const nextPath = historyTracker.next()
            if (nextPath) {
                this.$router.push(nextPath)
            }
        },

    },
    computed: {
        currStation() {
            return this.$store.getters.currStation
        },
        currTrackIdx() {
            return this.$store.getters.currTrackIdx
        },
        isPlaying() {
            return this.$store.getters.isCurrTrackPlaying && this.station._id === this.currStation?._id
        },
        user() {
            return this.$store.getters.loggedinUser
        },
        showPlay() {
            return this.$route.path.startsWith('/station/') && !this.isPlaying
        },
        showPause() {
            return this.$route.path.startsWith('/station/') && this.isPlaying
        }
    }
}
</script>


