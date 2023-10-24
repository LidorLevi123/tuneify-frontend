<template>
    <section v-if="stationToEdit" class="station-edit" ref="station-edit">
        <header>
            <h1>Edit details</h1>
            <span v-icon="'close'" @click="onCloseModal()"></span>
        </header>
        <section class="edit">
            <label>
                <input type="file" @change="handleFile" hidden>
                <img class="album-image" :src="imgUrl" ref="stationImg" alt="" @mouseover="imageIsHovered = true"
                    @mouseleave="imageIsHovered = false">
                <button v-if="this.stationToEdit.imgUrl" v-icon="`moreOptionsSmall`" class="station-img-btn"
                    :style="{ opacity: imageIsHovered ? 1 : 0 }" @click.prevent="openMenu"
                    @mouseover="imageIsHovered = true"></button>
                <div class="menu" v-if="menuOpen">
                    <div class="menu-item" @click.prevent="removeImg" v-clickOutside="openMenu">Remove photo</div>
                </div>
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
import { eventBus, showErrorMsg } from '../services/event-bus.service'
import { stationService } from '../services/station.service'
import { uploadService } from '../services/upload.service'

export default {
    data() {
        return {
            stationToEdit: null,
            menuOpen: false,
            imageIsHovered: false
        }
    },

    created() {
        this.loadStationToEdit()
        eventBus.on('track-add', this.loadStationToEdit)
    },

    unmounted() {
        eventBus.off('track-add', this.loadStationToEdit)
    },

    methods: {
        async loadStationToEdit() {
            try {
                const station = await stationService.getById(this.stationId)
                this.stationToEdit = station
            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not save station')
            }
        },

        async save() {
            try {
                const station = await this.$store.dispatch({ type: 'saveStation', stationToSave: this.stationToEdit })
                this.stationToEdit = JSON.parse(JSON.stringify(station))
                this.$emit('station-edit')
                eventBus.emit('loadLibrary')
                this.onCloseModal()
            } catch (err) {
                console.log(err.message)
            }
        },
        onCloseModal() {
            document.body.classList.remove('se-modal-open')
        },
        async handleFile(ev) {
            const { url } = await uploadService.uploadImg(ev)
            console.log('image url', url)
            this.stationToEdit.imgUrl = url
        },
        openMenu() {
            this.menuOpen = !this.menuOpen
        },
        removeImg() {
            this.stationToEdit.imgUrl = ''
            this.menuOpen = false
        }
    },

    computed: {
        stationId() {
            return this.$route.params.stationId
        },
        imgUrl() {
            return this.stationToEdit?.imgUrl || this.stationToEdit?.tracks[0]?.imgUrl || 'https://res.cloudinary.com/dys1sj4cd/image/upload/v1691338579/def-pl-fotor-202308061976_hbckqs.png'
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