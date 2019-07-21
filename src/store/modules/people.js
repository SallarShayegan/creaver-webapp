import axios from '../axiosConfig';
import router from '../../router/index';

const placeholder = './placeholders/profile.jpg';
function imageUrl(id) {
  return `http://localhost:3000/images/profiles/${id}.jpg`;
}

export default {
  namespaced: true,
  state: {
    profileData: {
      data: { imageUrl: placeholder },
      id: '',
      tracks: [],
      following: [],
      followers: [],
      hasProfilePic: false,
    },
    people: [],
  },
  mutations: {
    SET_ALL_PERSONAL_DATA(state, payload) {
      payload.forEach((person) => {
        // eslint-disable-next-line
        person.data.imageUrl = (person.data.hasImage) ? imageUrl(person.id) : placeholder;
      });
      // eslint-disable-next-line
      state.people = payload;
    },
    ADD_PERSONS_DATA(state, payload) {
      if (state.people.filter(person => payload.id === person.id).length === 0) {
        // eslint-disable-next-line
        payload.data.imageUrl = (payload.data.hasImage) ? imageUrl(payload.id) : placeholder;
        state.people.push(payload);
      }
    },
    SET_PROFILE_DATA(state, payload) {
      // eslint-disable-next-line
      payload.data.imageUrl = (payload.data.hasImage) ? imageUrl(payload.id) : placeholder;

      // eslint-disable-next-line
      state.profileData = payload;
    },
    RESET_PROFILE_DATA(state) {
      // eslint-disable-next-line
      state.profileData = {
        data: { imageUrl: placeholder },
        id: '',
        tracks: [],
        following: [],
        followers: [],
        hasProfilePic: false,
      };
    },
  },
  getters: {

    getPersonalDataById: state => (id) => {
      const result = state.people.filter(person => person.id === id);
      if (result.length < 1) return null;
      return result[0];
    },

  },
  actions: {

    getAllPersonalData({ commit, dispatch }) {
      axios.get('people')
        .then(result => commit('SET_ALL_PERSONAL_DATA', result.data))
        .catch(() => dispatch('sendNote', null, { root: true }));
    },

    getPersonalDataById({ commit, dispatch }, id) {
      axios.get(`people/${id}`)
        .then(result => commit('ADD_PERSONS_DATA', result.data))
        .catch(() => dispatch('sendNote', { message: 'Person not found.' }, { root: true }));
    },

    addNewPerson({ dispatch }, data) {
      axios.post('people', data)
        .then(() => {
          dispatch('sendNote', { type: 'info', message: 'Welcome to the community!' }, { root: true });
          router.push('./login');
        })
        .catch(() => dispatch('sendNote', { message: 'Please fill form correctly.' }, { root: true }));
    },

    changePersonalData({ rootState, dispatch }, data) {
      axios.put(`people/${data.id}`, { data: data.data }, {
        headers: { Authorization: rootState.auth.auth.token },
      })
        .then(() => {
          dispatch('refreshAuthData', null, { root: true });
          dispatch('sendNote', { type: 'info', message: 'Edited successfully.' }, { root: true });
        })
        .catch(err => console.log(err));
    },

    loadProfileData({ commit }, username) {
      axios.get(`people/profile/${username}`)
        .then(result => commit('SET_PROFILE_DATA', result.data))
        .catch(err => console.log(err));
    },

    follow({ rootState, dispatch }, data) {
      if (!rootState.auth.auth.token) dispatch('sendNote', { type: 'error', message: 'First sign in.' }, { root: true });
      else if (data.following_id === data.follower_id) dispatch('sendNote', { type: 'error', message: "Can't follow yourself!" }, { root: true });
      else {
        axios.put(`people/${data.follower_id}/follow/${data.following_id}`, null, {
          headers: { Authorization: rootState.auth.auth.token },
        })
          .then(() => dispatch('refreshAuthData', null, { root: true }))
          .catch(err => console.log(err));
      }
    },

    unfollow({ rootState, dispatch }, data) {
      axios.put(`people/${data.follower_id}/unfollow/${data.following_id}`, null, {
        headers: { Authorization: rootState.auth.auth.token },
      })
        .then(() => dispatch('refreshAuthData', null, { root: true }))
        .catch(err => console.log(err));
    },

    // eslint-disable-next-line
    changeProfileImage({ }, data) {
      axios.put(`people/${data.id}/change-image`, data.profileImage, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },

  },
};
