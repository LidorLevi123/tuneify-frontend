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
                <div v-if="!station?.isArtist" class="track-artists">
                    <span v-for="(artist, idx) in track.artists" :key="artist.spotifyId" class="artist-name">
                        <RouterLink :to="`/artist/${artist.spotifyId}`" @click.stop>{{ artist.name }}</RouterLink>
                        <span v-if="idx < track.artists.length - 1">, </span>
                    </span>
                </div>
            </section>
        </div>
        <span class="track-album">
            <RouterLink :to="`/album/${track.albumId}`" class="track-album" @click.stop>
                {{ track.album }}
            </RouterLink>
        </span>
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