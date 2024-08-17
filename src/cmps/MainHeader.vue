<template>
    <section class="main-header" :style="{ backgroundColor: headerBgColor }">
        <TopTen v-if="showTopTen" @closeTopTen="showTopTen = false" />

        <div class="main-header-container">
            <div class="header-l">
                <div class="nav-btns">
                    <button @click="goBack" v-icon="`navBack`" class="nav-btn" title="Go back"></button>
                    <button @click="goNext" v-icon="`navNext`" class="nav-btn" title="Go forward"></button>
                </div>
                <button v-icon="'mPlay'" v-if="showPlay" class="play-btn-header" @click="playStation(currTrackIdx)"
                    :style="{ opacity: this.scrollPosition > 400 ? '1' : '0' }">
                </button>
                <button v-icon="'pause'" v-if="showPause" class="play-btn-header" @click="pauseStation"
                    :style="{ opacity: this.scrollPosition > 400 ? '1' : '0' }">
                </button>
                <span v-if="showName" class="station-header"
                    :style="{ opacity: this.scrollPosition > 400 ? '1' : '0' }">{{
                        station?.name }}</span>
                <div v-if="$route.path === '/search'" class="search-input-container">
                    <span class="df ai" v-icon="`sSearch`"></span>
                    <input type="text" v-model="query" :placeholder="placeholderText">
                    <div v-if="query">
                        <span class="df ai" v-icon="'close'" @click="onClearFilter"></span>
                    </div>
                </div>
            </div>

            <div>
                <div v-if="showUserMenu" class="dropdown" v-clickOutside="handleClickOutsideUser">
                    <div @click="editProfile" class="menu-li">Edit profile</div>
                    <div @click="doLogout" class="menu-li">Log out</div>
                </div>

                <div v-if="showMarketsMenu" class="dropdown markets-dropdown"
                    v-clickOutside="handleClickOutsideMarkets">
                    <ul class="clean-list markets-list">
                        <li @click="changeMarket(market)" v-for="market in markets" :key="market.id" :title="market">
                            <img onload="this.style.opacity = '1'" :src="getFlagImageUrl(market)" alt="">
                        </li>
                    </ul>
                </div>

                <div class="profile-btns">
                    <RouterLink v-if="user?.isAdmin" class="admin-link" to="/admin">
                        <button class="admin-btn">Admin page</button>
                    </RouterLink>

                    <button v-icon="'fullScreen'" v-if="currStation && windowWidth < 890" @click="emitFullScreen"
                        class="profile-btn market-btn">
                    </button>

                    <button v-icon="'topTen'" @click="toggleTopTen"
                        class="profile-btn market-btn" title="Top 10" style="padding: 0 1px;">
                    </button>

                    <button v-if="user && this.$route.path === '/'" @click="openMarketsMenu"
                        class="profile-btn market-btn" :title="`${currMarket}`">
                        <img :src="`https://www.worldatlas.com/r/w236/img/flag/${currMarket.toLowerCase()}-flag.jpg`"
                            alt="">
                    </button>

                    <button v-if="user" @click="openUserMenu" class="profile-btn" :title="`${user.fullname}`">
                        <img :src="user.imgUrl" :alt="user.imgUrl">
                    </button>

                    <RouterLink v-if="!user" class="login-link" to="/login">
                        <button class="login-btn">Log in</button>
                    </RouterLink>

                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { eventBus } from '../services/event-bus.service'
import { utilService } from '../services/util.service'
import TopTen from './TopTen.vue'
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
            showUserMenu: false,
            showMarketsMenu: false,
            windowWidth: window.innerWidth,
            showTopTen: false
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
        emitFullScreen() {
            eventBus.emit('fullscreen')
        },
        changeMarket(market) {
            if (market !== this.currMarket) this.$store.dispatch({ type: 'getStationsForHome', market })
            this.showMarketsMenu = false
        },
        handleClickOutsideUser() {
            this.showUserMenu = false
        },
        handleClickOutsideMarkets() {
            this.showMarketsMenu = false
        },
        openUserMenu() {
            this.showUserMenu = true
        },
        openMarketsMenu() {
            this.showMarketsMenu = true
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
        },
        toggleTopTen() {
            this.showTopTen = !this.showTopTen
            document.body.classList.add('tt-modal-open')
        }
    },
    computed: {
        currStation() {
            return this.$store.getters.currStation
        },
        currMarket() {
            return this.$store.getters.currMarket
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
        },
        markets() {
            return utilService.getCountryCodes()
        },
        getFlagImageUrl() {
            return (market) => {
                if (market === 'CH') return 'https://www.worldatlas.com/r/w236/img/flag/ch-flag.png'
                else return `https://www.worldatlas.com/r/w236/img/flag/${market.toLowerCase()}-flag.jpg`
            }
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
    components: {
        TopTen
    }
}
</script>