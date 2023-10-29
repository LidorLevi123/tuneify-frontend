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
    },
    rsbOpen() {
      return this.$store.getters.isRsbOpen
    }
  },
  methods: {
    maxStationsCalc() {
      const delta = this.rsbOpen ? 420 : 0
      const winwidth = window.innerWidth

      if (winwidth > 890 + delta && winwidth <= 1050 + delta) this.maxStations = 2
      else if (winwidth > 1050 + delta && winwidth <= 1250 + delta) this.maxStations = 3
      else if (winwidth > 1250 + delta && winwidth <= 1440 + delta) this.maxStations = 4
      else if (winwidth > 1440 + delta && winwidth <= 1640 + delta) this.maxStations = 5
      else if (winwidth > 1640 + delta && winwidth <= 1840 + delta) this.maxStations = 6
      else if (winwidth > 1840 + delta && winwidth <= 2030 + delta) this.maxStations = 7
      else if (winwidth > 2030 + delta && winwidth <= 2230 + delta) this.maxStations = 8
      else this.maxStations = 9
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
