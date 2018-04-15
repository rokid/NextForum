import Vue from 'vue';

const state = {
  all: [],
}

const mutations = {
  updateTags(state, list) {
    state.all = list
  },
}

const getters = {
  allTags(state) {
    return state.all || []
  },
}

const actions = {
  async getTags({ commit, getters }) {
    if (!getters.allTags.length) {
      const { data } = await Vue.http.get('/tags.json')
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