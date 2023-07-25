import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './views/Home.vue'
import StationIndex from './views/StationIndex.vue'
// import UserDetails from './views/UserDetails.vue'
// import Chat from './views/Chat.vue'
// import LoginSignup from './views/LoginSignup.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    name: 'StationIndex',
    component: StationIndex
  },
  // {
  //   path: '/chat',
  //   name: 'Chat',
  //   component: Chat
  // },
  // {
  //   path: '/login',
  //   name: 'LoginSignup',
  //   component: LoginSignup
  // },
  // {
  //   path: '/user/:id',
  //   name: 'UserDetails',
  //   component: UserDetails
  // }
]


export const router = createRouter({
  routes,
  history: createWebHashHistory()
  // base: process.env.BASE_URL,
})

