<template>
  <section class="categories-container">
    <div class="search-res" v-if="tracks?.length">
      <section class="df search-filter-btns">
        <button class="search-filter-btn" :class="{ active: !searchFilter }" @click="searchFilter = ''">All</button>
        <button class="search-filter-btn" :class="{ active: searchFilter === 'Songs' }"
          @click="searchFilter = 'Songs'">Songs</button>
        <button class="search-filter-btn" :class="{ active: searchFilter === 'Playlists' }"
          @click="searchFilter = 'Playlists'">Playlists</button>
        <button class="search-filter-btn" :class="{ active: searchFilter === 'Albums' }"
          @click="searchFilter = 'Albums'">Albums</button>
        <button class="search-filter-btn" :class="{ active: searchFilter === 'Artists' }"
          @click="searchFilter = 'Artists'">Artists</button>
      </section>
      <div v-show="!searchFilter || searchFilter === 'Songs'">
        <h1 class="songs">Songs</h1>
        <TrackList :tracks="tracks" @track-clicked="emitClick" @track-add="addTrack" @track-dislike="dislikeTrack"
          class="track-list" />
      </div>
      <div v-show="!searchFilter || searchFilter === 'Playlists'">
        <h1 class="playlists">Playlists</h1>
        <StationList :stations="stations" />
      </div>
      <div v-show="!searchFilter || searchFilter === 'Albums'">
        <h1 class="playlists">Albums</h1>
        <StationList :stations="albums" />
      </div>
      <div v-show="!searchFilter || searchFilter === 'Artists'">
        <h1 class="playlists">Artists</h1>
        <StationList :stations="artists" />
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
      searchFilter: '',
    }
  },
  created() {
    historyTracker.push(this.$route.fullPath)
    eventBus.on('search', this.getSearchRes)
    eventBus.on('dislikeTrack', this.dislikeTrack)
  },
  unmounted() {
    eventBus.off('search', this.getSearchRes)
    eventBus.off('dislikeTrack', this.dislikeTrack)
  },
  methods: {
    async getSearchRes(query) {
      try {
        await this.$store.dispatch({ type: 'getSearchRes', query })
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
    albums() {
      return this.$store.getters.searchRes.albums
    },
    tracks() {
      return this.$store.getters.searchRes.tracks?.slice(0, 10)
    },
    artists() {
      return this.$store.getters.searchRes.artists
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
</style>