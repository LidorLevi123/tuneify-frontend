<template>
  <section v-if="stations" class="container home-page text-center" :style="{ backgroundColor: this.backgroundColor }">
    <div class="stations-container">
      <h2 v-if="loggedinUser">{{ `${greeting}, ${loggedinUser}` }}</h2>
      <div v-for="(stationGroup, idx) in stations" :key="idx">
        <div v-if="stationGroup[0]?.category" class="sub-header">
          <h1>{{ stationGroup[0]?.category }}</h1>
          <RouterLink v-if="this.$route.path === '/'"
            :to="`/category/${stationGroup[0]?.categoryId}/${stationGroup[0]?.category}`" class="category-link">Show all
          </RouterLink>
        </div>
        <StationList :stations="idx === 0 ? stationGroup.slice(0, 6) : stationGroup.slice(0, maxStations)"
          :horizontalDesign="idx === 0" />
      </div>
    </div>
  </section>
</template>

<script>
import StationList from '../cmps/StationList.vue'
import { eventBus } from '../services/event-bus.service'
import historyTracker from '../services/history.service'

export default {
  name: 'HomePage',
  data() {
    return {
      maxStations: null,
      backgroundColor: '#212121',
      currentTime: new Date()
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
    greeting() {
      const currentHour = this.currentTime.getHours()

      if (currentHour >= 5 && currentHour < 12) return 'Good morning'
      else if (currentHour >= 12 && currentHour < 18) return 'Good afternoon'
      else return 'Good evening'
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser?.fullname
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
      this.backgroundColor = color
    }
  },

  components: {
    StationList
  },

}

</script>
