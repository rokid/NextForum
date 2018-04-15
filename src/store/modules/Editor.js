import Vue from 'vue';

const state = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{
      'list': 'ordered'
    }, {
      'list': 'bullet'
    }],
    ['image', 'code-block'],
  ],
}

const getters = {
  editorToolbar(state) {
    return state.toolbar
  },
}

export default {
  state,
  getters,
};