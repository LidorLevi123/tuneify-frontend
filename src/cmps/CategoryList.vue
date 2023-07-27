<template>
    <section class="category-list">
        <ul v-if="categories" class="clean-list">
            <li v-for="category in categories" :key="category.id">
                <pre>{{ category.name }}</pre>
            </li>
        </ul>
    </section>
</template>

<script>
// import TrackPreview from './TrackPreview.vue'


export default {
    props: {
        categories: { type: Array },
    },

    // components: {
    //     TrackPreview,
    // },

    name: 'CategorykList',
}
</script>

<style lang="scss" scoped>
.category-list {
    
}
</style>