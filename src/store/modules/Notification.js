import Vue from 'vue';

var state = {
  all: [],
}

var mutations = {
  replace(state, list) {
    if (list)
      state.all = list
  },
}

var getters = {
  allNotifications(state) {
    return state.all
  },
  unreadNotifications(state) {
    return state.all.filter((item) => !item.read)
  },
}

var actions = {
  async loadNotifications({ commit }) {
    var res = await Vue.http.get('/notifications.json')
    commit('replace', res.data.notifications)
  },
}

export default {
  state,
  mutations,
  getters,
  actions,
};