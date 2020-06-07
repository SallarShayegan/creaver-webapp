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
      data: {},
      id: '',
      tracks: [],
      following: [],
      followers: [],
      imageUrl: placeholder,
    },
    people: [],
  },
  mutations: {
    SET_ALL_PERSONAL_DATA(state, payload) {
      payload.forEach((person) => {
        // eslint-disable-next-line
        person.imageUrl = (person.hasImage) ? imageUrl(person.id) : placeholder;
      });
      // eslint-disable-next-line
      state.people = payload;
    },
    ADD_PERSONS_DATA(state, payload) {
      if (state.people.filter(person => payload.id === person.id).length === 0) {
        // eslint-disable-next-line
        payload.imageUrl = (payload.hasImage) ? imageUrl(payload.id) : placeholder;
        state.people.push(payload);
      }
    },
    SET_PROFILE_DATA(state, payload) {
      // eslint-disable-next-line
      payload.imageUrl = (payload.hasImage) ? imageUrl(payload.id) : placeholder;

      // eslint-disable-next-line
      state.profileData = payload;
    },
    RESET_PROFILE_DATA(state) {
      // eslint-disable-next-line
      state.profileData = {
        data: {},
        id: '',
        tracks: [],
        following: [],
        followers: [],
        imageUrl: placeholder,
      };
    },
    ADD_FOLLOWER(state, payload) {
      if (state.profileData.id === payload.following_id
        && !state.profileData.followers.includes(payload.follower_id)) {
        state.profileData.followers.push(payload.follower_id);
      }
    },
    REMOVE_FOLLOWER(state, payload) {
      if (state.profileData.id === payload.following_id) {
        const index = state.profileData.followers.indexOf(payload.follower_id);
        state.profileData.followers.splice(index, 1);
      }
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
      /*
      const result = await axios.get(`people/${id}`);
      try {
        commit('ADD_PERSONS_DATA', result.data);
      } catch (err) {
        dispatch('sendNote', { message: 'Person not found.' }, { root: true });
      }
      return result.data;
      */
    },

    loadProfileData({ commit }, username) {
      axios.get(`people/profile/${username}`)
        .then(result => commit('SET_PROFILE_DATA', result.data))
        .catch(err => console.log(err));
    },

    addNewPerson({ dispatch }, data) {
      axios.post('people', data)
        .then(() => {
          dispatch('sendNote', { type: 'info', message: 'Welcome to the community!' }, { root: true });
          router.push('./login');
        })
        .catch(() => dispatch('sendNote', { message: 'Please fill form correctly.' }, { root: true }));
    },

    async changePersonalData({ rootState, dispatch }, data) {
      await axios.put('auth/edit-profile', { data: data.data }, {
        headers: { Authorization: rootState.auth.auth.token },
      });
      if (data.image) {
        await dispatch('changeProfileImage', {
          id: data.id,
          profileImage: data.image,
        });
      } else if (data.deleteImage) await dispatch('removeProfileImage', data.id);
      await dispatch('refreshAuthData', null, { root: true });
      dispatch('sendNote', { type: 'info', message: 'Edited successfully.' }, { root: true });
    },

    changeProfileImage({ rootState }, data) {
      axios.put('auth/change-image', data.profileImage, {
        headers: {
          Authorization: rootState.auth.auth.token,
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    removeProfileImage({ rootState }) {
      axios.put('auth/remove-image', null, {
        headers: { Authorization: rootState.auth.auth.token },
      })
        .catch(err => console.log(err));
    },

    follow({ rootState, dispatch, commit }, data) {
      if (!rootState.auth.auth.token) dispatch('sendNote', { type: 'error', message: 'First sign in.' }, { root: true });
      else if (data.following_id === data.follower_id) dispatch('sendNote', { type: 'error', message: "Can't follow yourself!" }, { root: true });
      else {
        axios.put(`auth/follow/${data.following_id}`, null, {
          headers: { Authorization: rootState.auth.auth.token },
        })
          .then(() => dispatch('refreshAuthData', null, { root: true }))
          .then(() => commit('ADD_FOLLOWER', data))
          .catch(err => console.log(err));
      }
    },

    unfollow({ rootState, dispatch, commit }, data) {
      axios.put(`auth/unfollow/${data.following_id}`, null, {
        headers: { Authorization: rootState.auth.auth.token },
      })
        .then(() => dispatch('refreshAuthData', null, { root: true }))
        .then(() => commit('REMOVE_FOLLOWER', data))
        .catch(err => console.log(err));
    },

  },
};
