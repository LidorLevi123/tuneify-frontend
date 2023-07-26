<template>
    <article class="track-preview track-preview-layout">
        <span class="track-num">{{ track.idx }}</span>
        <div class="mini-prev">
            <section class="img-container">
                <img :src="`${track.imgUrl}`" alt="">
            </section>
            <section>
                <div class="track-name">{{ track.title }}</div>
                <div class="track-artist">{{ track.artists[0] }}</div>
            </section>
        </div>
        <span class="track-album">{{ track.album }}</span>
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

