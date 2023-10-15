<template>
    <section class="backdrop" @click="onCloseModal"></section>
</template>

<script>
export default {
    methods: {
        onCloseModal() {
            document.body.classList.remove('se-modal-open')
            document.body.classList.remove('ad-modal-open')
            document.body.classList.remove('ue-modal-open')
        }
    }
}
</script>