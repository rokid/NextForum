import Vue from 'vue';

var state = {
  username: null,
  authorized: false,
  csrf: null,
}

var mutations = {
  login(state, { username }) {
    state.username = username
    state.authorized = true
  },
  logout(state) {
    state.username = null
    state.authorized = false
  },
  setCsrfToken(state, token) {
    state.csrf = token
  },
}

var getters = {
  authorized(state) {
    return state.authorized
  },
  username(state) {
    return state.username
  },
  csrf(state) {
    return state.csrf
  },
}

var actions = {
  async login({ commit, dispatch }, user) {
    commit('login', user)
    await dispatch('fetchCsrfToken')
  },
  logout({ commit }) {
    commit('logout')
  },
  async fetchCsrfToken({ commit, state }) {
    if (state.csrf)
      return;
    var { data } = await Vue.http.get('/session/csrf.json')
    commit('setCsrfToken', data.csrf)
    Vue.registerWithCsrfToken(data.csrf)
  },
}

export default {
  state,
  mutations,
  getters,
  actions,
};