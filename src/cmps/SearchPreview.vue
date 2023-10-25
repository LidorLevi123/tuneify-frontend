<template>
    <article class="search-preview-container" @mouseover="onMouseOver" @mouseleave="onMouseLeave">

        <div class="mini-prev">
            <section class="img-container">
                <img :src="`${track.imgUrl[2].url}`" alt="" :class="{ 'filter': isHovered }">
                <span v-if="isHovered && !this.isTrackPlaying" class="small-play" v-icon="`sPlay`" title="Play"></span>
                <span v-else-if="isHovered && this.isTrackPlaying" class="small-pause" v-icon="`pause`"
                    title="Pause"></span>
            </section>
            <section class="track-info-container">
                <div class="track-name" :class="{ 'isGreen': this.isTrackPlaying }">{{ track.title }}</div>
                <div class="artist-name">{{ track.artists[0] }}</div>
            </section>
        </div>
        <span class="track-album">{{ track.album }}</span>
        <button class="add-btn" @click.stop="onAddTrack(track, station?._id)">Add</button>
    </article>
</template>

<script>
export default {
    name: 'TrackPreview',

    props: {
        track: { type: Object },
        station: { type: Object }
    },

    data() {
        return {
            isHovered: false,
        }
    },
    methods: {
        onMouseOver() { this.isHovered = true },

        onMouseLeave() { this.isHovered = false },

        onAddTrack(track, stationId) {
            this.$emit('track-add', track, stationId)
        },
    },
    computed: {
        isTrackPlaying() {
            return this.$store.getters.isCurrTrackPlaying && this.track?.id === this.currTrack?.id
        },
        currTrack() {
            return this.$store.getters.currTrack
        },
    }

}

</script>