<template>
  <BackDrop />
  <RouterView />
  <UserMsg />
</template>

<script>
import UserMsg from './cmps/UserMsg.vue'
import BackDrop from './cmps/BackDrop.vue'
// import { stationService } from './services/station.service.local'
import { stationService } from './services/station.service'

export default {

  async created() {
    this.$store.dispatch({ type: 'getStationsForHome' })
    this.$store.dispatch({ type: 'loadStations' })
    this.$store.dispatch({ type: 'loadUsers' })
  },
  computed: {
    currTrackIdx() {
      return this.$store.getters.currTrackIdx
    },
    currStation() {
      return this.$store.getters.currStation
    },
    currTrack() {
      return this.currStation?.tracks[this.currTrackIdx]
    },
  },

  watch: {
    currTrack: {
      immediate: true,
      handler(newTrack, oldTrack) {
        if (newTrack) {
          document.title = `${newTrack.title} • ${newTrack.artists[0]}`
        } else {
          document.title = 'Tuneify'
        }
      },
    }
  },

  components: {
    UserMsg,
    BackDrop,
    UserMsg
  }
}
</script>
