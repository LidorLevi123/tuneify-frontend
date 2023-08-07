<template>
    <article class="user-preview" :title="user.fullname">
        <img :src="user.imgUrl" alt="">
    </article>
</template>

<script>
export default {
    name: 'UserPreview',
    props: {
        user: { type: Object, required: true },
    },
}
</script>


