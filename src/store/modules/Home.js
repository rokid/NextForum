import Vue from 'vue';

const state = {
  excellent: [],
  tutorials: [],
  issues: [],
  events: [],
}

const mutations = {
  updateExcellentTopics(state, list) {
    state.excellent = list
  },
  updateTutorialTopics(state, list) {
    state.tutorials = list
  },
  updateIssueTopics(state, list) {
    state.issues = list
  },
  updateEventTopics(state, list) {
    state.events = list
  },
}

const getters = {
  excellentTopics(state) {
    return state.excellent
  },
  tutorialTopics(state) {
    return state.tutorials
  },
  issueTopics(state) {
    return state.issues
  },
  eventTopics(state) {
    return state.events
  },
}

const actions = {
  async pollAllTopics({ commit }) {
    const select = res => res.data.topic_list.topics
    const render = (key) => {
      return (list) => commit(key, list)
    }

    await Promise.all([
      Vue.http.get('/top/all.json?tags=极客教程')
        .then(select).then(render('updateExcellentTopics')),
      Vue.http.get('/top/all.json?tags=官方教程')
        .then(select).then(render('updateTutorialTopics')),
      Vue.http.get('/latest.json?tag=常见问题')
        .then(select).then(render('updateIssueTopics')),
      Vue.http.get('/latest.json?tag=活动')
        .then(select).then(render('updateEventTopics')),
    ])
  },
}

export default {
  state,
  mutations,
  getters,
  actions,
};