<template>
    <section class="full-screen" style="background-color: blue;">
        <img :src="currTrack.imgUrl[0].url" alt="">
        <pre>{{ currTrack }}</pre>
    </section>
</template>

<script>


export default {
    computed: {
        currTrack() {
            return this.$store.getters.currTrack
        }
    },
}
</script>