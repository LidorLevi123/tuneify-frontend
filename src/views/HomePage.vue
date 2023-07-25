<template>
  <section class="container home-page text-center">
    <StationList v-if="stations" :stations="stations" />
  </section>
</template>

<script>
import StationList from '../cmps/StationList.vue'

export default {

  computed: {
    stations() {
      return this.$store.getters.stations
    }
  },

  components: {
    StationList
  },

  name: 'HomePage',
}
</script>
