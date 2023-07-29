<template>
    <article class="track-preview track-preview-layout">

        <span class="track-num">{{ trackIdx }}</span>
        <div class="mini-prev">
            <section class="img-container">
                <img :src="`${track.imgUrl}`" alt="">
            </section>
            <section>
                <div class="track-name">{{ track.title }}</div>
                <div class="track-artist">{{ track.artists[0] }}</div>
            </section>
        </div>
        <span class="track-album">{{ track.album }}</span>
        <div class="df sb">
            <span class="track-">{{ formattedDate }}</span>
        </div>
        <span class="track-album">{{ formattedTime }}</span>

        <!-- DEAR YARON - CHANGE THE SVG ICON NAMES TO LIKE / DISLIKE AND NOT SMALL-LIKE-DIS-ZIBI -->
        <section class="track-actions">
            <!-- <span v-show="isHovered" class="small-play" v-icon="`play`" title="Play"></span> -->
            <!-- <span class="material-symbols-outlined">favorite</span> -->
            <button class="small-like-dis" @click="toggleLike(trackIdx-1)">
                <span v-if="this.isLiked" v-icon="`smallLikeEna`"></span>
                <span v-else v-icon="`smallLikeDis`"></span>
            </button>
            <!-- <button class="small-like-dis" v-if="title.isHovered && !track.isLiked">
            </button>
            <button class="small-like-ena" v-if="title.isHovered && track.isLiked">
            </button> -->
        </section>

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
            isLiked: this.track.isLiked,
            isHovered: false,
            trackTime: this.track.formalDuration,
            dateStr: this.track.addedAt,
            currStation: JSON.parse(JSON.stringify(this.$store.getters.currStation))
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
        }
    },

    methods: {
        async toggleLike(trackIdx) {
            this.isLiked = !this.isLiked
            this.currStation.tracks[trackIdx].isLiked = this.isLiked
            // const likedSongsId = this.$store.getters.likedSongsId

            // try {
            //     await this.$store.dispatch({ type: 'saveStation', stationToSave: this.currStation })
            //     // await this.$store.dispatch({ type: 'addTrack', trackToSave: this.track, stationId: likedSongsId })
            // } catch (err) {
            //     console.log(err.message)
            // }
            // console.log(this.track.isLiked)
        },
    }
}
</script>

