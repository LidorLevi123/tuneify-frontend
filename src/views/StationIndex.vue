<template>
    <section class="station-main-container">
        <Nav />
        <MainHeader :station="station" />
        <Loader v-if="isLoading" />
        <RouterView class="RouterView" @scroll="handleScroll" @station="setStation" v-else />
        <RightSidebar v-if="isRsbOpen" />
        <Player />
    </section>
</template>

<script>
import RightSidebar from '../cmps/RightSidebar.vue'
import Player from '../cmps/Player.vue'
import Nav from '../cmps/Nav.vue'
import MainHeader from '../cmps/MainHeader.vue'
import Loader from '../cmps/Loader.vue'
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
    computed: {
        isLoading() {
            return this.$store.getters.isLoading
        },
        isRsbOpen() {
            return this.$store.getters.isRsbOpen
        }
    },
    components: {
        Player,
        Nav,
        MainHeader,
        Loader,
        RightSidebar
    }
}
</script>
