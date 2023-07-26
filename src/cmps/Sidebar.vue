<template>
    <section class="sidebar-list-container">
        <section class="sidebar-top">
            <button class="collapse btn">
                <svg role="img" height="24" width="24" aria-hidden="true" viewBox="0 0 24 24" data-encore-id="icon"
                    class="Svg-sc-ytk21e-0 haNxPq">
                    <path class="icon"
                        d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"
                        fill="#b3b3af">
                    </path>
                </svg>
                <div class="one">Your Library</div>
            </button>
            <button @click="addStation" title="Create playlist" class="add-station btn"><svg role="img" height="16"
                    width="16" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon">
                    <path class="plus-icon"
                        d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"
                        fill="#b3b3af">
                    </path>
                </svg>
            </button>
        </section>
        <LibraryStationList :libraryStations="libraryStations" />
    </section>
</template>

<script>
import { stationService } from '../services/station.service.local';
import LibraryStationList from './LibraryStationList.vue';

export default {
    methods: {
        async addStation() {
            const stationToSave = stationService.getEmptyStation()
            const station = await this.$store.dispatch({ type: 'saveStation', stationToSave })
            this.$router.push(`/station/${station._id}`)
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

