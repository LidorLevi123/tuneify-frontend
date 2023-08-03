<template>
    <section class="library-station-list">
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
import { toHandlers } from 'vue'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
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
        async removeStation(stationId, ev) {
            ev.stopPropagation()
            try {
                await this.$store.dispatch({ type: 'removeStation', stationId })
                await this.$store.dispatch({ type: 'updateUserStations', stationId, action: 'remove' })
                if (stationId === this.$route.params.stationId) this.$router.push('/')
                this.contextmenuOpen = false
                showSuccessMsg('Removed from Your Library')
            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not remove station')
            }

        },
        goToDetails(stationId) {
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