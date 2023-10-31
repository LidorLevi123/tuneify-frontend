import { createRouter, createWebHashHistory } from 'vue-router'

import StationIndex from './views/StationIndex.vue'
import HomePage from './views/HomePage.vue'
import SearchPage from './views/SearchPage.vue'
import CategoryPage from './views/CategoryPage.vue'
import StationDetails from './views/StationDetails.vue'
import LoginSignup from './views/LoginSignup.vue'
import Sidebar from './cmps/Sidebar.vue'
import LyricsPage from './views/LyricsPage.vue'
import AdminPage from './views/AdminPage.vue'

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
        path: 'lyrics',
        name: 'LyricsPage',
        component: LyricsPage,
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
      {
        path: 'album/:stationId',
        name: 'AlbumDetails',
        component: StationDetails,
      },
      {
        path: '/library',
        name: 'PlayLists',
        component: Sidebar,
      }
    ]
  },
  {
    path: '/login',
    name: 'LoginSignup',
    component: LoginSignup,
  },
  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminPage,
  },
]


export const router = createRouter({
  routes,
  history: createWebHashHistory()
  // base: process.env.BASE_URL,
})

