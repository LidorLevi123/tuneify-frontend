<template>
  <section class="container home-page text-center">
    <StationList v-if="stations" :stations="stations" />
  </section>
</template>

<script>
import StationList from '../cmps/StationList.vue'

export default {

  created() {
    this.$store.dispatch({ type: 'getStationsForHome' })
  },

  computed: {
    stations() {
      return this.$store.getters.stationsForHome
    }
  },

  components: {
    StationList
  },

  name: 'HomePage',
}
</script>
