<template>
    <section v-if="user" class="user-edit" ref="user-edit">
        <header>
            <h1>Profile details</h1>
            <span v-icon="'close'" @click="onCloseModal()"></span>
        </header>
        <section class="edit">
            <label>
                <input type="file" @change="handleFile" hidden>
                <img class="album-image" :src="userToEdit.imgUrl" ref="userImg" alt="">
            </label>
            <input class="fullname" type="text" v-model="userToEdit.fullname" placeholder="Add a display name" required>
            <button class="save-btn" @click="save" type="submit">Save</button>

            <small class="disclaimer">By proceeding, you agree to give Tuneify access to the image you choose to upload.
                Please make sure you have the right to upload the image.
            </small>
        </section>
    </section>
</template>

<script>
import { uploadService } from '../services/upload.service'
import { showErrorMsg } from '../services/event-bus.service'

export default {
    data() {
        return {
            userToEdit: null,
        }
    },
    created() {
        this.loadUserToEdit()
    },
    methods: {
        loadUserToEdit() {
            this.userToEdit = JSON.parse(JSON.stringify(this.user))
        },
        async save() {
            if (!this.userToEdit.fullname) {
                showErrorMsg('Please add a display name')
                return
            }
            try {
                await this.$store.dispatch({ type: 'updateUser', user: this.userToEdit })
                this.onCloseModal()
            } catch (err) {
                console.log(err.message)
            }
        },
        onCloseModal() {
            document.body.classList.remove('ue-modal-open')
        },
        async handleFile(ev) {
            const { url } = await uploadService.uploadImg(ev)
            this.userToEdit.imgUrl = url
        }
    },
    computed: {
        user() {
            return this.$store.getters.loggedinUser
        },
    },
    watch: {
        user() {
            this.loadUserToEdit()
        }
    }
}

</script>