<template>
    <section class="main-container">
        <StationList v-if="stations" :stations="stations" />
    </section>
</template>

<script>
import StationList from '../cmps/StationList.vue'

export default {
    created() {
        this.loadStations()
    },

    computed: {
        stations() {
            return this.$store.getters.stations
        }
    },

    methods: {
        loadStations() {
            this.$store.dispatch({type: 'loadStations'})
        }
    },

    components: {
        StationList
    }
}

</script>

<!-- <template>
    <div class="container home">
        <ul class="station-list">
            <li v-for="station in stations" :key="station._id">
                <p>
                    {{ station.vendor }}
                </p>
                <p>
                    ${{ station.price?.toLocaleString() }}
                </p>
                <button @click="removeStation(station._id)">x</button>
                <button @click="updateStation(station)">Update</button>
                <hr />
                <button @click="addStationMsg(station._id)">Add station msg</button>
                <button @click="printStationToConsole(station)">Print msgs to console</button>
            </li>
        </ul>
        <hr />
        <form @submit.prevent="addStation()">
            <h2>Add station</h2>
            <input type="text" v-model="stationToAdd.vendor" />
            <button>Save</button>
        </form>
    </div>
</template>
  
<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
// import {stationService} from '../services/station.service.local'
// import { getActionRemoveStation, getActionUpdateStation, getActionAddStationMsg } from '../store/station.store'
export default {
    data() {
        return {
            stationToAdd: stationService.getEmptyStation()
        }
    },
    computed: {
        // loggedInUser() {
        //   return this.$store.getters.loggedinUser
        // },
        stations() {
            return this.$store.getters.stations
        }
    },
    created() {
        this.$store.dispatch({ type: 'loadStations' })
    },
    methods: {
        async addStation() {
            try {
                await this.$store.dispatch({ type: 'addStation', station: this.stationToAdd })
                showSuccessMsg('Station added')
                this.stationToAdd = stationService.getEmptyStation()
            } catch (err) {
                console.log(err)
                showErrorMsg('Cannot add station')
            }
        },
        async removeStation(stationId) {
            try {
                await this.$store.dispatch(getActionRemoveStation(stationId))
                showSuccessMsg('Station removed')

            } catch (err) {
                console.log(err)
                showErrorMsg('Cannot remove station')
            }
        },
        async updateStation(station) {
            try {
                station = { ...station }
                station.price = +prompt('New price?', station.price)
                await this.$store.dispatch(getActionUpdateStation(station))
                showSuccessMsg('Station updated')

            } catch (err) {
                console.log(err)
                showErrorMsg('Cannot update station')
            }
        },
        // async addStationMsg(stationId) {
        //   try {
        //     await this.$store.dispatch(getActionAddStationMsg(stationId))
        //     showSuccessMsg('Station msg added')
        //   } catch(err) {
        //     console.log(err)
        //     showErrorMsg('Cannot add station msg')
        //   }
        // },
        // printStationToConsole(station) {
        //   console.log('Station msgs:', station.msgs)
        // }
    }
}
</script>
   -->



   