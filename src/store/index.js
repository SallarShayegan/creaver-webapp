import Vue from 'vue';
import Vuex from 'vuex';
// import Axios from 'axios';
import people from './modules/people';
import tracks from './modules/tracks';
/*
const axios = Axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 1000,
});
*/
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    people,
    tracks,
  },
  /*
  state: {
    personalData: {
      data: {},
      id: '',
    },
    profileData: {
      data: {},
      id: '',
      tracks: [],
      following: [],
      followers: [],
    },
    errors: {
      signUp: [],
      login: [],
      settings: [],
    },
    tracks: [],
    people: [],
  },
  mutations: {
    SET_ALL_PERSONAL_DATA(state, payload) {
      // eslint-disable-next-line
      state.people = payload;
    },
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

    getAllPersonalData({ commit }) {
      axios.get('people')
        .then(result => commit('SET_ALL_PERSONAL_DATA', result.data))
        .catch(err => console.log(err));
    },

    addNewPerson({ state }, data) {
      axios.post('people', data)
        .catch(err => state.errors.signUp.push(err));
    },

    logPersonIn({ state, commit }, data) {
      axios.post('people/login', data)
        .then(result => commit('SET_PERSONAL_DATA', result.data))
        .catch(err => state.errors.login.push(err));
    },

    changePersonalData({ state, commit }, data) {
      axios.put(`people/${data.id}`, data.data)
        .then(() => commit('SET_PERSONAL_DATA', data))
        .catch(err => state.errors.settings.push(err));
    },

    loadProfileData({ commit }, username) {
      axios.get(`people/profile/${username}`)
        .then((result) => {
          commit('SET_PROFILE_DATA', result.data);
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
    follow({ }, data) {
      axios.put(`people/${data.following_id}/add-follower`, { follower_id: data.follower_id })
        .then(() => {
          axios.put(`people/${data.follower_id}/add-following`, { following_id: data.following_id })
            .catch(err => console.log(err));
        })
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
      axios.post('tracks', data.data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((result) => {
          axios.put(`/tracks/${result.data.id}/track-image`, data.image, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        });
    },

    // eslint-disable-next-line
    editTrack({ }, data) {
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

  }, */
});
