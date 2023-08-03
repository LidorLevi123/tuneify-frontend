<template>
    <article class="search-preview-container" @mouseover="onMouseOver" @mouseleave="onMouseLeave">

        <div class="mini-prev">
            <section class="img-container">
                <img :src="`${track.imgUrl}`" alt="">
            </section>
            <section class="track-info-container">
                <div class="track-name" :class="isPlaying">{{ track.title }}</div>
                <div class="artist-name">{{ track.artists[0] }}</div>
            </section>
        </div>
        <span class="track-album">{{ track.album }}</span>
        <button class="add-btn" @click="onAddTrack(track, station?._id)">Add</button>
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
    }
}

</script>