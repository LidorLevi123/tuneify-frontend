<template>
  <BackDrop />
  <RouterView />
  <UserMsg />
</template>

<script>
import UserMsg from './cmps/UserMsg.vue'
import BackDrop from './cmps/BackDrop.vue'

export default {

  async created() {

    try {
      // await this.$store.dispatch({ type: 'signup', userCred: { fullname: 'Lidor', username: 'lidor', password: '123' } })
      await this.$store.dispatch({ type: 'login', userCred: { username: 'lidor', password: '123' } })
      await this.$store.dispatch({ type: 'loadStations' })
    } catch (err) {
      console.log('Something went wrong at App', err.message)
    }
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
