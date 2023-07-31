<template>
    <article class="track-preview track-preview-layout" @mouseover="onMouseOver" @mouseleave="onMouseLeave">

        <img v-if="isTrackPlaying" class="eq"
            src="https://res.cloudinary.com/dmmsf57ko/image/upload/v1683729372/Song_hoitzd.gif" alt="">
        <span v-else-if="isHovered" class="small-play" v-icon="`play`" title="Play"></span>
        <span v-else class="track-num">{{ trackIdx + 1 }}</span>

        <div class="mini-prev">
            <section class="img-container">
                <img :src="`${track.imgUrl}`" alt="">
            </section>
            <section>
                <div class="track-name" :class="isPlaying">{{ track.title }}</div>
                <div class="track-artist">{{ track.artists[0] }}</div>
            </section>
        </div>
        <span class="track-album">{{ track.album }}</span>
        <div class="df sb">
            <span class="track-date">{{ formattedDate }}</span>
            <span v-show="isHovered" v-if="!isLiked(track.id)" @click="onAddTrack(track, 'liked101', $event)" class="btn-like"
                v-icon="`smallLikeDis`"></span>
            <span v-else @click="onDislikeTrack(track, $event)" class="btn-dislike" v-icon="`smallLikeEna`"></span>
        </div>
        <div class="time-actions">
            <span class="track-time">{{ formattedTime }}</span>

            <section class>

                <span v-show="isHovered" class="btn-options svg-fill" v-icon="'moreOptionsSmall'"
                    @click="toggleDropdown($event)"></span>

                <div v-if="showDropdown" class="dropdown">
                    <div v-if="!isStationOwner" class="dropdown-item" @mouseenter="popSubDropdown"
                        @mouseleave="unPopSubDropdown">
                        <span>Add to playlist</span>
                        <div v-show="showSubDropdown" class="sub-dropdown">
                            <div class="sub-dropdown-item" v-for="idx in createdStations?.length"
                                @click="onAddTrack(track, createdStations[idx - 1]._id, $event)">
                                {{ createdStations[idx - 1].name }}
                            </div>
                        </div>
                    </div>
                    <div v-else class="dropdown-item" @click="onRemoveTrack(track, $event)">
                        <span>Remove from playlist</span>
                    </div>
                </div>

            </section>
        </div>
    </article>
</template>

<script>
import moment from 'moment'

export default {
    name: 'TrackPreview',

    props: {
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
        currTrackIdx() {
            return this.$store.getters.currTrackIdx
        },
        isTrackPlaying() {
            return this.$store.getters.isCurrTrackPlaying && this.trackIdx === this.currTrackIdx
        },
        isPlaying() {
            return {
                'track-playing': this.isTrackPlaying,
            }
        },
        isStationOwner() {
            const currStation = this.$store.getters.currStation
            return currStation.owner === undefined ? false : true
        },
        likedTracks() {
            return this.$store.getters.likedTracks
        },
        createdStations() {
            return this.$store.getters.libraryStations.filter(station => station._id !== 'liked101')
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
        },
        onRemoveTrack(track, ev) {
            ev.stopPropagation()
            this.$emit('track-remove', track)
        },
        onDislikeTrack(track, ev) {
            ev.stopPropagation()
            this.$emit('track-dislike', track)
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

