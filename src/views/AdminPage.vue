<template>
    <section class="admin-page">
        <div class="admin-page-header">
            <h1>Admin Page</h1>
            <button class="print-btn" @click="printAllStations">Print all stations to console</button>
            <RouterLink to="/">
                <button class="back-btn">back to app</button>
            </RouterLink>
        </div>
        <section class="delete-stations">
            <span>Delete stations that contain the word:</span>
            <input type="text" v-model="stationNameToDelete">
            <button class="delete-btn" @click="removeStations(stationNameToDelete)">delete</button>
        </section>
        <section class="delete-stations">
            <span>Delete stations with id:</span>
            <input type="text" v-model="stationId">
            <button class="delete-btn" @click="removeStation(stationId)">delete</button>
        </section>
        <div class="user-list">
            <div v-for="user in users" :key="user._id" class="user-item">
                <div class="user-info">
                    <img @click="showUserDetails(user)" :src="user.imgUrl" alt="">
                    <div class="user-name">{{ user.fullname }}</div>
                    <button @click="removeUser(user)" class="remove-btn">Remove</button>
                </div>
            </div>
        </div>
        <pre>{{ user }}</pre>
    </section>
</template>

<script>
import { stationService } from '../services/station.service'
import { showSuccessMsg } from '../services/event-bus.service'
export default {
    name: 'AdminPage',
    data() {
        return {
            user: null,
            stationNameToDelete: null,
            stationId: null
        }
    },
    created() {
        this.$store.dispatch({ type: 'loadUsers' })
    },
    methods: {
        async removeUser(user) {
            const userStations = [...user.stationIds, user.likedId]
            if (confirm('Are you sure?')) {
                try {
                    userStations.forEach(stationId => this.$store.dispatch({ type: 'removeStation', stationId }))
                    this.$store.dispatch({ type: 'removeUser', userId: user._id })
                }
                catch (err) {
                    console.error('Cannot remove user', err)
                    throw err
                }
            }
        },
        showUserDetails(user) {
            this.user = user
        },
        async printAllStations() {
            const stations = await stationService.getAllStations()
            console.log(stations)
        },
        async removeStations(name) {
            if (!name) return showSuccessMsg('Must enter name in input')
            if (confirm(`Are you sure you want to delete all stations containnig ${name}?`)) {
                try {
                    const stationRemovedNum = await stationService.removeStationsByName(name)
                    showSuccessMsg(`Removed ${stationRemovedNum} stations`)
                    this.stationNameToDelete = null
                } catch (err) {
                    console.error(`Cannot remove stations containing ${name}`, err)
                    throw err
                }
            }
        },
        async removeStation(stationId) {
            if (!stationId) return showSuccessMsg('Must enter id in input')
            if (confirm(`Are you sure you want to delete station with id ${stationId}?`)) {
                try {
                    await this.$store.dispatch({ type: 'removeStation', stationId })
                    showSuccessMsg(`Removed ${stationId} station`)
                    this.stationId = null
                } catch (err) {
                    console.error(`Cannot remove station with id ${stationId}`, err)
                    throw err
                }
            }
        }
    },
    computed: {
        users() {
            return this.$store.getters.users
        }
    }
}
</script>
