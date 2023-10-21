<template>
  <section class="categories-container">
    <div class="search-res" v-if="tracks?.length">
      <div>
        <h1 class="songs">Songs</h1>
        <TrackList :tracks="tracks" @track-clicked="emitClick" @track-add="addTrack" @track-dislike="dislikeTrack"
          class="track-list" />
      </div>
      <div>
        <h1 class="playlists">Playlists</h1>
        <StationList :stations="stations" class="station-list" />
      </div>
    </div>
    <div class="categories-list" v-else>
      <h2 class="browse">Browse all</h2>
      <CategoryList :categories="categories" />
    </div>
  </section>
</template>

<script>
import { utilService } from '../services/util.service'
import { eventBus } from '../services/event-bus.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import TrackList from '../cmps/TrackList.vue'
import CategoryList from '../cmps/CategoryList.vue'
import historyTracker from '../services/history.service'
import StationList from '../cmps/StationList.vue'

export default {
  name: 'SearchPage',

  data() {
    return {
      categories: utilService.getCategoriesJson(),
    }
  },
  created() {
    historyTracker.push(this.$route.fullPath)
    eventBus.on('search', this.getTracks)
    eventBus.on('dislikeTrack', this.dislikeTrack)
  },
  unmounted() {
    eventBus.off('search', this.getTracks)
    eventBus.off('dislikeTrack', this.dislikeTrack)
  },
  methods: {
    async getTracks(query) {
      try {
        await this.$store.dispatch({ type: 'getTracks', query })
      } catch (err) {
        console.log(err.message)
        showErrorMsg(`Could not load tracks`)
      }
    },
    emitClick(trackIdx) {
      if (trackIdx === this.currTrackIdx && this.isPlaying) eventBus.emit('trackPaused', true)
      else {
        const station = this.searchResStation
        this.$store.commit({ type: 'setCurrStation', station })
        this.$store.commit({ type: 'setCurrTrackIdx', trackIdx })
        eventBus.emit('trackClicked')
      }
    },
    async addTrack(trackToSave, stationId) {
      try {
        await this.$store.dispatch({ type: 'addTrack', trackToSave, stationId })
        showSuccessMsg('Added to Liked Songs')
      } catch (err) {
        console.log(err.message)
        showErrorMsg('Could not like track')
      }
    },
    async dislikeTrack(trackId) {
      try {
        await this.$store.dispatch({ type: 'removeTrack', trackId, stationId: this.user.likedId })
        showSuccessMsg('Removed from Liked Tracks')
      } catch (err) {
        console.log(err.message)
        showErrorMsg('Could not dislike track')
      }
    },
  },

  computed: {
    stations() {
      return this.$store.getters.searchRes.stations
    },
    tracks() {
      return this.$store.getters.searchRes.tracks
    },
    searchResStation() {
      return this.$store.getters.searchRes
    },
    isPlaying() {
      return this.$store.getters.isCurrTrackPlaying
    },
    currTrackIdx() {
      return this.$store.getters.currTrackIdx
    },
    user() {
      return this.$store.getters.loggedinUser
    }
  },

  components: {
    CategoryList,
    TrackList,
    StationList
  }
}
</script>

<style scoped>
.track-list {
  margin-block-end: unset;
}

.station-list {
  margin-block-end: 12rem;
  padding-inline: .5rem;
}
</style>