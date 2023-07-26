<template>
    <section class="backdrop" @click="onCloseModal"></section>
</template>

<script>
export default {
    methods: {
        onCloseModal() {
            document.body.classList.remove('modal-open')
        }
    }
}
</script>