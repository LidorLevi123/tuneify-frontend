<template>
    <section v-if="stationToEdit" class="station-edit" ref="station-edit">
        <header>
            <h1>Edit details</h1>
            <span v-icon="'close'" @click="onCloseModal()"></span>
        </header>
        <section class="edit">
            <label>
                <input type="file" @click="handleFile" hidden>
                <img class="album-image" :src="stationToEdit?.imgUrl" alt="">
            </label>
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
import { showErrorMsg } from '../services/event-bus.service'
import { stationService } from '../services/station.service.local'
import { uploadService } from '../services/upload.service'

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
            try {
                const station = await stationService.getById(this.stationId)
                this.stationToEdit = station
            } catch (err) {
                showErrorMsg('Could not save station')
            }
        },

        async save() {
            try {
                const station = await this.$store.dispatch({ type: 'saveStation', stationToSave: this.stationToEdit })
                this.$store.commit({ type: 'setCurrStation', station })
                this.onCloseModal()
            } catch (err) {
                console.log(err.message)
            }
        },
        onCloseModal() {
            document.body.classList.remove('modal-open')
        },
        async handleFile(ev) {
            const { url } = await uploadService.uploadImg(ev)
            console.log(url);
            this.stationToEdit.imgUrl = url
        }
    },

    computed: {
        stationId() {
            return this.$route.params.stationId
        },
    },

    watch: {
        stationId() {
            if (!this.stationId) return
            this.loadStationToEdit()
        },
    }

}

</script>