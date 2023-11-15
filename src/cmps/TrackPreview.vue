<template>
    <article class="track-preview track-preview-layout" @mouseover="onMouseOver" @mouseleave="onMouseLeave">

        <img v-if="isTrackPlaying && !isHovered" class="eq"
            src="https://res.cloudinary.com/dmmsf57ko/image/upload/v1683729372/Song_hoitzd.gif" alt="">
        <span v-else-if="isHovered && !this.isTrackPlaying" class="small-play" v-icon="`sPlay`" title="Play"></span>
        <span v-else-if="isHovered && this.isTrackPlaying" class="small-pause" v-icon="`pause`" title="Pause"></span>
        <span v-else class="track-num" :class="isPlaying">{{ trackIdx + 1 }}</span>

        <div class="mini-prev">
            <section class="img-container">
                <img v-if="track.imgUrl && !this.station?.isAlbum" :src="`${track.imgUrl[2].url}`" alt="">
            </section>
            <section class="track-info-container">
                <div class="track-name" :class="isPlaying">{{ track.title }}</div>
                <div v-if="!station?.isArtist" class="track-artists">
                    <span v-for="(artist, idx) in track.artists" :key="artist.spotifyId">
                        <RouterLink :to="`/artist/${artist.spotifyId}`" @click.stop>{{ artist.name }}</RouterLink>{{ idx <
                            track.artists.length - 1 ? ', ' : '' }} </span>
                </div>
            </section>
        </div>
        <span class="track-album">
            <RouterLink :to="`/album/${track.albumId}`" class="track-album" @click.stop>{{ track.album }}</RouterLink>
        </span>
        <div class="df sb" :class="{ 'in-search': $route.path.startsWith('/search') }">
            <span v-show="!this.$route.path.startsWith('/search')" class="track-date">{{ formattedDate }}</span>
            <span v-show="isHovered" v-if="!isLiked(track.id)" @click.stop="onAddTrack(track, user.likedId)"
                class="btn-like" v-icon="`smallLikeDis`"></span>
            <span v-else @click.stop="onDislikeTrack(track.id)" class="btn-dislike" v-icon="`smallLikeEna`"></span>
        </div>
        <div class="time-actions">
            <div class="track-time">
                <span>{{ formattedTime }}</span>
            </div>
            <span v-show="isHovered" class="btn-options svg-fill" v-icon="'moreOptionsSmall'"
                @click="toggleDropdown($event)"></span>

            <div v-if="showDropdown" class="dropdown" v-clickOutside="hideMenu"
                :style="{ top: dropdownTop + 'px', left: dropdownLeft + 'px' }" ref="dropdown">
                <div class="dropdown-item sb" @mouseenter="popSubDropdown">
                    <div class="wrapper">
                        <span v-icon="'createList'" class="df ai"></span>
                        <div>Add to playlist</div>
                    </div>
                    <span v-icon="`rightArrow`" class="df ai"></span>
                </div>
                <div @mouseenter="this.showSubDropdown = false">
                    <div v-if="isStationOwner" class="dropdown-item" @click.stop="onRemoveTrack(track.id)">
                        <div class="wrapper">
                            <span v-icon="'trash'" class="df ai"></span>
                            <div>Remove from playlist</div>
                        </div>
                    </div>
                    <div v-if="!isLiked(track.id)" class="dropdown-item" @click.stop="onAddTrack(track, user.likedId)">
                        <div class="wrapper">
                            <span v-icon="'plus'" class="df ai"></span>
                            <div>Save to your Liked Songs</div>
                        </div>
                    </div>
                    <div v-else class="dropdown-item" @click.stop="onDislikeTrack(track.id)">
                        <div class="wrapper">
                            <span v-icon="'greenVee'" class="df ai"></span>
                            <div>Remove from your Liked Songs</div>
                        </div>
                    </div>
                    <hr>
                    <div class="dropdown-item" @click.stop="goTo(`/artist/${track.artistId}`)">
                        <div class="wrapper">
                            <span v-icon="'artist'" class="df ai"></span>
                            <div>Go to artist</div>
                        </div>
                    </div>
                    <div class="dropdown-item" @click.stop="goTo(`/album/${track.albumId}`)">
                        <div class="wrapper">
                            <span v-icon="'album'" class="df ai"></span>
                            <div>Go to album</div>
                        </div>
                    </div>
                </div>

                <div v-show="showSubDropdown" class="sub-dropdown" @mouseenter="popSubDropdown" ref="subDropdown"
                    :style="{ left: subDropdownLeft + 'px' }">
                    <div class="sub-dropdown-item" @click.stop="addStation(track)">
                        <span v-icon="'createList'" class="df ai"></span>
                        <div>Create playlist</div>
                    </div>
                    <hr v-if="createdStations?.length">
                    <div class="sub-dropdown-item" v-for="idx in createdStations?.length"
                        @click.stop="onAddTrack(track, createdStations[idx - 1]._id, $event)">
                        {{ createdStations[idx - 1].name }}
                    </div>
                </div>

            </div>
        </div>
    </article>
</template>

<script>
import moment from 'moment'
import { eventBus } from '../services/event-bus.service'
import { RouterLink } from 'vue-router'
import { nextTick } from 'vue'

export default {
    name: 'TrackPreview',
    props: {
        station: { type: Object },
        track: { type: Object },
        trackIdx: { type: Number }
    },
    data() {
        return {
            trackTime: this.track.formalDuration,
            dateStr: this.track.addedAt,
            isHovered: false,
            showDropdown: false,
            showSubDropdown: false,
            dropdownTop: 0,
            dropdownLeft: 0,
            subDropdownLeft: 0,
        }
    },
    computed: {
        formattedTime() {
            const totalSeconds = Math.floor(this.trackTime / 1000)
            const hours = Math.floor(totalSeconds / 3600)
            const minutes = Math.floor((totalSeconds % 3600) / 60)
            const seconds = totalSeconds % 60
            const padZero = (num) => (num < 10 ? `0${num}` : num)
            return `${minutes}:${padZero(seconds)}`
        },
        formattedDate() {
            if (!this.dateStr)
                return
            const now = moment()
            const targetDate = moment(this.dateStr)
            let diffInDays = now.diff(targetDate, 'days')
            if (diffInDays < 7) {
                if (diffInDays === 0)
                    return "Today"
                if (diffInDays === 1)
                    return "Yesterday"
                if (diffInDays < 0)
                    diffInDays *= (-1)
                return `${diffInDays} days ago`
            }
            else {
                return targetDate.format("MMM D, YYYY")
            }
        },
        currStation() {
            return this.$store.getters.currStation
        },
        currTrack() {
            return this.$store.getters.currTrack
        },
        currTrackIdx() {
            return this.$store.getters.currTrackIdx
        },
        isTrackPlaying() {
            return this.$store.getters.isCurrTrackPlaying && this.track?.id === this.currTrack?.id && this.currStation?._id === this.station?._id
        },
        isPlaying() {
            if (!this.currTrack) return
            return {
                'track-playing': this.isTrackPlaying,
                'track-paused': this.currTrack.id === this.track.id && this.currStation?._id === this.station?._id
            }
        },
        isStationOwner() {
            return this.station?.owner.fullname === this.user.fullname && this.station.name !== 'Liked Songs'
        },
        likedTracks() {
            const stations = this.$store.getters.libraryStations
            const likedSongsStation = stations?.find(station => station._id === this.user?.likedId)
            return likedSongsStation?.tracks
        },
        createdStations() {
            const stations = this.$store.getters.libraryStations
            return stations.filter(station => station._id !== this.user.likedId && station.owner.fullname !== 'Tuneify' && !station.isAlbum && !station.isArtist)
        },
        user() {
            return this.$store.getters.loggedinUser
        },
    },
    methods: {
        addStation(track) {
            eventBus.emit('add-station', track)
            this.hideMenu()
        },
        onMouseOver() { this.isHovered = true },
        onMouseLeave() { this.isHovered = false },
        onAddTrack(track, stationId) {
            document.querySelector('.btn-like').classList.add('pulse')
            this.$emit('track-add', track, stationId)
            this.hideMenu()
        },
        onRemoveTrack(trackId) {
            this.$emit('track-remove', trackId)
        },
        onDislikeTrack(trackId) {
            document.querySelector('.btn-dislike').classList.add('shake')
            this.$emit('track-dislike', trackId)
            eventBus.emit('dislikeTrack', trackId)
            this.hideMenu()
        },
        isLiked(trackId) {
            return this.likedTracks?.some(track => track.id === trackId)
        },
        toggleDropdown(ev) {
            this.dropdownLeft = ev.clientX
            this.dropdownTop = ev.clientY + 20
            ev.stopPropagation()
            this.showDropdown = !this.showDropdown
            this.showSubDropdown = false
            nextTick(() => {
                const elementIsInViewport = this.isElementInViewport(this.$refs.dropdown)
                if (!elementIsInViewport.horizontally) this.dropdownLeft = ev.clientX - 250
                if (!elementIsInViewport.vertically) this.dropdownTop = ev.clientY - 170
            })

        },
        popSubDropdown() {
            this.showSubDropdown = true
            this.subDropdownLeft = 256
            nextTick(() => {
                const elementIsInViewport = this.isElementInViewport(this.$refs.subDropdown)
                if (!elementIsInViewport.horizontally) this.subDropdownLeft = -180
            })
        },
        hideSubDropdown() {
            this.showSubDropdown = false
        },
        hideMenu() {
            this.showSubDropdown = false
            this.showDropdown = false
        },
        goTo(path) {
            this.$router.push(path)
            this.hideMenu()
        },
        isElementInViewport(el) {
            const rect = el.getBoundingClientRect()

            return {
                horizontally: rect.left >= 0 && rect.right <= (window.innerWidth || document.documentElement.clientWidth),
                vertically: rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight),
            }
        }
    },
    components: { RouterLink }
}
</script>
<style scoped>
.in-search {
    justify-content: end;
}
</style>

