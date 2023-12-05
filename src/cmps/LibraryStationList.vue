<template>
    <section v-if="libraryStations" class="library-station-list">
        <ul class="clean-list">

            <Container dragClass="dragging" @drop="onDrop" :animation-duration="100" drag-class="dragged-item"
                :style="gridStyle">
                <Draggable v-for="station in libraryStations" :key="station._id">

                    <li @click="goToDetails(station)" :class="{ active: stationActive(station) }"
                        @contextmenu.prevent="showContextMenu(station._id, $event)">
                        <LibraryStationPreview :station="station" :query="query" @playStation="playStation" />

                        <div v-if="contextMenuOpenMap[station._id] && station.name !== 'Liked Songs'" class="context-menu"
                            v-clickOutside="() => contextMenuOpenMap[station._id] = false"
                            :style="{ top: contextmenuTop + 'px', left: contextmenuLeft + 'px' }">
                            <div v-if="station.owner._id" class="menu-item" @click.stop="emitEditStation(station._id)">
                                <span v-icon="`edit`"></span>
                                Edit details
                            </div>
                            <div class="menu-item" @click.stop="removeStation(station)">
                                <span v-if="!station.owner._id" v-icon="'greenVee'"></span>
                                <span v-else v-icon="'delete'"></span>
                                {{ station.owner._id ? 'Delete' : 'Remove from Library' }}
                            </div>
                            <div class="menu-item" @click.stop="emitAddStation(station._id)">
                                <span v-icon="'create'"></span>
                                Create playlist
                            </div>
                            <hr>
                            <div class="menu-item" @click.stop="copyLink(station)">
                                <span v-icon="'copy'"></span>
                                Copy link to {{ station.isAlbum ? 'album' : station.isArtist ? 'artist' : 'playlist' }}
                            </div>
                        </div>

                        <span class="speaker" v-icon="`speaker`"
                            v-if="currStation?._id === station._id && trackPlaying && libraryView !== 'grid' && !sidebarCollapsed"></span>
                    </li>

                </Draggable>
            </Container>
        </ul>
    </section>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import LibraryStationPreview from './LibraryStationPreview.vue'
import { userService } from '../services/user.service'

export default {
    name: 'LibraryStationList',
    props: {
        libraryStations: { type: Array, required: true },
        query: { type: String },
    },
    data() {
        return {
            contextMenuOpenMap: {},
        }
    },
    methods: {
        fixActionRestriction() {
            document.body.classList.remove(
                "smooth-dnd-no-user-select",
                "smooth-dnd-disable-touch-action"
            )
        },
        onDrop(dropResult) {
            this.applyDrag(dropResult)
        },
        async applyDrag(dragResult) {

            const { removedIndex, addedIndex, payload } = dragResult

            let itemToAdd = payload

            if (removedIndex !== null) {
                itemToAdd = this.libraryStations.splice(removedIndex, 1)[0]
            }

            if (addedIndex !== null) {
                this.libraryStations.splice(addedIndex, 0, itemToAdd)
            }

            const userStationsIds = this.libraryStations.map(station => station._id)
            const likedIdx = this.libraryStations.findIndex(station => station._id === this.user.likedId)

            userStationsIds.splice(likedIdx, 1)

            try {
                await userService.updateUserStations(this.user, userStationsIds, 'update')
            }
            catch (err) {
                console.log(err)
            }
        },
        removeStation(stationId) {
            this.$emit('station-remove', stationId)
        },
        goToDetails(station) {
            const stationId = station.spotifyId ? station.spotifyId : station._id
            if (station.isAlbum) this.$router.push(`/album/${stationId}`)
            else if (station.isArtist) this.$router.push(`/artist/${stationId}`)
            else this.$router.push(`/station/${stationId}`)
        },
        showContextMenu(stationId, ev) {
            for (const id in this.contextMenuOpenMap) {
                if (id !== stationId && this.contextMenuOpenMap[id]) this.contextMenuOpenMap[id] = false
            }

            this.contextmenuLeft = ev.clientX
            this.contextmenuTop = ev.clientY + 5
            this.contextMenuOpenMap[stationId] = true
        },
        closeContextMenu(stationId) {
            this.contextMenuOpenMap[stationId] = false
        },
        stationActive(station) {
            if (!this.$route.params.stationId) return false
            else return this.$route.params.stationId === station._id || this.$route.params.stationId === station.spotifyId
        },
        playStation(station) {
            this.$emit('playStation', station)
        },
        async copyLink(station) {
            this.$emit('copyLink', station)
        },
        emitAddStation() {
            this.$emit('addStation')
        },
        emitEditStation(stationId) {
            this.$emit('editStation', stationId)
        }
    },

    computed: {
        columnCount() {
            if (this.gridMode === '1') return 5
            if (this.gridMode === '2') return 4
            if (this.gridMode === '3') return 3
            if (this.gridMode === '4') return 2
        },
        libraryView() {
            return this.$store.getters.libraryView.view
        },
        gridMode() {
            return this.$store.getters.libraryView.gridMode
        },
        currStation() {
            return this.$store.getters.currStation
        },
        user() {
            return this.$store.getters.loggedinUser
        },
        trackPlaying() {
            return this.$store.getters.isCurrTrackPlaying
        },
        sidebarCollapsed() {
            return this.$store.getters.sidebarCollapsed
        },
        gridStyle() {
            if (this.libraryView === 'grid') return {
                display: 'grid',
                gridTemplateColumns: `repeat(${this.columnCount}, minmax(0, 1fr))`,
            }
        }
    },

    components: {
        LibraryStationPreview,
        Container,
        Draggable,
    },
}
</script>