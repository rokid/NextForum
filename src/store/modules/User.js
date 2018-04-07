import Vue from 'vue';

const state = {
  username: null,
  authorized: false,
  csrf: null,
}

const mutations = {
  login(state, { username }) {
    console.log(username)
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

const getters = {
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

const actions = {
  async login({ commit, dispatch }, user) {
    commit('login', user)
    await dispatch('fetchCsrfToken')
  },
  logout({ commit }) {
    commit('logout')
  },
  async fetchCsrfToken({ commit }) {
    const { data } = await Vue.http.get('/session/csrf.json')
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