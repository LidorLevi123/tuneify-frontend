<template>
    <section class="station-main-container">
        <Nav />
        <MainHeader :station="station" />
        <RouterView class="RouterView" @scroll="handleScroll" @station="setStation"/>
        <Player />
    </section>
</template>

<script>
import Player from '../cmps/Player.vue'
import Nav from '../cmps/Nav.vue'
import MainHeader from '../cmps/MainHeader.vue'
import { eventBus } from '../services/event-bus.service'

export default {

    data() {
        return {
            station: null
        }
    },

    methods: {
        handleScroll({ target }) {
            eventBus.emit('handleScroll', target)
        },
        setStation(station) {
            this.station = station
        }
    },
    components: {
        Player,
        Nav,
        MainHeader
    }
}
</script>
