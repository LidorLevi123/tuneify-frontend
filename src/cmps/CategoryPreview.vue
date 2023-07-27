<template>
    <article class="category-preview" :style="bgColor">
        <h1>{{ category.name }}</h1>
        <img :src="category.imgUrl" alt="">
    </article>
</template>
<script>
export default {
    props: {
        category: { type: Object, required: true },
    },

    computed: {
        bgColor() {
            return {
                backgroundColor: this.category.backgroundColor
            }
        }
    },

    name: 'CategoryPreview',
}

</script>
