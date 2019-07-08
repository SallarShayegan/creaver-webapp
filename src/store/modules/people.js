import Axios from 'axios';

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
    errors: {
      signUp: [],
      login: [],
      settings: [],
    },
    people: [],
  },
  mutations: {
    SET_ALL_PERSONAL_DATA(state, payload) {
      payload.forEach(person => {
        person.data.imageUrl = (person.data.hasImage) ? imageUrl(person.id) : placeholder;
      });
      // eslint-disable-next-line
      state.people = payload;
    },
    ADD_PERSONS_DATA(state, payload) {
      if (state.people.filter(person => payload.id === person.id).length === 0) {
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
      state.profileData =  {
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
        .catch(err => console.log(err));
    },

    getPersonalDataById({ commit }, id) {
      axios.get(`people/${id}`)
        .then(result => commit('ADD_PERSONS_DATA', result.data))
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
    follow({ }, data) {
      axios.put(`people/${data.following_id}/add-follower`, { follower_id: data.follower_id })
        .then(() => {
          axios.put(`people/${data.follower_id}/add-following`, { following_id: data.following_id })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    },

    // eslint-disable-next-line
    unfollow({ }, data) {
      axios.put(`people/${data.following_id}/remove-follower`, { follower_id: data.follower_id })
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
