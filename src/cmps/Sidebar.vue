<template>
    <section class="sidebar-list-container" :style="{ width: sidebarWidth }">
        <section class="sidebar-top">
            <button class="collapse" @click="collapseSidebar">
                <span v-if="!sidebarCollapsed" v-icon="'collapse'"></span>
                <span v-else v-icon="'collapsed'"></span>
                <div :style="{ display: sidebarCollapsed ? 'none' : 'block' }">Your Library</div>
            </button>
            <button v-icon="'createList'" @click="addStation" title="Create playlist" class="add-station"
                :style="{ display: sidebarCollapsed ? 'none' : 'flex' }"></button>
        </section>
        <LibraryStationList @station-remove="removeStation" />
    </section>
</template>

<script>
import { showSuccessMsg } from '../services/event-bus.service';

import { stationService } from '../services/station.service'
import LibraryStationList from './LibraryStationList.vue';

export default {
    name: 'Sidebar',
    data() {
        return {
            canAddStation: true,
        }
    },

    methods: {
        async addStation() {
            try {

                if (!this.canAddStation) return

                this.canAddStation = false
                const stationToSave = stationService.getEmptyStation()

                stationToSave.name = 'My Playlist #' + this.libraryStations.length
                stationToSave.imgUrl = 'https://res.cloudinary.com/dys1sj4cd/image/upload/v1691338579/def-pl-fotor-202308061976_hbckqs.png'

                const station = await this.$store.dispatch({ type: 'saveStation', stationToSave })
                await this.$store.dispatch({ type: 'updateUserStations', stationId: station._id, action: 'add' })
                showSuccessMsg('Saved to Your Library')
                this.$router.push(`/station/${station._id}`)
            } catch (err) {
                console.log('Could not add station')
            } finally {
                this.canAddStation = true
            }
        },
        async removeStation(stationId) {
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
        collapseSidebar() {
            this.$store.commit('setSidebarCollapsed', true)
        }
    },

    computed: {
        libraryStations() {
            return this.$store.getters.libraryStations
        },
        sidebarCollapsed() {
            return this.$store.getters.sidebarCollapsed
        },
        sidebarWidth() {
            if (window.innerWidth < 890) return 'auto'
            else return this.sidebarCollapsed ? 'auto' : '412px'
        }
    },

    components: { LibraryStationList }
}

</script>

