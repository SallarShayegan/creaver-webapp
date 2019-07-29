import axios from '../axiosConfig';

const placeholder = './placeholders/track.jpg';
function imageUrl(id) {
  return `http://localhost:3000/images/tracks/${id}.jpg`;
}

export default {
  namespaced: true,
  state: {
    tracks: [],
  },
  mutations: {
    ADD_TRACK(state, payload) {
      if (state.tracks.filter(track => payload.id === track.id).length === 0) {
        // eslint-disable-next-line
        payload.imageUrl = (payload.hasImage) ? imageUrl(payload.id) : placeholder;
        // eslint-disable-next-line
        state.tracks.push(payload);
      }
    },
    SET_TRACK_DATA(state, payload) {
      // eslint-disable-next-line
      payload.imageUrl = (payload.hasImage) ? imageUrl(payload.id) : placeholder;
      const tracks = state.tracks.filter(track => payload.id === track.id);

      if (tracks.length !== 0) {
        const track = tracks[0];
        track.data = payload.data;
        track.imageUrl = payload.imageUrl;
        track.hasImage = payload.hasImage;
      }
    },
    ADD_LIKE(state, payload) {
      const track = state.tracks.filter(t => t.id === payload.id)[0];
      if (track) track.likes.push(payload.auth_id);
    },
    REMOVE_LIKE(state, payload) {
      const track = state.tracks.filter(t => t.id === payload.id)[0];
      if (track) track.likes.splice(track.likes.indexOf(payload.auth_id), 1);
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

    async editTrack({ rootState, commit, dispatch }, data) {
      await axios.put(`tracks/${data.id}`, { data: data.newData }, {
        headers: { Authorization: rootState.auth.auth.token },
      });
      if (data.image) {
        await dispatch('changeTrackImage', {
          id: data.id,
          image: data.image,
        });
      } else if (data.deleteImage) {
        await dispatch('removeTrackImage', data.id);
      }
      commit('SET_TRACK_DATA', { id: data.id, data: data.newData, hasImage: !data.deleteImage });
      dispatch('sendNote', { type: 'info', message: 'Edited track successfully.' }, { root: true });
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

    getTrackById({ commit }, id) {
      axios.get(`tracks/${id}`)
        .then(result => commit('ADD_TRACK', result.data))
        .catch(err => console.log(err));
    },

    // eslint-disable-next-line
    changeTrackImage({ }, data) {
      axios.put(`tracks/${data.id}/change-image`, data.image, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },

    removeTrackImage({ rootState }, id) {
      axios.put(`tracks/${id}/remove-image`, null, {
        headers: { Authorization: rootState.auth.auth.token },
      })
        .catch(err => console.log(err));
    },

    like({ rootState, commit }, id) {
      const { auth } = rootState.auth;
      axios.post(`tracks/${id}/like`, null, {
        headers: { Authorization: auth.token },
      })
        .then(() => commit('ADD_LIKE', { id, auth_id: auth.id }))
        .then(() => auth.likes.push(id))
        .catch(err => console.log(err));
    },

    dislike({ rootState, commit }, id) {
      const { auth } = rootState.auth;
      axios.post(`tracks/${id}/dislike`, null, {
        headers: { Authorization: auth.token },
      })
        .then(() => commit('REMOVE_LIKE', { id, auth_id: auth.id }))
        .then(() => auth.likes.splice(auth.likes.indexOf(id)))
        .catch(err => console.log(err));
    },

    // unused:
    // eslint-disable-next-line
    checkHasImage({ }, id) {
      axios.get(`tracks/${id}/has-image`)
        .then(result => result.data.hasImage);
    },

  },
};
