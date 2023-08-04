<template>
  <BackDrop />
  <RouterView />
  <UserMsg />
</template>

<script>
import UserMsg from './cmps/UserMsg.vue'
import BackDrop from './cmps/BackDrop.vue'
import { userService } from './services/user.service'

export default {

  async created() {

    // await this.$store.dispatch({ type: 'signup', userCred: { fullname: 'Nitzan', username: 'Nitzan', password: '123' } })

    const user = userService.getLoggedinUser()
    if (!user) return

    try {
      await this.$store.dispatch({ type: 'loadStations', userId: user._id })
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
    }
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
