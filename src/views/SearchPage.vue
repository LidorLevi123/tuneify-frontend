<template>
  <section class="categories-container">
    <section v-if="query" class="search-res">
      <!-- <pre>{{ tracks }}</pre> -->

      <!-- <TrackList @search="getTracks" :tracks="tracks" /> -->
      <StationList v-if="stations" :stations="tracks" />
    </section>
    <div v-if="!query">
      <h2>Browse all</h2>
      <CategoryList :categories="categories" />
    </div>
  </section>
</template>

<script>
import { eventBus } from '../services/event-bus.service'
import TrackList from '../cmps/TrackList.vue'
import StationList from '../cmps/stationList.vue'
import CategoryList from '../cmps/CategoryList.vue'
import { utilService } from '../services/util.service.js'
import historyTracker from '../services/history.service'

export default {
  name: 'SearchPage',
  data() {
    return {
      query: '',
      categories: utilService.getCategoriesJson(),
    };
  },
  created() {
    eventBus.on('search', this.getTracks)
    historyTracker.push(this.$route.fullPath)
  },
  beforeUnmount() {
    eventBus.off('search', this.getTracks)
  },
  methods: {
    async getTracks(query) {
      this.query = query
      console.log(this.query);
      try {
        await this.$store.dispatch({ type: 'getTracks', query })
        this.query = query
      } catch (err) {
        console.log(err.message)
        showErrorMsg(`Could not load tracks`)
      }
    },
  },
  computed: {
    tracks() {
      console.log(this.$store.getters.tracks);
      return this.$store.getters.tracks
    }
  },
  components: {
    CategoryList,
    TrackList,
    StationList

  }
}
</script>
