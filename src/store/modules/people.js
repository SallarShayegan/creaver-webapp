import Axios from 'axios';
import store from '../index';
import router from '../../router/index';

const axios = Axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 1000,
});

const placeholder = './placeholders/profile.jpg';
function imageUrl(id) {
  return `http://localhost:3000/images/profiles/${id}.jpg`;
}

export default {
  namespaced: true,
  state: {
    personalData: {
      data: {},
      id: '',
    },
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
    SET_PERSONAL_DATA(state, payload) {
      // eslint-disable-next-line
      state.personalData = payload;
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
    SET_PROFILE_DATA_TRACKS(state, payload) {
      // eslint-disable-next-line
      state.profileData.tracks.push(payload.id);
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

    logPersonIn({ commit }, data) {
      axios.post('people/login', data)
        .then((result) => {
          commit('SET_PERSONAL_DATA', result.data);
          router.push(`/${result.data.data.username}`);
        })
        .catch(() => store.dispatch('sendNote', { message: 'Ups... Wrong login data!' }));
    },

    changePersonalData({ commit }, data) {
      axios.put(`people/${data.id}`, data.data)
        .then(() => {
          commit('SET_PERSONAL_DATA', data);
          store.dispatch('sendNote', { type: 'info', message: 'Edited successfully.' });
        })
        .catch(() => store.dispatch('sendNote'));
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

    follow({ state }, data) {
      if (!state.personalData.token) store.dispatch('sendNote', { type: 'error', message: 'First sign in.' });
      else if (data.following_id === data.follower_id) store.dispatch('sendNote', { type: 'error', message: "Can't follow yourself!" });
      else {
        axios.put(`people/${data.following_id}/add-follower`, { follower_id: data.follower_id, token: state.personalData.token })
          .then(() => {
            axios.put(`people/${data.follower_id}/add-following`, { following_id: data.following_id })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      }
    },

    unfollow({ state }, data) {
      axios.put(`people/${data.following_id}/remove-follower`, { follower_id: data.follower_id, token: state.personalData.token })
        .then(() => {
          axios.put(`people/${data.follower_id}/remove-following`, { following_id: data.following_id })
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

  },
};
