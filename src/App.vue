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

    try {
      await this.$store.dispatch({ type: 'getAccessToken' })
      await this.$store.dispatch({ type: 'getStationsForHome' })

      let user = userService.getLoggedinUser()

      if (!user) user = await this.$store.dispatch({ type: 'login', userCred: { username: 'guest', password: '123' } })
      await this.$store.dispatch({ type: 'loadStations', userId: user._id })
      await this.$store.dispatch({ type: 'loadUsers' })

    } catch (err) {
      console.log('Something went wrong at App', err.message)
    }
  },
  computed: {
    currTrack() {
      return this.$store.getters.currTrack
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
