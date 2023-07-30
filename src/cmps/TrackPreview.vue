<template>
    <article class="track-preview track-preview-layout" @mouseover="onMouseOver" @mouseleave="onMouseLeave">

        <img v-if="isTrackPlaying" class="eq" src="https://res.cloudinary.com/dmmsf57ko/image/upload/v1683729372/Song_hoitzd.gif" alt="">
        <span v-else-if="isHovered" class="small-play" v-icon="`play`" title="Play"></span>
        <span v-else class="track-num">{{ trackIdx+1 }}</span>

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
        </div>
        <span class="track-album">{{ formattedTime }}</span>

        <!-- <section class="track-actions"> -->
            <!-- <span class="material-symbols-outlined">favorite</span> -->
            <!-- <button class="small-like-dis" @click="toggleLike(trackIdx - 1)">
                <span v-if="this.isLiked" v-icon="`smallLikeEna`"></span>
                <span v-else v-icon="`smallLikeDis`"></span>
            </button> -->
            <!-- <button class="small-like-dis" v-if="title.isHovered && !track.isLiked">
            </button>
            <button class="small-like-ena" v-if="title.isHovered && track.isLiked">
            </button> -->
        <!-- </section> -->

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
            isHovered: false,
            trackTime: this.track.formalDuration,
            dateStr: this.track.addedAt,
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
        }
    },

    methods: {
        onMouseOver() { this.isHovered = true },
        onMouseLeave() { this.isHovered = false }
    }
}

</script>

