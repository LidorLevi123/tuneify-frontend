import { createRouter, createWebHashHistory } from 'vue-router'

import StationIndex from './views/StationIndex.vue'
import HomePage from './views/HomePage.vue'
import SearchPage from './views/SearchPage.vue'
import CategoryPage from './views/CategoryPage.vue'
import StationDetails from './views/StationDetails.vue'
import LoginSignup from './views/LoginSignup.vue'
import Sidebar from './cmps/Sidebar.vue'

const routes = [
  {
    path: '/',
    name: 'StationIndex',
    component: StationIndex,
    children: [
      {
        path: '',
        name: 'HomePage',
        component: HomePage,
      },
      {
        path: 'search',
        name: 'SearchPage',
        component: SearchPage,
      },
      {
        path: 'category/:categoryId/:categoryName',
        name: 'CategoryPage',
        component: CategoryPage,
      },
      {
        path: 'station/:stationId',
        name: 'StationDetails',
        component: StationDetails,
      },
    ]
  },
  {
    path: '/login',
    name: 'LoginSignup',
    component: LoginSignup,
  },
  {
    path: '/library',
    name: 'PlayLists',
    component: Sidebar,
  }
]


export const router = createRouter({
  routes,
  history: createWebHashHistory()
  // base: process.env.BASE_URL,
})

