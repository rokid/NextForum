import Vue from 'vue';

const state = {
  all: [],
}

const mutations = {
  replace(state, list) {
    state.all = list
  },
}

const getters = {
  allNotifications() {
    return state.all
  },
}

const actions = {
  async loadNotifications({ commit }) {
    const res = await Vue.http.get('/notifications.json')
    commit('replace', res.data.notifications)
  },
}

export default {
  state,
  mutations,
  getters,
  actions,
};