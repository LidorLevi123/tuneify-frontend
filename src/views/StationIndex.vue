<template>
    <section class="station-main-container">
        <Nav />
        <MainHeader />
        <RouterView class="router" />
        <Player />
    </section>
</template>

<script>
import Player from '../cmps/Player.vue'
import Nav from '../cmps/Nav.vue'
import MainHeader from '../cmps/MainHeader.vue'

export default {

    components: {
        Player,
        Nav,
        MainHeader
    }
}

</script>

<style>
.router {
    grid-column: 2;
    grid-row: 1;
}
</style>