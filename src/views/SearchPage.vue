<template>
  <section class="categories-container">
    <div class="list" v-if="tracks?.length">
      <TrackList :tracks="tracks" />
    </div>
    <div class="list" v-else>
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
  },

  computed: {
    tracks() {
      return this.$store.getters.searchRes
    }
  },

  components: {
    CategoryList,
    TrackList,
  }
}
</script>
