<template>
  <section v-if="stations" class="container home-page text-center">
    <div class="stations-container" :style="this.backgroundStyle">
      <StationList :stations="summerStations" :horizontalDesign="true" />
      <StationList :stations="toplistsStations" />
      <StationList :stations="trendingStations" />
      <StationList :stations="travelStations" />
      <StationList :stations="workoutStations" />
      <StationList :stations="decadesStations" />
      <StationList :stations="popStations" />
      <StationList :stations="tastemakersStations" />
      <StationList :stations="classicalStations" />
      <StationList :stations="gamingStations" />
    </div>
  </section>
</template>

<script>
import StationList from '../cmps/StationList.vue'
import { eventBus } from '../services/event-bus.service'
import historyTracker from '../services/history.service'

export default {
  data() {
    return {
      maxStations: null,
      backgroundColor: '#212121'
    }
  },
  mounted() {
    window.addEventListener("resize", this.maxStationsCalc)
  },
  unmounted() {
    window.removeEventListener("resize", this.maxStationsCalc)
  },
  created() {
    this.maxStationsCalc()
    historyTracker.push(this.$route.fullPath)
    eventBus.on('changeBgColor', this.setBgcolor)
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
    trendingStations() {
      return this.stations.filter(station => station.category === 'Trending').slice(0, this.maxStations)
    },
    toplistsStations() {
      return this.stations.filter(station => station.category === 'Top Lists').slice(0, this.maxStations)
    },

    backgroundStyle() {
      return {
        backgroundImage: `linear-gradient(to bottom, ${this.backgroundColor} 0%, #121212 33rem, #121212)`,
      }
    }
  },
  methods: {
    maxStationsCalc() {
      if (window.innerWidth <= 890) this.maxStations = 9
      if (window.innerWidth > 890 && window.innerWidth <= 1050) this.maxStations = 2
      if (window.innerWidth > 1050 && window.innerWidth <= 1250) this.maxStations = 3
      if (window.innerWidth > 1250 && window.innerWidth <= 1440) this.maxStations = 4
      if (window.innerWidth > 1440 && window.innerWidth <= 1640) this.maxStations = 5
      if (window.innerWidth > 1640 && window.innerWidth <= 1840) this.maxStations = 6
      if (window.innerWidth > 1840 && window.innerWidth <= 2030) this.maxStations = 7
      if (window.innerWidth > 2030 && window.innerWidth <= 2230) this.maxStations = 8
      if (window.innerWidth > 2230) this.maxStations = 9
    },
    setBgcolor(color) {
      setTimeout(() => {
        this.backgroundColor = color
      }, 100)
    }
  },

  components: {
    StationList
  },

  name: 'HomePage',
}

</script>
