import Vue from 'vue';

const state = {
  canCreateTopic: null,
  all: [],
}

const mutations = {
  updateCategoriesList(state, { list, canCreateTopic, parent }) {
    if (!parent) {
      state.canCreateTopic = canCreateTopic
      state.all = list || []
    } else {
      parent.children = list
    }
  },
}

const getters = {
  allCategories(state) {
    return state.all
  },
  findCategoryById(state) {
    return (id, parent) => {
      if (!parent) {
        parent = state.all
      }
      parent.find(item => item.id === id)
    }
  },
}

const actions = {
  async getCategories({ commit, getters }, parentId) {
    let pathname = '/categories.json'
    let parent = null

    if (parentId) {
      parent = getters.findCategoryById(parentId)
      // FIXME(Yorkie): if parent.children exists, just returns the current children,
      // that means will not be updated if not refreshed.
      if (parent && parent.children && parent.children.length > 0)
        return parent.children
      pathname += `?parent_category_id=${parentId}`
    }
    const { data } = await Vue.http.get(pathname)
    const { categories } = data.category_list || []
    const options = {
      list: categories,
      canCreateTopic: data.category_list.can_create_topic,
      parent,
    }
    commit('updateCategoriesList', options)
    return options.list
  },
}

export default {
  state,
  mutations,
  getters,
  actions,
};