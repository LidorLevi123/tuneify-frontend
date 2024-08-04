<template>
    <section ref="stationDetails" class="station-details" v-if="station">
        <div ref="topGradient" class="top-gradient">
            <section class="img-photo new-layout" :style="{ alignItems: station.isArtist ? 'center' : 'end' }">
                <StationImg :station="station" @backgroundColor="setBgColor" />
                <section class="station-info">
                    <span v-if="!station.isArtist" class="pl">{{ stationType }}</span>
                    <span v-if="station.isArtist" class="verified">
                        <span v-icon="`verified`"></span>
                        <span>Verified Artist</span>
                    </span>
                    <h1 @click="openStationEditor" :class="{ 'user-editable': userStations }">{{ station.name }}
                    </h1>
                    <span v-if="station.isArtist" class="followers">
                        {{ station.followers.toLocaleString("en-US") }} Followers
                    </span>
                    <p class="description">{{ station.description }}</p>
                    <div v-if="!station.isArtist">
                        <img v-if="ownerImg" :src="ownerImg" alt="">
                        <RouterLink v-if="station.isAlbum" :to="`/artist/${this.artist?.spotifyId}`">
                            <span class="logo artist">{{ stationOwner }}</span>
                        </RouterLink>
                        <span v-else class="logo">{{ stationOwner }}</span>
                        <span v-if="station.isAlbum" class="logo">&bull; {{ this.station.releaseDate?.substr(0, 4)
                            }}</span>
                        <span class="songs-num" v-if="station.tracks">&bull; {{ station.tracks?.length }}
                            songs</span>
                        <span class="songs-time" v-show="formattedTime">{{ formattedTime }}</span>
                    </div>
                </section>
            </section>
        </div>
        <div ref="botGradient" class="bottom-gradient">
            <div class="new-layout">
                <section class="details-player">

                    <button v-if="!isPlaying" class="details-play" v-icon="'detailsPlay'" v-show="hasTracks"
                        @click="clickTrack(currTrackIdx)" title="Play">
                    </button>

                    <button v-else class="details-play" v-icon="'detailsPause'" v-show="hasTracks" @click="pauseTrack"
                        title="Pause">
                    </button>

                    <button class="details-like" v-icon="'like'" v-show="!hasLiked && !isOwner"
                        @click="likeDislikeStation('add')">
                    </button>

                    <button class="details-unlike" v-icon="'unlike'" v-show="hasLiked && !isOwner"
                        @click="likeDislikeStation('remove')">
                    </button>

                    <span v-if="this.station.tracks.length" class="material-symbols-outlined df ai share"
                        :class="{ 'enabled': !isShare, 'user-station': isOwner }" @click="activateShare(isShare)"
                        title="Listen With Friends">group_add
                    </span>

                    <div class="bubbling-heart" v-show="hasLiked && !isOwner">
                        <input type="checkbox" @click="likeDislikeStation('remove')" class="heart-input"
                            id="like-undefined">
                        <label class="label" for="like-undefined"><span v-icon="`bHearts`"></span></label>
                    </div>
                    <UserList v-show="!isShare" :users="topicUsers" />
                </section>
                <TrackList @track-clicked="clickTrack" @track-add="addTrack" @track-remove="removeTrack"
                    @track-dislike="dislikeTrack" @station-update="loadStation" @search="getSearchRes"
                    @getRecommendations="getRecommendations" :station="station" />
                <section class="artist-discography" v-if="station.isArtist">
                    <h1 class="title">Discography</h1>
                    <section class="filter-btns">
                        <button v-if="showBtn('all')" class="filter btn" :class="{ 'active': !filterBy }"
                            @click="setFilterBy(null)">All</button>
                        <button v-if="showBtn('album')" class="filter btn" :class="{ 'active': filterBy === 'album' }"
                            @click="setFilterBy('album')">Albums</button>
                        <button v-if="showBtn('single')" class="filter btn" :class="{ 'active': filterBy === 'single' }"
                            @click="setFilterBy('single')">Singles & EPs</button>
                        <button v-if="showBtn('compilation')" class="filter btn"
                            :class="{ 'active': filterBy === 'compilation' }"
                            @click="setFilterBy('compilation')">Compilations</button>
                    </section>
                    <StationList :stations="artistAlbums" />
                </section>
                <section class="artist-discography" v-if="station.isArtist && artistAppearOn?.length">
                    <h1 class="title">Appears On</h1>
                    <StationList :stations="artistAppearOn" />
                </section>
                <section class="related-artists" v-if="station.isArtist">
                    <h1 class="title">Fans also like</h1>
                    <StationList :stations="station.relatedArtists" />
                </section>
            </div>
        </div>
        <StationEdit @station-edit="loadStation" v-if="isOwner" />
    </section>
    <section v-else>
        <Loader />
    </section>
</template>

<script>
import Loader from '../cmps/Loader.vue'
import historyTracker from '../services/history.service'
import StationEdit from '../cmps/StationEdit.vue'
import TrackList from '../cmps/TrackList.vue'
import StationList from '../cmps/StationList.vue'
import UserList from '../cmps/UserList.vue'
import StationImg from '../cmps/StationImg.vue'
import { stationService } from '../services/station.service'
import { userService } from '../services/user.service'
import { eventBus, showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

import {
    SOCKET_EMIT_SET_TOPIC,
    SOCKET_EMIT_LEAVE_TOPIC,
    SOCKET_EMIT_GET_TOPIC_USERS,
    SOCKET_EVENT_SET_TOPIC_USERS,
    socketService
} from '../services/socket.service.js'


export default {
    name: 'StationDetails',
    data() {
        return {
            station: null,
            isShare: true,
            topicUsers: [],
            artist: null,
            artistAlbums: null,
            artistAppearOn: null,
            filterBy: null,
        }
    },
    computed: {
        ownerImg() {
            if (this.station.owner.fullname === 'Tuneify') return `https://res.cloudinary.com/dys1sj4cd/image/upload/v1691227930/favicon_juzdft.svg`
            else if (this.station.isAlbum) return this.artist?.imgUrl
            else return this.user.imgUrl
        },
        stationType() {
            if (this.station.isAlbum && this.station.tracks.length === 1) return 'Single'
            else if (this.station.isAlbum) return 'Album'
            return 'Playlist'
        },
        stationId() {
            return this.$route.params.stationId
        },
        formattedTime() {
            const albumTimeCalc = () => {
                const seconds = Math.floor(this.tracksTotalDuration / 1000)
                const minutes = Math.floor(seconds / 60)
                const hours = Math.floor(minutes / 60)

                const formattedTime = []

                if (hours > 0) formattedTime.push(hours + ' hr')

                if (minutes > 0) {
                    const remainingMinutes = minutes % 60
                    formattedTime.push(remainingMinutes + ' min')
                }

                return `, ${formattedTime.join(' ')}`
            }

            if (!this.station.isAlbum) {
                const hours = this.tracksTotalDuration / (1000 * 60 * 60)
                if (hours < 1) return albumTimeCalc()
                return `, About ${Math.floor(hours)} hours`
            }
            else return albumTimeCalc()
        },

        stationOwner() {
            return this.station.owner?.fullname
        },
        hasLiked() {
            const libraryStations = this.$store.getters.libraryStations
            return libraryStations.some(station => station._id === this.station._id)
        },
        hasTracks() {
            return this.station.tracks.length > 0
        },
        isOwner() {
            return this.station.owner._id === this.user?._id
        },
        isPlaying() {
            return this.$store.getters.isCurrTrackPlaying && (this.station._id === this.currStation?._id)
        },
        currStation() {
            return this.$store.getters.currStation
        },
        currTrackIdx() {
            return this.$store.getters.currTrackIdx
        },
        user() {
            return this.$store.getters.loggedinUser
        },
        searchResStation() {
            return this.$store.getters.searchRes
        },
        userStations() {
            return this.station.owner.fullname !== 'Tuneify' && this.station.name !== 'Liked Songs' && !this.station.isAlbum && !this.station.isArtist
        },
        recommendationsStation() {
            return this.$store.getters.recommendationsStation
        },
        tracksTotalDuration() {
            return this.station.tracks?.reduce((sum, track) => sum = sum + track.formalDuration, 0)
        },
    },
    async created() {
        await this.loadStation()
        socketService.on(SOCKET_EVENT_SET_TOPIC_USERS, this.setTopicUsers)
        historyTracker.push(this.$route.fullPath)
        eventBus.on('clickFromUserPlaylist', this.clickTrack)
        eventBus.on('scrollDown', this.scrollDown)
    },
    unmounted() {
        socketService.off(SOCKET_EVENT_SET_TOPIC_USERS)
        eventBus.off('clickFromSearchRes', this.clickTrack)
    },
    methods: {
        showBtn(type) {
            const discography = this.station?.albums.filter(album => album.group !== 'appears_on')
            const firstGroup = discography[0]?.group
            if (type === 'all') return !discography.every(album => album.group === firstGroup)
            return discography.some(album => album.group === type)
        },
        scrollDown() {
            const container = this.$refs.stationDetails
            if (container) setTimeout(() => container.scrollTo({ top: 1000, behavior: 'smooth' }), 1000)
        },
        getStationFromCache() {
            const stationsCache = JSON.parse(localStorage.getItem('stationsCache')) || []
            return stationsCache.find(station => station?.spotifyId === this.stationId)
        },
        async updateStationsCache() {
            let stationsCache = JSON.parse(localStorage.getItem('stationsCache')) || []
            if (stationsCache.length >= 50) stationsCache.pop()
            localStorage.setItem('stationsCache', JSON.stringify([ this.station, ...stationsCache ]))
        },
        filterAlbums(station) {
            this.artistAlbums = station.albums.filter(album => album.group !== 'appears_on')
            this.artistAppearOn = station.albums.filter(album => album.group === 'appears_on')
            this.setFilterBy(this.filterBy)
        },
        getStationType() {
            const path = this.$route.path
            return path.startsWith('/station') ? 'station' : path.startsWith('/album') ? 'album' : 'artist'
        },
        async checkStationForChanges(station) {
            console.log('checking for updates')
            try {
                const updatedStation = await stationService.checkForChanges(station)
                if (updatedStation) {
                    console.log('playlist updated')
                    this.station = updatedStation
                }
            } catch (error) {
                console.log(error)
            }
        },
        async loadStation() {
        
            const selectedStation = this.getStationFromCache()
            if (selectedStation) this.station = selectedStation
            if (Date.now() - selectedStation?.lastUpdate < 3600000 * 12) return
           
            try {           
                const stationType = this.getStationType()
                const station = await this.$store.dispatch({ type: 'getStation', stationId: this.stationId, stationType })
                
                if (!station) return this.$router.push('/')
                
                this.station = station
                
                const isStale = Date.now() - station.lastUpdate > 3600000 * 12
                if (station._id && station.snapshot_id && isStale) await this.checkStationForChanges(station)

                if (station.isArtist) this.filterAlbums(station)

                if (station.isAlbum) this.loadArtist()

                this.$emit('station', station)

                if (this.station.owner.fullname === 'Tuneify') await this.updateStationsCache()
            } catch (err) {
                console.log(err.message)
            }
        },
        async loadArtist() {
            const artistId = this.station.tracks[0].artistId
            try {
                this.artist = await stationService.getArtistData(artistId, true)
            }
            catch (err) {
                console.log(err.message)
                showErrorMsg('Could not load artist')
            }
        },
        async likeDislikeStation(action) {
            let errMsg
            let successMsg
            action === 'add' ? (successMsg = 'Saved to Your Library', errMsg = 'Could not add station')
                : (successMsg = 'Removed from Your Library', errMsg = 'Could not remove station')

            try {
                this.$store.commit({ type: 'setUserStations', station: this.station, action })
                await this.$store.dispatch({ type: 'updateUserStations', stationId: this.station._id, action })
                eventBus.emit('loadLibrary')
                showSuccessMsg(successMsg)
            } catch (err) {
                console.log(err.message)
                showErrorMsg(errMsg)
            }
        },
        async dislikeTrack(trackId) {
            try {
                await this.$store.dispatch({ type: 'removeTrack', trackId, stationId: this.user.likedId })
                eventBus.emit('loadLibrary')
                showSuccessMsg('Removed from Liked Songs')
            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not dislike track')
            }
        },
        async addTrack(trackToSave, stationId) {
            try {
                await this.$store.dispatch({ type: 'addTrack', trackToSave, stationId })
                this.loadStation()
                eventBus.emit('track-add')
                eventBus.emit('loadLibrary')

                if (stationId !== this.user.likedId) showSuccessMsg('Added to playlist')
                else showSuccessMsg('Added to Liked Songs')

            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not add track')
            }
        },
        async removeTrack(trackId) {
            try {
                await this.$store.dispatch({ type: 'removeTrack', trackId, stationId: this.station._id })
                this.loadStation()
                eventBus.emit('loadLibrary')
                showSuccessMsg('Removed from playlist')
            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not dislike track')
            }
        },
        async getSearchRes(query) {
            try {
                await this.$store.dispatch({ type: 'getSearchRes', query })
            } catch (err) {
                console.log(err.message)
                showErrorMsg(`Could not load tracks`)
            }
        },
        setBgColor(colors) {
            const { avgColor, darkerColor, darkerDarkerColor } = colors
            const elTopGrad = this.$refs.topGradient
            const elBotGrad = this.$refs.botGradient

            elTopGrad.style.backgroundImage = `linear-gradient(to bottom, ${avgColor} 0%, ${darkerColor})`
            elBotGrad.style.backgroundImage = `linear-gradient(to bottom, ${darkerDarkerColor} 0%, #121212 14.5rem, #121212)`
        },
        openStationEditor() {
            if (this.station.owner.fullname === 'Tuneify' || this.station._id === this.user.likedId || this.station.isAlbum || this.station.isArtist) return
            document.body.classList.add('se-modal-open')
        },
        clickTrack(trackIdx, source) {
            trackIdx = trackIdx === -1 ? 0 : trackIdx

            if (trackIdx === this.currTrackIdx && this.isPlaying) this.pauseTrack()
            else {
                this.$store.commit({ type: 'setCurrTrackIdx', trackIdx })
                if (source === 'search') this.$store.commit({ type: 'setCurrStation', station: this.searchResStation })
                else if (source === 'recommendations') this.$store.commit({ type: 'setCurrStation', station: this.recommendationsStation })
                else this.setViewedStationAsCurrent()
                eventBus.emit('trackClicked')
            }
        },
        pauseTrack() {
            eventBus.emit('trackPaused', true)
        },
        activateShare(isShare) {

            if (isShare) socketService.emit(SOCKET_EMIT_SET_TOPIC, this.stationId)
            else socketService.emit(SOCKET_EMIT_LEAVE_TOPIC, this.stationId)

            socketService.emit(SOCKET_EMIT_GET_TOPIC_USERS, this.stationId)
            this.isShare = !this.isShare

            this.setViewedStationAsCurrent()
        },
        setViewedStationAsCurrent() {
            // Without this condition, tracks will be always resetting as we set the current station to be the viewed station.
            // This condition solved the track youtube ids problem
            if (this.station !== this.currStation) {
                this.$store.commit({ type: 'setCurrStation', station: this.station })
            }
        },
        async setTopicUsers(userIds) {
            const topicUsers = await Promise.all(userIds.map(userId => userService.getById(userId)))
            this.topicUsers = topicUsers
        },
        setFilterBy(filterBy) {
            const discography = this.station?.albums.filter(album => album.group !== 'appears_on')
            this.filterBy = filterBy
            if (!filterBy) this.artistAlbums = discography
            else this.artistAlbums = discography.filter(station => station.type === filterBy)
        },
        getRecommendations() {
            const trackIds = this.station.tracks.map(track => track.id).slice(0, 5).join(',')
            this.$store.dispatch({ type: 'getRecommendations', trackIds })
        }
    },
    watch: {
        stationId() {
            this.station = null
            if (!this.stationId) return
            this.loadStation()
            historyTracker.push(this.$route.fullPath)
            setTimeout(() => {
                this.$refs.stationDetails.scrollTop = 0
            }, 500)
        },
    },
    components: {
        StationEdit,
        TrackList,
        StationList,
        UserList,
        Loader,
        StationImg
    }
}
</script>