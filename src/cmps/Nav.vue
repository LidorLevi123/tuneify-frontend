<template>
    <section class="nav-container">
        <nav>
            <RouterLink to="/">
                <div :class="{ 'isActive': $route.path === '/' }">
                    <span v-if="$route.path === '/'" v-icon="'homeActive'"></span>
                    <span v-else v-icon="'home'"></span>
                    Home
                </div>
            </RouterLink>
            <RouterLink to="/search">
                <div :class="{ 'isActive': $route.path === '/search' }">
                    <span v-if="$route.path === '/search'" v-icon="'searchActive'"></span>
                    <span v-else v-icon="'search'"></span>
                    Search
                </div>
            </RouterLink>
        </nav>
        <Sidebar />
    </section>
    <nav class="mobile-nav">
        <RouterLink class="nav-btn" to="/">
            <div :class="{ 'isActive': $route.path === '/' }" v-icon="'home'"></div>
        </RouterLink>
        <RouterLink class="nav-btn" to="/search">
            <div :class="{ 'isActive': $route.path === '/search' }" v-icon="'search'"></div>
        </RouterLink>
        <RouterLink class="nav-btn" to="/library">
            <div :class="{ 'isActive': $route.path === '/library' }" v-icon="'collapse'"></div>
        </RouterLink>
    </nav>
</template>

<script>
import Sidebar from './Sidebar.vue'

export default {
    components: {
        Sidebar
    }
}
</script>