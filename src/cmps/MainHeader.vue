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
            <input type="text" v-model="query" placeholder="What do you want to listen to?">
            <div v-if="query">
                <span class="df ai" v-icon="'close'" @click="onClearFilter"></span>
            </div>
        </div>
        <button v-if="user" @click="doLogout" class="profile-btn" title="Logout">
            <img :src="user.imgUrl" alt="">
        </button>
        <RouterLink v-if="!user" class="login-link" to="/login">
            <button class="login-btn">Log in</button>
        </RouterLink>
    </section>
</template>

<script>
import { eventBus } from '../services/event-bus.service'
import { utilService } from '../services/util.service'

import historyTracker from '../services/history.service'
export default {
    name: 'SearchPage',

    props: {
        station: { type: Object }
    },

    data() {
        return {
            query: '',
            scrollPosition: null
        }
    },
    created() {
        eventBus.on('handleScroll', this.logScroll)

        this.search = utilService.debounce(() => {
            eventBus.emit('search', this.query)
        }, 500)
    },
    methods: {
        async doLogout() {
            this.$router.push('/')
            this.$store.dispatch({ type: 'logout' })
            this.$store.commit({ type: 'loadStations', stations: [] })
        },
        onClearFilter() {
            this.query = ''
        },
        logScroll({ scrollTop }) {
            this.scrollPosition = scrollTop
        },
        playStation(trackIdx) {
            trackIdx = trackIdx === -1 ? 0 : trackIdx
            if (this.currStation?._id !== this.station._id) {
                this.$store.commit({ type: 'setCurrStation', station: this.station })
            }
            this.$store.commit({ type: 'setCurrTrackIdx', trackIdx })
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
            return this.$store.getters.isCurrTrackPlaying
        },
        user() {
            console.log(this.$store.getters.loggedinUser);
            return this.$store.getters.loggedinUser
        },
        showPlay() {
            return this.$route.path.startsWith('/station/') && !this.isPlaying
        },
        showPause() {
            return this.$route.path.startsWith('/station/') && this.isPlaying
        }
    },

    watch: {
        query: {
            handler() {
                this.search()
            },
        },
    },
}
</script>


