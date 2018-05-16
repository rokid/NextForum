import Vue from 'vue';

var state = {
  all: [],
}

var mutations = {
  updateTags(state, list) {
    state.all = list
  },
}

var getters = {
  allTags(state) {
    return state.all || []
  },
}

var actions = {
  async getTags({ commit, getters }) {
    if (!getters.allTags.length) {
      var { data } = await Vue.http.get('/tags.json')
      commit('updateTags', data.tags)
    }
    return getters.allTags
  },
}

export default {
  state,
  mutations,
  getters,
  actions,
};