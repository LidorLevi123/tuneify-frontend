<template>
    <section class="category-list">
        <ul v-if="categories" class="clean-list">
            <li v-for="category in categories" :key="category.id">
                <RouterLink :to="`/category/${category.id}/${category.name}`">
                    <CategoryPreview :category="category" />
                </RouterLink>
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
    },

    name: 'CategoryList',
}
</script>