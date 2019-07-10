import Vue from 'vue';
import Vuex from 'vuex';
import people from './modules/people';
import tracks from './modules/tracks';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    notes: [],
  },
  mutations: {
    PUSH_NOTE(state, payload) {
      state.notes.push(payload);
    },
  },
  actions: {
    sendNote({ state, commit }, data) {
      const id = state.notes.length - 1;
      // while (state.notes.filter(note => note.id === id).length > 0) id += 1;
      const noteData = (data) ? { id, message: data.message, type: data.type } : {};
      commit('PUSH_NOTE', noteData);
      window.setTimeout(() => {
        state.notes.splice(state.notes.indexOf(noteData), 1);
      }, 5000);
    },
  },
  modules: {
    people,
    tracks,
  },
});
