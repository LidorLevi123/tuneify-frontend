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
    created() {
        this.CreateLikedSongsStation()
    },

    methods: {
        async addStation() {
            if (!this.canAddStation) return

            this.canAddStation = false
            const stationToSave = stationService.getEmptyStation()

            stationToSave.name = 'My Playlist #' + (this.libraryStations.length + 1)
            stationToSave.imgUrl = 'https://picsum.photos/' + (this.libraryStations.length + 232)

            const station = await this.$store.dispatch({ type: 'saveStation', stationToSave })
            this.$router.push(`/station/${station._id}`)
            this.canAddStation = true
        },
        async CreateLikedSongsStation() {
            const libraryStations = this.libraryStations
            const likedSongsExists = libraryStations.some(station => station.name === 'Liked Songs')

            if (!likedSongsExists) {
                const stationToSave = stationService.getEmptyStation()
                stationToSave.name = 'Liked Songs'
                stationToSave.imgUrl = 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png'

                try {
                    await this.$store.dispatch({ type: 'saveStation', stationToSave });
                } catch (error) {
                    console.error('Error creating "Liked Songs" station:', error)
                    throw new Error('cannot create Liked Songs Station')
                }
            }
        }
    },
    computed: {
        libraryStations() {
            return this.$store.getters.library
        }
    },

    components: { LibraryStationList }
}

</script>

