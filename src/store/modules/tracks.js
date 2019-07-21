import axios from '../axiosConfig';

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
      const tracks = state.tracks.filter(track => payload.id === track.id);
      if (tracks.length !== 0) tracks[0].data = payload.data;
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

    uploadTrack({ rootState, dispatch }, data) {
      axios.post('tracks', data.data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: rootState.auth.auth.token,
        },
      })
        .then((result) => {
          if (data.image) dispatch('changeTrackImage', { id: result.data.id, image: data.image });
        })
        .then(() => dispatch('refreshAuthData', null, { root: true }))
        .then(() => {
          dispatch('sendNote', { type: 'info', message: 'Track been uploaded successfully.' }, { root: true });
        })
        .catch(err => console.log(err));
    },

    editTrack({ rootState, commit, dispatch }, data) {
      axios.put(`tracks/${data.id}`, { data: data.newData }, {
        headers: { Authorization: rootState.auth.auth.token },
      })
        .then(() => {
          commit('SET_TRACK_DATA', { id: data.id, data: data.newData });
          dispatch('sendNote', { type: 'info', message: 'Edited track successfully.' }, { root: true });
        })
        .catch(err => console.log(err));
    },

    deleteTrack({ rootState, dispatch }, data) {
      axios.delete(`tracks/${data.id}`, {
        headers: { Authorization: rootState.auth.auth.token },
      })
        .then(() => {
          dispatch('refreshAuthData', null, { root: true });
          dispatch('sendNote', { type: 'info', message: 'Deleted track successfully.' }, { root: true });
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
