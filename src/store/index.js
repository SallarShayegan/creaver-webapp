import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 1000,
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    personalData: {},
    errors: {
      signUp: [],
      login: [],
    },
  },
  mutations: {
    SET_PERSONAL_DATA(state, payload) {
      state.personalData = payload;
    },
  },
  actions: {

    addNewPerson({ state }, data) {
      axios.post('people', data)
        .catch(err => state.errors.signUp.push(err));
    },

    logPersonIn({ state, commit }, data) {
      axios.post('people/login', data)
        .then(res => commit('SET_PERSONAL_DATA', res.data))
        .catch(err => state.errors.login.push(err));
    },

    changePersonalData({ state, commit }, data) {
      axios.put(`people/${data.id}`, data.data)
        .then(res => commit('SET_PERSONAL_DATA', data));
    },

  },
});
