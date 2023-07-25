import Vuex from 'vuex'

import { userStore } from './user.store.js'
import { stationStore } from './station.store.js'

export const store = Vuex.createStore({
  strict: true,
  modules: {
    userStore,
    stationStore,
  },
  state: {
  },
  mutations: {
  },
  actions: {
  }
})
