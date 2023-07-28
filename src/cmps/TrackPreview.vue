<template>
    <article class="track-preview track-preview-layout">
        <span class="track-num">{{ trackIdx }}</span>
        <!-- <span v-show="track.isHovered" class="small-play" v-icon="`play`" title="Play"></span> -->
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
            <!-- <span class="material-symbols-outlined">favorite</span> -->
            <!-- <button class="small-like-dis" v-if="title.isHovered && !track.isLiked"><span
                    v-icon="`smallLikeDis`"></span></button>
            <button class="small-like-ena" v-if="title.isHovered && track.isLiked"><span
                    v-icon="`smallLikeEna`"></span></button> -->
        </div>
        <span class="track-album">{{ formattedTime }}</span>
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
            dateStr: this.track.addedAt
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

    }
}
</script>

