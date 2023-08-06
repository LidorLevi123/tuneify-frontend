<template>
    <section class="track-list">

        <div class="list-header track-preview-layout">
            <span>#</span>
            <span>Title</span>
            <span class="mq">Album</span>
            <span class="mq">Date added</span>
            <span v-icon="'clock'"></span>
        </div>
        <hr />
        <ul v-if="station.tracks.length" class="clean-list">
            <Container dragClass="dragging" @drop="onDrop" :animation-duration="100" drag-class="dragged-item">
                <Draggable v-for="(track, idx) in station.tracks" :key="track.id">
                    <li @click="onTrackClicked(idx)">
                        <TrackPreview @track-add="onAddTrack" @track-remove="onRemoveTrack" @track-like="onLikeTrack"
                            @track-dislike="onDislikeTrack" :station="station" :track="track" :trackIdx="idx" />
                    </li>
                </Draggable>
            </Container>
        </ul>
        <TrackSearch v-if="canShowSearch" @search="onLoadTracks" @track-add="onAddTrack" :station="station" />
    </section>
</template>

<script>
import TrackPreview from './TrackPreview.vue'
import TrackSearch from './TrackSearch.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { SOCKET_EMIT_TRACK_DRAGGED } from '../services/socket.service.js'



export default {
    props: {
        station: { type: Object },
    },

    data() {
        return {
        }
    },
    created() {
        socketService.on(SOCKET_EMIT_TRACK_DRAGGED, this.onTrackDragged)
    },
    computed: {
        canShowSearch() {
            return this.station.owner._id === this.user?._id && this.station._id !== this.user?.likedId
        },
        user() {
            return this.$store.getters.loggedinUser
        }
    },

    methods: {
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
            console.log("🚀 updatedStation:", updatedStation)

            await this.updateStation(updatedStation)

            if(isSocketBroadcast) return
            socketService.emit(SOCKET_EMIT_TRACK_DRAGGED, dragResult)
        },

        async updateStation(updatedStation) {
            try {
                await this.$store.dispatch({ type: 'saveStation', stationToSave: updatedStation })
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
        onLikeTrack(track) {
            this.$emit('track-like', track)
        },
        onDislikeTrack(trackId) {
            this.$emit('track-dislike', trackId)
        },
        onLoadTracks(query) {
            this.$emit('search', query)
        },
        async onTrackDragged(dragResult) {
            this.applyDrag(dragResult, true)
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




