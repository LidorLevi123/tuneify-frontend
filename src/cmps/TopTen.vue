<template>
    <section class="top-ten" v-if="topTenTracks">
      <header>
        <h2>Tuneify Top 10</h2>
        <button v-icon="'close'" @click="this.$emit('closeTopTen')"></button>
      </header>
      <transition-group name="list" tag="ul" class="clean-list">
        <li v-for="(track, idx) in topTenTracks" :key="track._id" @click="goToAlbum(track.albumId)">
          <div class="num">#{{ idx + 1 }}</div>
          <img :src="track?.imgUrl[1]?.url" alt="">
          <div class="text">
            <h2>{{ track.title }}</h2>
            <span v-for="(artist, idx) in track.artists" :key="artist._id">{{ artist.name }}<span v-if="idx < track.artists.length - 1">, </span></span>
          </div>
        </li>
      </transition-group>
    </section>
  </template>


<script>
import { stationService } from '../services/station.service';
import TrackPreview from './TrackPreview.vue'

export default {
    name: 'TopTen',
    data() {
        return {
            topTenTracks: null,
            refreshTopTen: null
        }
    },
    created() {
        this.getTopTen()
        this.refreshTopTen = setInterval(this.getTopTen, 10000)
    },
    unmounted() {
        clearInterval(this.refreshTopTen)
    },
    methods: {
        async getTopTen() {  
            try {
                const topTen = await stationService.getTopTenTracks()
                this.topTenTracks = topTen   
            }
            catch(err) {
                console.log('Could not get top ten tracks', err)
            }
        },
        goToAlbum(albumId) {
            this.$emit('closeTopTen')
            this.$router.push('/album/' + albumId)
        }
    },
    components: {
        TrackPreview
    }
}
</script>