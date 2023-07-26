<template>
    <section class="main-header-container">
        <nav>
            <RouterLink to="/">
                <div>
                    <span v-icon="'home'"></span>
                    Home
                </div>
            </RouterLink>
            <RouterLink to="/search">
                <div>
                    <span v-icon="'search'"></span>
                    Search
                </div>
            </RouterLink>
        </nav>
        <Sidebar />
    </section>
</template>

<script>
import Sidebar from './Sidebar.vue'

export default {
    components: {
        Sidebar
    }
}
</script>