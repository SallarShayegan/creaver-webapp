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
    profileData: {
      data: {},
      id: '',
      tracks: [],
    },
    errors: {
      signUp: [],
      login: [],
      settings: [],
    },
    tracks: [],
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
    SET_PROFILE_DATA_TRACKS(state, payload) {
      // eslint-disable-next-line
      state.profileData.tracks.push(payload.id);
    },
    ADD_TRACK(state, payload) {
      if (!state.tracks.includes(payload)) {
        // eslint-disable-next-line
        state.tracks.push(payload);
      }
    },
  },
  getters: {
    getTrackById: state => (id) => {
      const result = state.tracks.filter(track => track.id === id);
      return result[0];
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
        .then((res) => {
          commit('SET_PROFILE_DATA', res.data);
        })
        .catch(err => console.log(err));
    },

    // unused:
    loadPersonsTracks({ commit }, id) {
      axios.get(`people/${id}/tracks`)
        .then(result => commit('SET_PROFILE_DATA_TRACKS', result.data))
        .catch(err => console.log(err));
    },

    // eslint-disable-next-line
    changeProfileImage({ }, data) {
      axios.put(`people/${data.id}/change-image`, data.profileImage, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },

    // eslint-disable-next-line
    uploadTrack({ }, data) {
      console.log(data);
      axios.post('tracks', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },

    // eslint-disable-next-line
    editTrack({ }, data) {
      axios.put(`tracks/${data.id}`, data.newData);
    },

    deleteTrack({ dispatch, state }, data) {
      axios.delete(`tracks/${data.id}`)
        .then(() => { dispatch('loadPersonsTracks', state.profileData.id); });
    },

    // eslint-disable-next-line
    getTrackById({ commit }, id) {
      axios.get(`tracks/${id}`)
        .then(result => commit('ADD_TRACK', result.data));
    },

  },
});
