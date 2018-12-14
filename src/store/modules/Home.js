import Vue from 'vue';

var state = {
  excellent: [],
  tutorials: [],
  issues: [],
  events: [],
}

var mutations = {
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

var getters = {
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
    return state.events.filter(topic => topic.visible)
  },
}

var actions = {
  async pollAllTopics({ commit }) {
    var select = res => res.data.topic_list.topics
    var render = (key) => {
      return (list) => commit(key, list)
    }

    await Promise.all([
      Vue.http.get('/latest.json?tags=精华分享')
        .then(select).then(render('updateExcellentTopics')),
      Vue.http.get('/latest.json?tags=官方教程')
        .then(select).then(render('updateTutorialTopics')),
      Vue.http.get('/latest.json?tags=常见问题')
        .then(select).then(render('updateIssueTopics')),
      Vue.http.get('/latest.json?tags=活动')
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
