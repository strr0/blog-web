import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    routes: []
  },
  mutations: {
    login(state, user) {
      state.user = user
    },
    logout(state) {
      state.user = null
      state.routes = []
    },
    initMenu(state, data) {
      state.routes = data
    }
  },
  actions: {
  },
  modules: {
  }
})
