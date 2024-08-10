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
import { eventBus } from './services/event-bus.service'
import { utilService } from './services/util.service'
import Cookies from 'js-cookie'

export default {

  async created() {
    utilService.printlog()
    try {
      const market = Cookies.get('currMarket')

      if (market) {
        this.$store.commit({ type: 'setCurrMarket', market })
        await this.$store.dispatch({ type: 'getStationsForHome', market })
      }
      else await this.$store.dispatch({ type: 'getStationsForHome', market: 'IL' })

      const user = userService.getLoggedinUser() || await this.$store.dispatch({ type: 'login', userCred: { username: 'guest', password: '123' } })

      await this.$store.dispatch({ type: 'loadUserStations', userId: user._id })

      if (user) eventBus.emit('duplicateStationsToLibrary')

    } catch (err) {
      console.log('Something went wrong at App', err.message)
    }
  },
  methods: {
    updateDocumentTitle() {
      if (this.isPlaying) document.title = `${this.currTrack.title} • ${this.currTrack.artists[0].name}`;
      else if (this.currStation?.isAlbum) document.title = `${this.currStation.name} - album by ${this.currStation.owner.fullname} | Tuneify`
      else if (!this.currStation?.name.includes('Search results') && !this.currStation?.name.includes('Recommendations') && this.currStation) document.title = `${this.currStation?.name} - playlist by ${this.currStation?.owner.fullname} | Tuneify`
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
