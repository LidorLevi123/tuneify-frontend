<template>
    <section v-if="stationToEdit" class="station-edit" ref="station-edit">
        <header>
            <h1>Edit details</h1>
            <span v-icon="'close'" @click="onCloseModal()"></span>
        </header>
        
        <div>
            <img :src="stationToEdit.imgUrl" alt="">
            <form>
                <!-- <legend>Name</legend> -->
                <input type="text" v-model="stationToEdit.name" placeholder="Add a name">

                <!-- <legend>Description</legend> -->
                <textarea v-model="stationToEdit.description" placeholder="Add an optional description"></textarea>
            </form>
        </div>

        <button @click="save" type="submit">Save</button>

        <small>By proceeding, you agree to give Tuneify access to the image you choose to upload. <br> 
            Please make sure you have the right to upload the image.
        </small>
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
            if (!stationId) return

            try {
                this.stationToEdit = await stationService.getById(stationId)
            } catch (err) {
                console.log('Cannot load station for edit', err.message)
                this.$router.push('/')
            }
        },
        async save() {
            try {
                await this.$store.dispatch({ type: 'saveStation', stationToSave: this.stationToEdit })
                console.log('Station Saved');
                this.stationToEdit = stationService.getEmptyStation()
                this.onCloseModal()
            } catch (err) {
                console.log(err.message);
            }
        },
        onCloseModal() {
            document.body.classList.remove('modal-open')
        }
    },

    computed: {
        stationId() {
            return this.$route.params
        }
    },

    watch: {
        stationId() {
            this.loadStationToEdit()
        },
    }

}

</script>