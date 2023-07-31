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
import { eventBus } from '../services/event-bus.service'

export default {
    methods: {
        handleScroll({ target }) {
            eventBus.emit('handleScroll', target)
        }
    },
    components: {
        Player,
        Nav,
        MainHeader
    }
}
</script>
