<template>
  <section class="container home-page text-center">
    <StationList v-if="stations" :stations="summerStations" :horizontalDesign="true" />
    <StationList v-if="stations" :stations="travelStations" />
    <StationList v-if="stations" :stations="workoutStations" />
    <StationList v-if="stations" :stations="decadesStations" />
    <StationList v-if="stations" :stations="popStations" />
    <StationList v-if="stations" :stations="tastemakersStations" />
    <StationList v-if="stations" :stations="classicalStations" />
    <StationList v-if="stations" :stations="gamingStations" />
  </section>
</template>

<script>
import StationList from '../cmps/StationList.vue'
import historyTracker from '../services/history.service'
import { spotifyService } from '../services/spotify.service'

export default {
  data() {
    return {
      maxStations: null,
    }
  },
  mounted() {
    window.addEventListener("resize", this.maxStationsCalc)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.maxStationsCalc)
  },
  async created() {
    if (!this.stations.length) {
      await spotifyService.getAccessToken()
      await this.$store.dispatch({ type: 'getStationsForHome' })
      this.maxStationsCalc()
    }
    historyTracker.push(this.$route.fullPath)
  },
  computed: {
    stations() {
      return this.$store.getters.stationsForHome
    },
    popStations() {
      return this.stations.filter(station => station.category === 'Pop').slice(0, this.maxStations)
    },
    workoutStations() {
      return this.stations.filter(station => station.category === 'Workout').slice(0, this.maxStations)
    },
    decadesStations() {
      return this.stations.filter(station => station.category === 'Decades').slice(0, this.maxStations)
    },
    classicalStations() {
      return this.stations.filter(station => station.category === 'Classical').slice(0, this.maxStations)
    },
    tastemakersStations() {
      return this.stations.filter(station => station.category === 'Tastemakers').slice(0, this.maxStations)
    },
    summerStations() {
      return this.stations.filter(station => station.category === 'Summer')
    },
    gamingStations() {
      return this.stations.filter(station => station.category === 'Gaming').slice(0, this.maxStations)
    },
    travelStations() {
      return this.stations.filter(station => station.category === 'Travel').slice(0, this.maxStations)
    },
  },
  methods: {
    maxStationsCalc() {
      if (window.innerWidth < 800) this.maxStations = 9
      if (window.innerWidth > 800 && window.innerWidth <= 1050) this.maxStations = 2
      if (window.innerWidth > 1050 && window.innerWidth <= 1250) this.maxStations = 3
      if (window.innerWidth > 1250 && window.innerWidth <= 1440) this.maxStations = 4
      if (window.innerWidth > 1440 && window.innerWidth <= 1640) this.maxStations = 5
      if (window.innerWidth > 1640 && window.innerWidth <= 1840) this.maxStations = 6
      if (window.innerWidth > 1840 && window.innerWidth <= 2030) this.maxStations = 7
      if (window.innerWidth > 2030 && window.innerWidth <= 2230) this.maxStations = 8
      if (window.innerWidth > 2230) this.maxStations = 9
    },
  },

  components: {
    StationList
  },

  name: 'HomePage',
}

</script>
