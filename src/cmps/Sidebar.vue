<template>
    <section class="sidebar-list-container">
        <section class="sidebar-top">
            <button class="collapse"><span v-icon="'collapse'"></span>
                <div class="one">Your Library</div>
            </button>
            <button @click="addStation" title="Create playlist" class="add-station btn"><span
                    v-icon="'createList'"></span></button>
        </section>
        <LibraryStationList :libraryStations="libraryStations" />
    </section>
</template>

<script>
import { showSuccessMsg } from '../services/event-bus.service';
// import { stationService } from '../services/station.service.local';
import { stationService } from '../services/station.service'
import LibraryStationList from './LibraryStationList.vue';

export default {
    data() {
        return {
            canAddStation: true
        }
    },

    methods: {
        async addStation() {
            if (!this.canAddStation) return

            this.canAddStation = false
            const stationToSave = stationService.getEmptyStation()

            stationToSave.name = 'My Playlist #' + (this.libraryStations.length)
            stationToSave.imgUrl = 'https://picsum.photos/' + (this.libraryStations.length + 232)
            stationToSave.owner = this.loggedinUser

            console.log(stationToSave);

            try {
                const station = await this.$store.dispatch({ type: 'saveStation', stationToSave })
                showSuccessMsg('Saved to Your Library')
                this.$router.push(`/station/${station._id}`)
            } catch (err) {
                console.log('Could not add station')
            } finally {
                this.canAddStation = true
            }
        },
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

