<template>
    <section class="sidebar-list-container">
        <section class="sidebar-top">
            <button class="collapse"><span v-icon="'collapse'"></span>
                <div class="one">Your Library</div>
            </button>
            <button v-icon="'createList'" @click="addStation" title="Create playlist" class="add-station"></button>
        </section>
        <LibraryStationList @station-remove="removeStation" :libraryStations="libraryStations" />
    </section>
</template>

<script>
import { showSuccessMsg } from '../services/event-bus.service';

import { stationService } from '../services/station.service'
import LibraryStationList from './LibraryStationList.vue';

export default {
    data() {
        return {
            canAddStation: true,
            addedStationIdx: 1
        }
    },

    methods: {
        async addStation() {
<<<<<<< HEAD
            if (!this.canAddStation) return

            this.canAddStation = false
            const stationToSave = stationService.getEmptyStation()

            stationToSave.name = 'My Playlist #' + (this.libraryStations.length)
            stationToSave.imgUrl = 'https://picsum.photos/' + (this.libraryStations.length + 232)
            stationToSave.owner = this.loggedinUser

=======
>>>>>>> 372b9fa57252eb53528c391ccf36e14e4caee04b
            try {

                if (!this.canAddStation) return
    
                this.canAddStation = false
                const stationToSave = stationService.getEmptyStation()
    
                stationToSave.name = 'My Playlist #' + this.addedStationIdx++
                stationToSave.imgUrl = 'https://picsum.photos/' + (this.libraryStations.length + 232)

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
        }
    },
    computed: {
        libraryStations() {
            return this.$store.getters.libraryStations
        },
        loggedinUser() {
            return this.$store.getters.loggedinUser
        },
    },

    components: { LibraryStationList }
}

</script>

