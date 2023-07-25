
<template>
  <Header />
  <Sidebar />
  <RouterView />
  <Player />
  <UserMsg />
</template>

<script>
import Player from './cmps/Player.vue'
import Header from './cmps/Header.vue'
import Sidebar from './cmps/Sidebar.vue'
import UserMsg from './cmps/UserMsg.vue'

export default {
  components: {
    Sidebar,
    UserMsg,
    Player,
    Header,
  }
}
</script>
