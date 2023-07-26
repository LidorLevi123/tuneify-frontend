<template>
    <article class="track-preview track-preview-layout">
        <span>{{ track.idx }}</span>
        <span>{{ track.title }}</span>
        <span>{{ track.album }}</span>
    </article>
</template>

<script>
export default {
    props: {
        track: { type: Object },
    },

    name: 'TrackPreview',
}
</script>

<style lang="scss" scoped>
.track-preview span{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}    
</style>