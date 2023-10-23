<template>
    <article class="track-preview track-preview-layout" :class="{ inSearch: $route.path.startsWith('/search') }"
        @mouseover="onMouseOver" @mouseleave="onMouseLeave">

        <img v-if="isTrackPlaying && !isHovered" class="eq"
            src="https://res.cloudinary.com/dmmsf57ko/image/upload/v1683729372/Song_hoitzd.gif" alt="">
        <span v-else-if="isHovered && !this.isTrackPlaying" class="small-play" v-icon="`sPlay`" title="Play"></span>
        <span v-else-if="isHovered && this.isTrackPlaying" class="small-pause" v-icon="`pause`" title="Pause"></span>
        <span v-else class="track-num" :class="isPlaying">{{ trackIdx + 1 }}</span>

        <div class="mini-prev">
            <section class="img-container">
                <img :src="`${track.imgUrl}`" alt="">
            </section>
            <section class="track-info-container">
                <div class="track-name" :class="isPlaying">{{ track.title }}</div>
                <div class="track-artist">{{ track.artists[0] }}</div>
            </section>
        </div>
        <span class="track-album">{{ track.album }}</span>
        <div class="df sb" :class="{ 'in-search': $route.path.startsWith('/search') }">
            <span v-show="!this.$route.path.startsWith('/search')" class="track-date">{{ formattedDate }}</span>
            <span v-show="isHovered" v-if="!isLiked(track.id)" @click="onAddTrack(track, user.likedId, $event)"
                class="btn-like" v-icon="`smallLikeDis`"></span>
            <span v-else @click="onDislikeTrack(track.id, $event)" class="btn-dislike" v-icon="`smallLikeEna`"></span>
        </div>
        <div class="time-actions">
            <div class="track-time">
                <span>{{ formattedTime }}</span>
            </div>
            <span v-show="isHovered && !this.$route.path.startsWith('/search')" class="btn-options svg-fill"
                v-icon="'moreOptionsSmall'" @click="toggleDropdown($event)"></span>
            <div v-if="showDropdown" class="dropdown">
                <div v-if="!isStationOwner" class="dropdown-item" @mouseenter="popSubDropdown">
                    <span @click="$event.stopPropagation()" class="menu-li df sb" v-clickOutside="hideMenu">Add to
                        playlist <span v-icon="`rightArrow`" class="df ai"></span></span>

                    <div v-show="showSubDropdown && createdStations?.length" class="sub-dropdown">
                        <div class="sub-dropdown-item" v-for="idx in createdStations?.length"
                            @click="onAddTrack(track, createdStations[idx - 1]._id, $event)">
                            {{ createdStations[idx - 1].name }}

                        </div>
                    </div>
                </div>
                <div v-else class="dropdown-item" @click="onRemoveTrack(track.id, $event)">
                    <span class="menu-li" v-clickOutside="hideMenu">Remove from playlist</span>
                </div>
            </div>
        </div>
    </article>
</template>

<script>
import moment from 'moment'
import { eventBus } from '../services/event-bus.service'

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
        }
    },

    computed: {
        formattedTime() {
            const totalSeconds = Math.floor(this.trackTime / 1000)
            const hours = Math.floor(totalSeconds / 3600)
            const minutes = Math.floor((totalSeconds % 3600) / 60)
            const seconds = totalSeconds % 60;
            const padZero = (num) => (num < 10 ? `0${num}` : num)
            return `${minutes}:${padZero(seconds)}`
        },
        formattedDate() {
            const now = moment()
            const targetDate = moment(this.dateStr)
            let diffInDays = now.diff(targetDate, 'days')

            if (diffInDays < 7) {
                if (diffInDays === 0) return "Today"
                if (diffInDays === 1) return "Yesterday"
                if (diffInDays < 0) diffInDays *= (-1)
                return `${diffInDays} days ago`
            } else {
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
            return this.$store.getters.isCurrTrackPlaying && this.track?.id === this.currTrack?.id
        },
        isPlaying() {
            if (!this.currTrack) return

            return {
                'track-playing': this.isTrackPlaying,
                'track-paused': this.currTrack.id === this.track.id
            }
        },
        isStationOwner() {
            return this.station.owner?.fullname === this.user.fullname
        },
        likedTracks() {
            const stations = this.$store.getters.libraryStations
            const likedSongsStation = stations?.find(station => station._id === this.user?.likedId)
            return likedSongsStation?.tracks
        },
        createdStations() {
            const stations = this.$store.getters.libraryStations
            return stations.filter(station => station._id !== this.user.likedId && station.owner.fullname !== 'Tuneify')
        },
        user() {
            return this.$store.getters.loggedinUser
        },

    },

    methods: {
        onMouseOver() { this.isHovered = true },
        onMouseLeave() {
            this.isHovered = false
        },
        onAddTrack(track, stationId, ev) {
            ev.stopPropagation()
            this.$emit('track-add', track, stationId)
            this.hideMenu()
        },
        onRemoveTrack(trackId, ev) {
            ev.stopPropagation()
            this.$emit('track-remove', trackId)
        },
        onDislikeTrack(trackId, ev) {
            ev.stopPropagation()
            this.$emit('track-dislike', trackId)
            eventBus.emit('dislikeTrack', trackId)
        },
        isLiked(trackId) {
            return this.likedTracks?.some(track => track.id === trackId)
        },
        toggleDropdown(ev) {
            ev.stopPropagation()
            this.showDropdown = !this.showDropdown
            this.showSubDropdown = false
        },
        popSubDropdown() {
            this.showSubDropdown = true
        },
        hideMenu() {
            this.showSubDropdown = false
            this.showDropdown = false
        },
    }
}
</script>
<style scoped>
.in-search {
    justify-content: end;
}
</style>

