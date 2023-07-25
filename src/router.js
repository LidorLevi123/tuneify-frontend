import { createRouter, createWebHashHistory } from 'vue-router'

import StationIndex from './views/StationIndex.vue'
import HomePage from './views/HomePage.vue'
import SearchPage from './views/SearchPage.vue'
import StationDetails from './views/StationDetails.vue'

const routes = [
  {
    path: '/',
    name: 'StationIndex',
    component: StationIndex,
    children: [
      {
        path: 'home',
        name: 'HomePage',
        component: HomePage,
      },
      {
        path: 'search',
        name: 'SearchPage',
        component: SearchPage,
      },
      {
        path: 'details/:stationId',
        name: 'StationDetails',
        component: StationDetails,
      },
    ]
  },
]


export const router = createRouter({
  routes,
  history: createWebHashHistory()
  // base: process.env.BASE_URL,
})

