<template>
    <article class="track-preview track-preview-layout" @mouseover="onMouseOver" @mouseleave="onMouseLeave">

        <img v-if="isTrackPlaying && !isHovered" class="eq"
            src="https://res.cloudinary.com/dmmsf57ko/image/upload/v1683729372/Song_hoitzd.gif" alt="">
        <span v-else-if="isHovered && !this.isTrackPlaying" class="small-play" v-icon="`play`" title="Play"></span>
        <span v-else-if="isHovered && this.isTrackPlaying" class="small-pause" v-icon="`pause`" title="Pause"></span>
        <span v-else class="track-num" :class="isPaused">{{ trackIdx + 1 }}</span>

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
        <div class="df sb">
            <span class="track-date">{{ formattedDate }}</span>
            <span v-show="isHovered" v-if="!isLiked(track.id)" @click="onAddTrack(track, user.likedId, $event)"
                class="btn-like" v-icon="`smallLikeDis`"></span>
            <span v-else @click="onDislikeTrack(track.id, $event)" class="btn-dislike" v-icon="`smallLikeEna`"></span>
        </div>
        <div class="time-actions">
            <span class="track-time">{{ formattedTime }}</span>



            <span v-show="isHovered" class="btn-options svg-fill" v-icon="'moreOptionsSmall'"
                @click="toggleDropdown($event)"></span>

            <div v-if="showDropdown" class="dropdown">
                <div v-if="!isStationOwner" class="dropdown-item" @mouseenter="popSubDropdown">
                    <span class="menu-li">Add to playlist</span>
                    <div v-show="showSubDropdown" class="sub-dropdown">
                        <div class="sub-dropdown-item" v-for="idx in createdStations?.length"
                            @click="onAddTrack(track, createdStations[idx - 1]._id, $event)">
                            {{ createdStations[idx - 1].name }}
                            <hr>
                        </div>
                    </div>
                </div>
                <div v-else class="dropdown-item" @click="onRemoveTrack(track.id, $event)">
                    <span class="menu-li">Remove from playlist</span>
                </div>
            </div>


        </div>
    </article>
</template>

<script>
import moment from 'moment'

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
            const diffInDays = now.diff(targetDate, 'days')

            if (diffInDays < 7) {
                if (diffInDays === 0) return "Today"
                if (diffInDays === 1) return "Yesterday"
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
            // console.log('this.isTrackPlaying',this.isTrackPlaying)
            // console.log('this.track.id',this.track.id)
            // console.log('this.currTrack.id',this.currTrack?.id)
            if(!this.currTrack) return
            return {
                'track-playing': this.isTrackPlaying
            }
        },
        isPaused() {
            return {
                'track-paused': !this.isTrackPlaying && this.currTrack?.id === this.track?.Id && this.currTrack !== undefined
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
            return this.$store.getters.libraryStations.filter(station => station._id !== this.user.likedId)
        },
        user() {
            return this.$store.getters.loggedinUser
        },

    },

    methods: {
        onMouseOver() { this.isHovered = true },
        onMouseLeave() {
            this.isHovered = false
            this.showDropdown = false
        },
        onAddTrack(track, stationId, ev) {
            ev.stopPropagation()
            this.$emit('track-add', track, stationId)
            this.showSubDropdown = false

        },
        onRemoveTrack(trackId, ev) {
            ev.stopPropagation()
            this.$emit('track-remove', trackId)
        },
        onDislikeTrack(trackId, ev) {
            ev.stopPropagation()
            this.$emit('track-dislike', trackId)
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
        unPopSubDropdown() {
            this.showSubDropdown = false
        },
    }
}

</script>

