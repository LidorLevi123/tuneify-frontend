<template>
    <section v-if="libraryStations" class="library-station-list">
        <ul class="clean-list">

            <Container dragClass="dragging" @drop="onDrop" :animation-duration="100" drag-class="dragged-item"
                :style="gridStyle">
                <Draggable v-for="station in libraryStations" :key="station._id">

                    <li @click="goToDetails(station)" :class="{ active: stationActive(station) }"
                        @contextmenu.prevent="showContextMenu(station._id, $event)">
                        <LibraryStationPreview :station="station" :gridMode="gridMode" />
                        <div v-if="contextMenuOpenMap[station._id]" class="dlt-btn" @click="removeStation(station, $event)"
                            @mouseleave="closeContextMenu(station._id)"
                            :style="{ top: contextmenuTop + 'px', left: contextmenuLeft + 'px' }">
                            <div class="menu-item">Remove playlist</div>
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
        gridMode: { required: true },
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
        removeStation(stationId, ev) {
            ev.stopPropagation()
            this.$emit('station-remove', stationId)
        },
        goToDetails(station) {
            const stationId = station.spotifyId ? station.spotifyId : station._id
            if (station.isAlbum) this.$router.push(`/album/${stationId}`)
            else if (station.isArtist) this.$router.push(`/artist/${stationId}`)
            else this.$router.push(`/station/${stationId}`)
        },
        showContextMenu(stationId, ev) {
            this.contextmenuLeft = ev.clientX - 100
            this.contextmenuTop = ev.clientY - 300
            this.contextMenuOpenMap[stationId] = true
        },
        closeContextMenu(stationId) {
            this.contextMenuOpenMap[stationId] = false
        },
        stationActive(station) {
            if (!this.$route.params.stationId) return false
            else return this.$route.params.stationId === station._id || this.$route.params.stationId === station.spotifyId
        },
    },

    computed: {
        columnCount() {
            if (this.gridMode === '1') return 5
            if (this.gridMode === '2') return 4
            if (this.gridMode === '3') return 3
            if (this.gridMode === '4') return 2
        },
        libraryView() {
            return this.$store.getters.libraryView
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