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
            const station = document.querySelector('.station-header')
            const elMainHeader = document.querySelector('.main-header')
            const playBtn = document.querySelector('.play-btn-header')
            elMainHeader.style.backgroundColor = target.scrollTop > 50 ? '#121212' : 'transparent'
            playBtn.style.opacity = target.scrollTop > 50 ? '1' : '0'
            station.style.opacity = target.scrollTop > 50 ? '1' : '0'
        }
    },
    components: {
        Player,
        Nav,
        MainHeader
    }
}
</script>
