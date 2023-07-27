<template>
    <section class="category-list">
        <ul v-if="categories" class="clean-list">
            <li v-for="category in categories" :key="category.id">
                <CategoryPreview :category="category" />
            </li>
        </ul>
    </section>
</template>

<script>
import CategoryPreview from './CategoryPreview.vue'

export default {
    props: {
        categories: { type: Array },
    },

    components: {
        CategoryPreview,
        CategoryPreview
    },

    name: 'CategoryList',
}
</script>

<style lang="scss" scoped>
.category-list {}
</style>