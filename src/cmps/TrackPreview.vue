<template>
    <article class="track-preview track-preview-layout">
        <span>{{ track.idx }}</span>
        <div>

            <span>{{ track.title }}</span>
            
        </div>
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


</style>