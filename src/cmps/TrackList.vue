<template>
    <section class="track-list">
        <div class="list-header track-preview-layout">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span>Date added</span>
            <span v-icon="'clock'"></span>
        </div>
        <hr>
        <ul v-if="station?.tracks" class="clean-list">
            <li v-for="(track, idx) in station.tracks" :key="track.id" @click="trackClicked(idx)">
                <TrackPreview :track="track" :trackIdx="idx" />
                <section class="track-actions">
                    <!-- <span class="material-symbols-outlined">favorite</span> -->
                    <!-- <button class="small-like-dis" @click="toggleLike(trackIdx - 1)">
                    <span v-if="this.isLiked" v-icon="`smallLikeEna`"></span>
                    <span v-else v-icon="`smallLikeDis`"></span>
                    </button> -->
                    <!-- <button class="small-like-dis" v-if="title.isHovered && !track.isLiked">
                    </button>
                    <button class="small-like-ena" v-if="title.isHovered && track.isLiked">
                    </button> -->
                </section>
            </li>
        </ul>
    </section>
</template>

<script>
import TrackPreview from './TrackPreview.vue'

export default {
    props: {
        station: { type: Object },
    },

    methods: {
        trackClicked(trackIdx) {
            this.$emit('track-clicked', trackIdx)
        }
    },

    components: {
        TrackPreview,
    },

    name: 'TrackList',
}
</script>
