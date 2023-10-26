<template>
    <section class="nav-container">
        <nav>
            <RouterLink to="/">
                <div :class="{ 'isActive': $route.path === '/' }">
                    <span v-if="$route.path === '/'" v-icon="'homeActive'"></span>
                    <span v-else v-icon="'home'"></span>
                    <section v-if="!sidebarCollapsed">Home</section>
                </div>
            </RouterLink>
            <RouterLink to="/search">
                <div :class="{ 'isActive': $route.path === '/search' }">
                    <span v-if="$route.path === '/search'" v-icon="'searchActive'"></span>
                    <span v-else v-icon="'search'"></span>
                    <section v-if="!sidebarCollapsed">Search</section>
                </div>
            </RouterLink>
        </nav>
        <Sidebar />
    </section>
    <nav class="mobile-nav">
        <RouterLink class="nav-btn" to="/">
            <div :class="{ 'isActive': $route.path === '/' }" v-icon="'home'"></div>
            <small>Home</small>
        </RouterLink>
        <RouterLink class="nav-btn" to="/search">
            <div :class="{ 'isActive': $route.path === '/search' }" v-icon="'search'"></div>
            <small>Search</small>
        </RouterLink>
        <RouterLink class="nav-btn" to="/library">
            <div :class="{ 'isActive': $route.path === '/library' }" v-icon="'collapse'"></div>
            <small>Your Library</small>
        </RouterLink>
    </nav>
</template>

<script>
import Sidebar from './Sidebar.vue'

export default {

    computed: {
        sidebarCollapsed() {
            return this.$store.getters.sidebarCollapsed
        }
    },
    components: {
        Sidebar
    }
}
</script>