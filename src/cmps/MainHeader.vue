<template>
    <section class="main-header" :style="{ backgroundColor: headerBgColor }">
        <button @click="goBack" v-icon="`navBack`" class="nav-btn" title="Go back"></button>
        <button @click="goNext" v-icon="`navNext`" class="nav-btn" title="Go forward"></button>
        <button v-icon="'mPlay'" v-if="showPlay" class="play-btn-header" @click="playStation(currTrackIdx)"
            :style="{ opacity: this.scrollPosition > 400 ? '1' : '0' }">
        </button>
        <button v-icon="'pause'" v-if="showPause" class="play-btn-header" @click="pauseStation"
            :style="{ opacity: this.scrollPosition > 400 ? '1' : '0' }">
        </button>
        <span v-if="showName" class="station-header" :style="{ opacity: this.scrollPosition > 400 ? '1' : '0' }">{{
            station?.name }}</span>
        <div v-if="$route.path === '/search'" class="search-input-container">
            <span class="df ai" v-icon="`sSearch`"></span>
            <input type="text" v-model="query" :placeholder="placeholderText">
            <div v-if="query">
                <span class="df ai" v-icon="'close'" @click="onClearFilter"></span>
            </div>
        </div>
        <div v-if="showUserMenu" class="dropdown" v-clickOutside="handleClickOutside">
            <div @click="editProfile" class="menu-li">Edit profile</div>
            <div @click="doLogout" class="menu-li">Log out</div>
        </div>
        <div class="profile-btns">
            <RouterLink v-if="user?.isAdmin" class="admin-link" to="/admin">
                <button class="admin-btn">Admin page</button>
            </RouterLink>

            <button v-if="user" @click="openUserMenu" class="profile-btn" :title="`${user.fullname}`">
                <img :src="user.imgUrl" :alt="user.imgUrl">
            </button>

            <RouterLink v-if="!user" class="login-link" to="/login">
                <button class="login-btn">Log in</button>
            </RouterLink>
        </div>
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
            scrollPosition: null,
            backgroundColor: '#121212',
            showUserMenu: false
        }
    },
    created() {
        eventBus.on('handleScroll', this.logScroll)
        eventBus.on('backgroundColor', this.setBackgroundClr)

        this.search = utilService.debounce(() => {
            eventBus.emit('search', this.query)
        }, 500)
    },
    methods: {
        handleClickOutside() {
            this.showUserMenu = false
        },
        openUserMenu() {
            this.showUserMenu = true
        },
        doLogout() {
            this.$router.push('/')
            this.$store.dispatch({ type: 'logout' })
            this.$store.commit({ type: 'loadUserStations', stations: [] })
            this.showUserMenu = false
        },
        onClearFilter() {
            this.query = ''
        },
        logScroll({ scrollTop }) {
            this.scrollPosition = scrollTop
        },
        setBackgroundClr(color) {
            this.backgroundColor = color
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
        editProfile() {
            document.body.classList.add('ue-modal-open')
            this.showUserMenu = false
        }
    },
    computed: {
        currStation() {
            return this.$store.getters.currStation
        },
        currTrackIdx() {
            return this.$store.getters.currTrackIdx
        },
        isPlaying() {
            return this.$store.getters.isCurrTrackPlaying && this.station?._id === this.currStation?._id
        },
        user() {
            return this.$store.getters.loggedinUser
        },
        showName() {
            return this.$route.path.startsWith('/station/') || this.station?.isAlbum || this.station?.isArtist
        },
        showPlay() {
            return (this.$route.path.startsWith('/station/') || this.station?.isAlbum || this.station?.isArtist) && !this.isPlaying
        },
        showPause() {
            return (this.$route.path.startsWith('/station/') || this.station?.isAlbum || this.station?.isArtist) && this.isPlaying
        },
        headerBgColor() {
            if (this.$route.path.startsWith('/station/')) return this.scrollPosition > 325 ? this.backgroundColor : 'transparent'
            else if (this.$route.path.startsWith('/search/')) return this.scrollPosition > 50 ? '#121212' : 'transparent'
            else return this.scrollPosition > 50 ? this.backgroundColor : 'transparent'
        },
        placeholderText() {
            return window.innerWidth > 890 ? 'What do you want to listen to?' : 'Search'
        }
    },
    beforeUnmount() {
        eventBus.off('handleScroll', this.logScroll)
        eventBus.off('backgroundColor', this.setBackgroundClr)
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