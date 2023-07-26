<template>
    <section v-if="stationToEdit" class="station-edit">
        <h1>Edit Station</h1>
        <form @submit.prevent="save">
            <label>
                <span>Name: </span>
                <input type="text" v-model="stationToEdit.name" placeholder="Enter Name...">
            </label>
            <label>
                <span>Description: </span>
                <input type="text" v-model="stationToEdit.description" placeholder="Enter description...">
            </label>
            <div class="actions">
                <button type="submit">Save</button>
            </div>
        </form>
    </section>
</template>

<script>
import { stationService } from '../services/station.service.local'

export default {
    data() {
        return {
            stationToEdit: null,
        }
    },

    created() {
        this.loadStationToEdit()
    },

    methods: {
        async loadStationToEdit() {
            const { stationId } = this.$route.params
            if(!stationId) return

            try {
                this.stationToEdit = await stationService.getById(stationId)
            } catch (err) {
                console.log('Cannot load station for edit', err.message)
                this.$router.push('/')
            }
        },
        async save() {
            try {
                await this.$store.dispatch({type: 'saveStation', stationToSave: this.stationToEdit})
                console.log('Station Saved');
                this.stationToEdit = stationService.getEmptyStation()
            } catch (err) {
                console.log(err.message);
            }
		},
    },
    
}

</script>