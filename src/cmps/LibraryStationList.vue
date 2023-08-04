<template>
    <section v-if="user" class="library-station-list">
        <ul class="clean-list">
            <li @click="goToDetails(station._id)" @contextmenu.prevent="showContextMenu(station._id, $event)"
                v-for="station in  libraryStations " :key="station.id">
                <LibraryStationPreview :station="station" />
                <div v-if="contextMenuOpenMap[station._id]" class="dlt-btn" @click="removeStation(station._id, $event)"
                    @mouseleave="closeContextMenu(station._id)"
                    :style="{ top: contextmenuTop + 'px', left: contextmenuLeft + 'px' }">
                    <div class="menu-item">Remove playlist</div>
                </div>
                <span class="speaker" v-icon="`speaker`" v-if="currStation?._id === station._id && trackPlaying"></span>
            </li>
        </ul>
    </section>
</template>

<script>
import LibraryStationPreview from './LibraryStationPreview.vue'

export default {
    props: {
        libraryStations: { type: Array },
    },
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
        }
    },

    methods: {
        removeStation(stationId, ev) {
            ev.stopPropagation()
            this.$emit('station-remove', stationId)
        },
        goToDetails(stationId) {
            stationId = stationId ? stationId : this.station.spotifyId
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