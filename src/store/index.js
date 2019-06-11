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
    profileData: {},
    errors: {
      signUp: [],
      login: [],
      settings: [],
    },
  },
  mutations: {
    SET_PERSONAL_DATA(state, payload) {
      // eslint-disable-next-line
      state.personalData = payload;
    },
    SET_PROFILE_DATA(state, payload) {
      // eslint-disable-next-line
      state.profileData = payload;
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
        .then(() => commit('SET_PERSONAL_DATA', data))
        .catch(err => state.errors.settings.push(err));
    },

    loadProfileData({ commit }, username) {
      axios.get(`people/profile/${username}`)
        .then(res => commit('SET_PROFILE_DATA', res.data))
        .catch(err => console.log(err));
    },

    // eslint-disable-next-line
    changeProfileImage({ }, data) {
      axios.put(`people/${data.id}/change-image`, data.profileImage, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },

  },
});
