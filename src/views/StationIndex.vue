<template>
    <section class="station-main-container">
        <Header />
        <RouterView />
        <!-- <Player /> -->
    </section>
</template>

<script>
import Player from '../cmps/Player.vue'
import Header from '../cmps/Header.vue'
import Sidebar from '../cmps/Sidebar.vue'

export default {

    components: {
        Player,
        Header,
        Sidebar
    }
}

</script>