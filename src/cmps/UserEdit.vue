<template>
    <section v-if="user" class="user-edit" ref="user-edit">
        <header>
            <h1>Profile details</h1>
            <span v-icon="'close'" @click="onCloseModal()"></span>
        </header>
        <section class="edit">
            <label>
                <input type="file" @change="handleFile" hidden>
                <img class="user-image" :src="userToEdit.imgUrl" ref="userImg" alt="" @mouseover="imageIsHovered = true"
                    @mouseleave="imageIsHovered = false">
                <button v-if="this.userToEdit.imgUrl" @click.stop="removeImg" class="remove-img-btn"
                    :style="{ opacity: imageIsHovered ? '1' : '0' }" @mouseover="imageIsHovered = true">Remove
                    photo</button>
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
            imageIsHovered: false
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
            if (this.user.fullname === 'Guest') return showErrorMsg('Can not edit guest user, please logout and sign in')
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
            console.log('image url', url)
            this.userToEdit.imgUrl = url
        },
        removeImg() {
            this.userToEdit.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png'
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