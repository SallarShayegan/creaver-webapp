import axios from '../axiosConfig';
import store from '../index';

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
    SET_TRACK_DATA(state, payload) {
      const imageUrl = `http://localhost:3000/images/tracks/${payload.id}.jpg`;
      const placeholder = './placeholders/track.jpg';
      // eslint-disable-next-line
      payload.data.imageUrl = (payload.data.hasImage) ? imageUrl : placeholder;
      const track = state.tracks.filter(track => payload.id === track.id);
      if (track.length !== 0) track[0].data = payload.data;
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
          store.dispatch('refreshAuthData');
          store.dispatch('sendNote', { type: 'info', message: 'Track been uploaded successfully.' });
        })
        .catch(err => console.log(err));
    },

    editTrack({ commit }, data) {
      axios.put(`tracks/${data.id}`, data.newData)
        .then(() => {
          commit('SET_TRACK_DATA', { id: data.id, data: data.newData });
          store.dispatch('sendNote', { type: 'info', message: 'Edited track successfully.' });
        })
        .catch(err => console.log(err));
    },

    // eslint-disable-next-line
    deleteTrack({ }, data) {
      axios.delete(`tracks/${data.id}`)
        .then(() => {
          store.dispatch('refreshAuthData');
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
