<template>
    <article class="category-preview">
        <h1>{{ category.name }}</h1>
    </article>
</template>
<script>
export default {
    props: {
        category: { type: Object, required: true },
    },

    name: 'CategoryPreview',
}

</script>
