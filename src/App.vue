<template>
  <BackDrop />
  <RouterView />
  <UserMsg />
</template>

<script>
import UserMsg from './cmps/UserMsg.vue'
import BackDrop from './cmps/BackDrop.vue'

export default {

  created() {
    this.$store.dispatch({ type: 'setStations' })
  },

  components: {
    UserMsg,
    BackDrop,
  }
}
</script>
