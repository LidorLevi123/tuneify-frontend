<template>
  <section v-if="stations" class="home-page" :style="{ backgroundColor: this.backgroundColor }">
    <div class="stations-container">
      <h2 v-if="loggedinUser">{{ `${greeting}, ${loggedinUser}` }}</h2>
      <div v-for="(stationGroup, idx) in stations" :key="idx">
        <div v-if="stationGroup[0]?.category" class="sub-header">
          <h1>{{ stationGroup[0]?.category }}</h1>
          <RouterLink v-if="this.$route.path === '/' && stationGroup.length > 9"
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
    this.maxStationsCalc()
    window.addEventListener("resize", this.maxStationsCalc)
  },
  unmounted() {
    window.removeEventListener("resize", this.maxStationsCalc)
  },
  created() {
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
    },
    rsbOpen() {
      return this.$store.getters.isRsbOpen
    },
    sidebarCollapsed() {
      return this.$store.getters.sidebarCollapsed
    }
  },
  methods: {
    maxStationsCalc() {
      const stationsWidth = document.querySelector('.station-list-container').clientWidth
      this.maxStations = window.innerWidth < 890 ? 9 : Math.floor(stationsWidth / 210) || 1
    },
    setBgcolor(color) {
      this.backgroundColor = color
    }
  },
  watch: {
    rsbOpen: 'maxStationsCalc',
    sidebarCollapsed: 'maxStationsCalc'
  },
  components: {
    StationList
  },
}
</script>