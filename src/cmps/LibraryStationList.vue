<template>
    <section class="library-station-list">
        <ul class="clean-list">
            <li @click="goToDetails(station._id)" v-for="station in libraryStations" :key="station.id">
                <LibraryStationPreview :station="station" />
                <button v-if="station._id !== 'liked101'" @click="removeStation(station._id, $event)">
                    ❌
                </button>
            </li>
        </ul>
    </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import LibraryStationPreview from './LibraryStationPreview.vue'

export default {
    props: {
        libraryStations: { type: Array },
    },

    data() {
        return {
            canRemoveStation: true
        }
    },

    computed: {
        currStation() {
            return this.$store.getters.currStation
        },
    },

    methods: {
        async removeStation(stationId, ev) {
            ev.stopPropagation()
            if (!this.canRemoveStation) return
            this.canRemoveStation = false

            try {
                await this.$store.dispatch({ type: 'removeStation', stationId })
                if (stationId === this.$route.params.stationId &&
                    this.currStation.owner !== 'Tuneify') this.$router.push('/')

                showSuccessMsg('Removed from Your Library')
                this.canRemoveStation = true
            } catch (err) {
                showErrorMsg('Could not remove station')
            }

        },
        goToDetails(stationId) {
            this.$router.push(`/station/${stationId}`)
        }
    },

    components: {
        LibraryStationPreview,
    },

    name: 'LibraryStationList',
}
</script>