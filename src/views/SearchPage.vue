<template>
  <section class="categories-container">
    <div class="track-list" v-if="tracks?.length">
      <TrackList :tracks="tracks" @track-clicked="emitClick" />
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

import TrackList from '../cmps/TrackList.vue'
import CategoryList from '../cmps/CategoryList.vue'
import historyTracker from '../services/history.service'

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
    }
  },

  computed: {
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
  },

  components: {
    CategoryList,
    TrackList,
  }
}
</script>
