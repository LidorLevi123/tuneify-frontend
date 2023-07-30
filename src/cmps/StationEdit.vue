<template>
    <section v-if="stationToEdit" class="station-edit" ref="station-edit">
        <header>
            <h1>Edit details</h1>
            <span v-icon="'close'" @click="onCloseModal()"></span>
        </header>
        <section class="edit">

            <img class="album-image" :src="stationToEdit.imgUrl" alt="">

            <input class="title" type="text" v-model="stationToEdit.name" placeholder="Add a name">

            <textarea v-model="stationToEdit.description" placeholder="Add an optional description"></textarea>


            <button class="save-btn" @click="save" type="submit">Save</button>

            <small class="disclaimer">By proceeding, you agree to give Tuneify access to the image you choose to upload.
                Please make sure you have the right to upload the image.
            </small>
        </section>
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
        // Fix this workaround later
        loadStationToEdit() {
            setTimeout(() => {
                this.stationToEdit = JSON.parse(JSON.stringify(this.$store.getters.currStation))
            }, 500)
        },
        async save() {
            try {
                await this.$store.dispatch({ type: 'saveStation', stationToSave: this.stationToEdit })
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