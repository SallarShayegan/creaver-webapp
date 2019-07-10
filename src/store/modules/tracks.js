import Axios from 'axios';
import store from '../index';

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
      if (state.tracks.filter(track => payload.id === track.id).length === 0) {
        const imageUrl = `http://localhost:3000/images/tracks/${payload.id}.jpg`;
        const placeholder = './placeholders/track.jpg';
        // eslint-disable-next-line
        payload.data.imageUrl = (payload.data.hasImage) ? imageUrl : placeholder;
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
          if (data.image) {
            axios.put(`/tracks/${result.data.id}/change-image`, data.image, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          }
        })
        .then(() => {
          store.dispatch('sendNote', { type: 'info', message: 'Track been uploaded successfully.' });
        })
        .catch(err => console.log(err));
    },

    // eslint-disable-next-line
    editTrack({ }, data) {
      axios.put(`tracks/${data.id}`, data.newData)
        .then(() => {
          store.dispatch('sendNote', { type: 'info', message: 'Edited track successfully.' });
        })
        .catch(err => console.log(err));
    },

    // eslint-disable-next-line
    deleteTrack({ }, data) {
      axios.delete(`tracks/${data.id}`)
        .then(() => {
          store.dispatch('sendNote', { type: 'info', message: 'Deleted track successfully.' });
        });
    },

    // eslint-disable-next-line
    getTrackById({ commit }, id) {
      axios.get(`tracks/${id}`)
        .then(result => commit('ADD_TRACK', result.data));
    },

    // eslint-disable-next-line
    changeTrackImage({ }, data) {
      axios.put(`tracks/${data.id}/change-image`, data.image, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },

  },
};
