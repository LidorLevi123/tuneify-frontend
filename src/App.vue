<template>
  <BackDrop />
  <RouterView />
  <UserMsg />
  <UserEdit />
</template>

<script>
import UserMsg from './cmps/UserMsg.vue'
import BackDrop from './cmps/BackDrop.vue'
import UserEdit from './cmps/UserEdit.vue'
import { userService } from './services/user.service'

export default {

  async created() {

    try {
      await this.$store.dispatch({ type: 'getAccessToken' })
      await this.$store.dispatch({ type: 'getStationsForHome' })
      let user = userService.getLoggedinUser()

      if (!user) user = await this.$store.dispatch({ type: 'login', userCred: { username: 'guest', password: '123' } })
      await this.$store.dispatch({ type: 'loadUserStations', userId: user._id })

    } catch (err) {
      console.log('Something went wrong at App', err.message)
    }
  },
  methods: {
    updateDocumentTitle() {
      if (this.isPlaying) document.title = `${this.currTrack.title} • ${this.currTrack.artists[0]}`;
      else if (this.currStation) document.title = `${this.currStation.name} | Tuneify`
      else document.title = 'Tuneify'
    }
  },
  computed: {
    currTrack() {
      return this.$store.getters.currTrack
    },
    currStation() {
      return this.$store.getters.currStation
    },
    isPlaying() {
      return this.$store.getters.isCurrTrackPlaying
    }
  },

  watch: {
    isPlaying: {
      immediate: true,
      handler() {
        this.updateDocumentTitle()
      }
    },
    currTrack: {
      immediate: true,
      handler() {
        this.updateDocumentTitle()
      }
    }
  },

  components: {
    UserMsg,
    BackDrop,
    UserEdit
  }
}
</script>
