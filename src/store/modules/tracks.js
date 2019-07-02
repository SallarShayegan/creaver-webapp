import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 1000,
});

export default {
  namespaced: true,
  state: {
    tracks: [],
  },
  mutations: {
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
      if (result.length < 1) return null;
      return result[0];
    },
  },
  actions: {

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
};
