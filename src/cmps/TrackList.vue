<template>
    <section class="track-list-container" :class="{ 'in-artist-page': station?.isArtist }">

        <div v-if="station && !station.isArtist" class="list-header track-preview-layout"
            :class="{ 'is-sticky': scrollPosition > 450 }">
            <span>#</span>
            <span>Title</span>
            <span class="mq" :style="{ opacity: station?.isAlbum ? '0' : '1' }">Album</span>
            <span class="mq" :style="{ opacity: station?.isAlbum || station?.isTrack ? '0' : '1' }">Date added</span>
            <span v-icon="'clock'"></span>
        </div>
        <div v-if="station?.isArtist" class="artist-header">
            <h1>Popular</h1>
        </div>
        <ul v-if="station?.tracks.length" class="clean-list track-list" @touchend="fixActionRestriction">
            <hr v-show="station && !station.isArtist" />

            <Container v-if="station.owner._id" dragClass="dragging" @drop="onDrop" :animation-duration="100"
                drag-class="dragged-item">
                <Draggable v-for="(track, idx) in station.tracks" :key="track.id">
                    <li :class="`track-${track.id}`" @click="onTrackClicked(idx)">
                        <TrackPreview @track-add="onAddTrack" @track-remove="onRemoveTrack" @track-dislike="onDislikeTrack"
                            :station="station" :track="track" :trackIdx="idx" />
                    </li>
                </Draggable>
            </Container>

            <template v-else>
                <li v-for="(track, idx) in station.tracks" :key="track.id" @click="onTrackClicked(idx)">
                    <TrackPreview @track-add="onAddTrack" @track-remove="onRemoveTrack" @track-dislike="onDislikeTrack"
                        :station="station" :track="track" :trackIdx="idx" />
                </li>
            </template>

        </ul>
        <TrackSearch v-if="canShowSearch && station" @search="onLoadTracks" @track-add="onAddTrack"
            @getRecommendations="getRecommendations" :station="station" />

        <ul v-if="tracks?.length" class="clean-list">
            <li v-for="(track, idx) in tracks" :key="track.id" @click="onTrackClicked(idx)">
                <TrackPreview @track-add="onAddTrack" :track="track" :trackIdx="idx" />
            </li>
        </ul>

    </section>
</template>

<script>
import TrackPreview from './TrackPreview.vue'
import TrackSearch from './TrackSearch.vue'

import { Container, Draggable } from 'vue3-smooth-dnd'
import { SOCKET_EMIT_TRACK_DRAGGED } from '../services/socket.service.js'
import { eventBus } from '../services/event-bus.service'

export default {
    props: {
        station: { type: Object },
        tracks: { type: Array }
    },

    data() {
        return {
            scrollPosition: null
        }
    },
    created() {
        socketService.on(SOCKET_EMIT_TRACK_DRAGGED, this.onTrackDragged)
        eventBus.on('handleScroll', this.logScroll)
    },
    computed: {
        canShowSearch() {
            return this.station?.owner._id === this.user?._id && this.station?._id !== this.user?.likedId
        },
        user() {
            return this.$store.getters.loggedinUser
        },
        currStation() {
            return this.$store.getters.currStation
        },
        currTrackIdx() {
            return this.$store.getters.currTrackIdx
        },
    },

    methods: {
        fixActionRestriction() {
            document.body.classList.remove(
                "smooth-dnd-no-user-select",
                "smooth-dnd-disable-touch-action"
            )
        },
        onDrop(dropResult) {
            this.applyDrag(dropResult, false)
        },

        async applyDrag(dragResult, isSocketBroadcast) {

            const { removedIndex, addedIndex, payload } = dragResult

            let itemToAdd = payload

            if (removedIndex !== null) {
                itemToAdd = this.station.tracks.splice(removedIndex, 1)[0]
            }

            if (addedIndex !== null) {
                this.station.tracks.splice(addedIndex, 0, itemToAdd)
            }

            const updatedStation = { ...this.station, tracks: this.station.tracks }

            this.updateStation(updatedStation, removedIndex, addedIndex)

            if (isSocketBroadcast) return
            socketService.emit(SOCKET_EMIT_TRACK_DRAGGED, dragResult)

        },

        async updateStation(updatedStation, removedIndex, addedIndex) {
            try {
                await this.$store.dispatch({ type: 'saveStation', stationToSave: updatedStation })
                if (updatedStation._id === this.currStation?._id) {
                    this.$store.commit({ type: 'setCurrStation', station: updatedStation })
                    if (removedIndex === this.currTrackIdx) {
                        this.$store.commit({ type: 'setCurrTrackIdx', trackIdx: addedIndex })
                    } else if (this.currTrackIdx > removedIndex && this.currTrackIdx <= addedIndex) {
                        this.$store.commit({ type: 'setCurrTrackIdx', trackIdx: this.currTrackIdx - 1 })
                    } else if (this.currTrackIdx < removedIndex && this.currTrackIdx >= addedIndex) {
                        this.$store.commit({ type: 'setCurrTrackIdx', trackIdx: this.currTrackIdx + 1 })
                    }
                }
                this.$emit('station-update')
            } catch (err) {
                console.log(err.message)
            }
        },

        onTrackClicked(trackIdx) {
            this.$emit('track-clicked', trackIdx)
        },
        onAddTrack(track, stationId) {
            this.$emit('track-add', track, stationId)
        },
        onRemoveTrack(trackId) {
            this.$emit('track-remove', trackId)
        },
        onDislikeTrack(trackId) {
            this.$emit('track-dislike', trackId)
        },
        onLoadTracks(query) {
            this.$emit('search', query)
        },
        async onTrackDragged(dragResult) {
            this.applyDrag(dragResult, true)
        },
        logScroll({ scrollTop }) {
            this.scrollPosition = scrollTop
        },
        getRecommendations() {
            this.$emit('getRecommendations')
        }
    },

    components: {
        TrackPreview,
        Container,
        Draggable,
        TrackSearch
    },

    name: 'TrackList',
}
</script>




