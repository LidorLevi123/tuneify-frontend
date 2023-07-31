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
    this.$store.dispatch({ type: 'loadStations' })
    this.$store.dispatch({ type: 'loadUsers' })
  },

  components: {
    UserMsg,
    BackDrop,
    UserMsg
  }
}
</script>
