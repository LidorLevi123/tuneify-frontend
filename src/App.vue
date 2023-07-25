
<template>
  <!-- <AppHeader /> -->
  <!-- <RouterView /> -->
  <UserMsg />
  <StationPreview />
  <Header />
  <Sidebar />
  <Player />
</template>


<script>
import Player from './views/Player.vue'
import Header from './views/Header.vue'
import Sidebar from './views/Sidebar.vue'
import StationPreview from './cmps/StationPreview.vue'


import { userService } from './services/user.service'
import UserMsg from './views/UserMsg.vue'

export default {
  components: {
    Sidebar,
    UserMsg,
    Player,
    Header,
    StationPreview
  }
}
</script>
