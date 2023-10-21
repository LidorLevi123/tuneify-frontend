<template>
    <section v-if="libraryStations" class="library-station-list">
        <ul class="clean-list">
            <li @click="goToDetails(station)" @contextmenu.prevent="showContextMenu(station._id, $event)"
                v-for="station in libraryStations" :key="station._id">
                <LibraryStationPreview :station="station" />
                <div v-if="contextMenuOpenMap[station._id]" class="dlt-btn" @click="removeStation(station, $event)"
                    @mouseleave="closeContextMenu(station._id)"
                    :style="{ top: contextmenuTop + 'px', left: contextmenuLeft + 'px' }">
                    <div class="menu-item">Remove playlist</div>
                </div>
                <span class="speaker" v-icon="`speaker`" v-if="currStation?._id === station._id && trackPlaying"
                    :style="{ display: sidebarCollapsed ? 'none' : 'block' }"></span>
            </li>
        </ul>
    </section>
</template>

<script>
import LibraryStationPreview from './LibraryStationPreview.vue'

export default {
    data() {
        return {
            contextMenuOpenMap: {}
        }
    },
    computed: {
        currStation() {
            return this.$store.getters.currStation
        },
        user() {
            return this.$store.getters.loggedinUser
        },
        trackPlaying() {
            return this.$store.getters.isCurrTrackPlaying
        },
        libraryStations() {
            return this.$store.getters.libraryStations
        },
        sidebarCollapsed() {
            return this.$store.getters.sidebarCollapsed
        }
    },

    methods: {
        removeStation(stationId, ev) {
            ev.stopPropagation()
            this.$emit('station-remove', stationId)
        },
        goToDetails(station) {
            const stationId = station.spotifyId ? station.spotifyId : station._id
            this.$router.push(`/station/${stationId}`)
        },
        showContextMenu(stationId, ev) {
            this.contextmenuLeft = ev.clientX
            this.contextmenuTop = ev.clientY
            this.contextMenuOpenMap[stationId] = true
        },
        closeContextMenu(stationId) {
            this.contextMenuOpenMap[stationId] = false
        }
    },

    components: {
        LibraryStationPreview,
    },

    name: 'LibraryStationList',
}
</script>