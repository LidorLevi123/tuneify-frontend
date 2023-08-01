<template>
  <BackDrop />
  <RouterView />
  <UserMsg />
</template>

<script>
import UserMsg from './cmps/UserMsg.vue'
import BackDrop from './cmps/BackDrop.vue'
import { stationService } from './services/station.service.local'

export default {

  async created() {
    await stationService.createLikedSongs()
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
          console.log('Current Track:', newTrack)
          document.title = `${newTrack.title} • ${newTrack.artists[0]}`
        } else {
          console.log('No track is currently playing.')
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
