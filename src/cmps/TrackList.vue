<template>
    <section class="track-list">
        <Container dragClass="dragging" >
            <div class="list-header track-preview-layout">
                <span>#</span>
                <span>Title</span>
                <span>Album</span>
                <span>Date added</span>
                <span v-icon="'clock'"></span>
            </div>
            <hr />
            <ul v-if="station?.tracks" class="clean-list">
                <Draggable v-for="(track, idx) in station.tracks" :key="track.id" :elementData="track" :draggable="true"
                    @drop="onDrop">
                    <li @click="onTrackClicked(idx)">
                        <TrackPreview @track-add="onAddTrack" @track-remove="onRemoveTrack" @track-like="onLikeTrack"
                            @track-dislike="onDislikeTrack" :track="track" :trackIdx="idx" />
                    </li>
                </Draggable>
            </ul>
        </Container>
    </section>
</template>

<script>
import TrackPreview from './TrackPreview.vue'

import { Container, Draggable } from 'vue3-smooth-dnd'



export default {
    props: {
        station: { type: Object },
    },
    data() {
        return {
        }
    },
    methods: {
        onDrop({ removedIndex, addedIndex }) {
            if (removedIndex !== null && addedIndex !== null) {
                console.log('addedIndex', addedIndex)
                console.log('removedIndex', removedIndex)
                const tracksCopy = [...this.station.tracks]
                const [removedTrack] = tracksCopy.splice(removedIndex, 1)
                tracksCopy.splice(addedIndex, 0, removedTrack)

                const updatedStation = { ...this.station, tracks: tracksCopy }
                console.log('updatedStation', updatedStation)
                this.updateStation(updatedStation)
            }
        },
        async updateStation(updatedStation) {
            try {
                await this.$store.dispatch({ type: 'saveStation', stationToSave: updatedStation })
                this.onCloseModal()
            } catch (err) {
                console.log(err.message)
            }
        },
        shouldAcceptDrop(sourceContainerOptions, payload) {
            return sourceContainerOptions.groupName === "track-list";
        },
        onDragStart(dragResult) {
            console.log("Drag started!", dragResult)
        },
        onDragEnd(dragResult) {
            console.log("Drag ended!", dragResult)
        },
        onDragEnter(dragResult) {
            console.log("Drag ended!", dragResult)
        },
        getChildPayload (index) {
            console.log('index', index)
        return {
            // generate custom payload data here
         }
        },

        onTrackClicked(trackIdx) {
            this.$emit('track-clicked', trackIdx)
        },
        onAddTrack(track, stationId) {
            this.$emit('track-add', track, stationId)
        },
        onRemoveTrack(track) {
            this.$emit('track-remove', track)
        },
        onLikeTrack(track) {
            this.$emit('track-like', track)
        },
        onDislikeTrack(track) {
            this.$emit('track-dislike', track)
        },
    },

    components: {
        TrackPreview,
        Container,
        Draggable,
    },

    name: 'TrackList',
}
</script>


