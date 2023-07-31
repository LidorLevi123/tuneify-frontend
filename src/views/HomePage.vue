<template>
  <section class="container home-page text-center">
    <StationList v-if="stations" :stations="popStations" />
    <StationList v-if="stations" :stations="workoutStations" />
    <StationList v-if="stations" :stations="decadesStations" />
    <StationList v-if="stations" :stations="classicalStations" />
    <StationList v-if="stations" :stations="tastemakersStations" />
    <StationList v-if="stations" :stations="summerStations" />
    <StationList v-if="stations" :stations="gamingStations" />
    <StationList v-if="stations" :stations="travelStations" />
  </section>
</template>

<script>
import StationList from '../cmps/StationList.vue'

export default {

  computed: {
    stations() {
      return this.$store.getters.stationsForHome
    },
    popStations() {
      return this.stations.filter(station => station.category === 'Pop')
    },
    workoutStations() {
      return this.stations.filter(station => station.category === 'Workout')
    },
    decadesStations() {
      return this.stations.filter(station => station.category === 'Decades')
    },
    classicalStations() {
      return this.stations.filter(station => station.category === 'Classical')
    },
    tastemakersStations() {
      return this.stations.filter(station => station.category === 'Tastemakers')
    },
    summerStations() {
      return this.stations.filter(station => station.category === 'Summer')
    },
    gamingStations() {
      return this.stations.filter(station => station.category === 'Gaming')
    },
    travelStations() {
      return this.stations.filter(station => station.category === 'Travel')
    },
  },

  components: {
    StationList
  },

  name: 'HomePage',
}
</script>
