import axios from '../axiosConfig';
import store from '../index';
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

    getAllPersonalData({ commit }) {
      axios.get('people')
        .then(result => commit('SET_ALL_PERSONAL_DATA', result.data))
        .catch(() => store.dispatch('sendNote'));
    },

    getPersonalDataById({ commit }, id) {
      axios.get(`people/${id}`)
        .then(result => commit('ADD_PERSONS_DATA', result.data))
        .catch(() => store.dispatch('sendNote', { message: 'Person not found.' }));
    },

    // eslint-disable-next-line
    addNewPerson({ }, data) {
      axios.post('people', data)
        .then(() => {
          store.dispatch('sendNote', { type: 'info', message: 'Welcome to the community!' });
          router.push('./login');
        })
        .catch(() => store.dispatch('sendNote', { message: 'Please fill form correctly.' }));
    },

    changePersonalData({ commit }, data) {
      axios.put(`people/${data.id}`, data.data)
        .then(() => {
          store.dispatch('refreshAuthData');
          store.dispatch('sendNote', { type: 'info', message: 'Edited successfully.' });
        })
        .catch(err => console.log(err));
    },

    loadProfileData({ commit }, username) {
      axios.get(`people/profile/${username}`)
        .then((result) => {
          commit('SET_PROFILE_DATA', result.data);
        })
        .catch(err => console.log(err));
    },

    follow({ rootState, dispatch }, data) {
      if (!rootState.auth.auth.token) store.dispatch('sendNote', { type: 'error', message: 'First sign in.' });
      else if (data.following_id === data.follower_id) store.dispatch('sendNote', { type: 'error', message: "Can't follow yourself!" });
      else {
        axios.put(`people/${data.follower_id}/follow/${data.following_id}`, { token: rootState.auth.auth.token })
          .then(() => store.dispatch('refreshAuthData'))
          .catch(err => console.log(err));
      }
    },

    unfollow({ rootState, dispatch }, data) {
      axios.put(`people/${data.follower_id}/unfollow/${data.following_id}`, { token: rootState.auth.auth.token })
        .then(() => store.dispatch('refreshAuthData'))
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
