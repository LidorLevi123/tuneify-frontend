<template>
  <RouterView />
  <UserMsg />
</template>

<script>
import UserMsg from './cmps/UserMsg.vue'

export default {

  created() {
    this.$store.dispatch({ type: 'loadStations' })
  },

  components: {
    UserMsg,
  }
}
</script>
