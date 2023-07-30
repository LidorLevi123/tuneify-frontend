<template>
    <section class="station-main-container">
        <Nav />
        <MainHeader />
        <RouterView class="RouterView" @scroll="handleScroll" />
        <Player />
    </section>
</template>

<script>
import Player from '../cmps/Player.vue'
import Nav from '../cmps/Nav.vue'
import MainHeader from '../cmps/MainHeader.vue'

export default {
    methods: {
        handleScroll({ target }) {
            const elMainHeader = document.querySelector('.main-header')
            elMainHeader.style.backgroundColor = target.scrollTop > 1 ? '#121212' : 'transparent'
        }
    },
    components: {
        Player,
        Nav,
        MainHeader
    }
}
</script>
