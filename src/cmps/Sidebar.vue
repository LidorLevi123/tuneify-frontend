<template>
    <section class="sidebar-list-container">
        <section class="sidebar-top">
            <button class="collapse btn"><span v-icon="'collapse'"></span>
                <div class="one">Your Library</div>
            </button>
            <button @click="addStation" title="Create playlist" class="add-station btn"><span
                    v-icon="'createList'"></span></button>
        </section>
        <LibraryStationList :libraryStations="libraryStations" />
    </section>
</template>

<script>
import { stationService } from '../services/station.service.local';
import LibraryStationList from './LibraryStationList.vue';

export default {
    data() {
        return {
            canAddStation: true
        }
    },

    methods: {
        async addStation() {
            if(!this.canAddStation) return
            
            this.canAddStation = false
            const stationToSave = stationService.getEmptyStation()

            stationToSave.name = 'My Playlist #' + (this.libraryStations.length + 1)
            stationToSave.imgUrl = 'https://picsum.photos/' + (this.libraryStations.length + 232)

            const station = await this.$store.dispatch({ type: 'saveStation', stationToSave })
            this.$router.push(`/station/${station._id}`)
            this.canAddStation = true
        },
    },

    computed: {
        libraryStations() {
            return this.$store.getters.library
        }
    },

    components: { LibraryStationList }
}

</script>

