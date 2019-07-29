import VueJwtDecode from 'vue-jwt-decode';
import axios from '../axiosConfig';
import router from '../../router/index';

const placeholder = './placeholders/profile.jpg';
function imageUrl(id) {
  return `http://localhost:3000/images/profiles/${id}.jpg`;
}

export default {
  state: {
    auth: {
      data: {},
      id: '',
      following: [],
    },
  },

  mutations: {
    SET_AUTH_DATA(state, payload) {
      // eslint-disable-next-line
      payload.imageUrl = (payload.hasImage) ? imageUrl(payload.id) : placeholder;
      // eslint-disable-next-line
      state.auth = payload;
    },
    REFRESH_AUTH_DATA(state, payload) {
      // eslint-disable-next-line
      payload.data.imageUrl = (payload.data.hasImage) ? imageUrl(payload.data.id) : placeholder;
      // eslint-disable-next-line
      state.auth = payload.data;
      // eslint-disable-next-line
      state.auth.token = payload.token;
    },
    UPDATE_ACCESS_TOKEN(state, token) {
      // eslint-disable-next-line
      state.auth.token = token;
    },
  },

  actions: {
    login({ commit, dispatch }, data) {
      axios.post('auth/login', data)
        .then((result) => {
          commit('SET_AUTH_DATA', result.data);
          localStorage.setItem('accessToken', result.data.token);
          router.push(`/${result.data.data.username}`);
        })
        .catch(() => dispatch('sendNote', { message: 'Ups... Wrong login data!' }, { root: true }));
    },

    // Logs person out
    logout({ commit }) {
      localStorage.setItem('accessToken', null);
      commit('SET_AUTH_DATA', { data: {}, id: '' });
    },

    // Fetches localStorage to get token
    fetchAccessToken({ dispatch }) {
      const token = localStorage.getItem('accessToken');
      if (token !== 'null' && token) {
        const authData = VueJwtDecode.decode(token);
        // Check for access expiration:
        if (authData.exp < Date.now() / 1000) router.push('/login');
        else dispatch('refreshAuthData', { id: authData.id, token });
      }
    },

    // Gets personal data from backend and sets value to auth
    refreshAuthData({ state, commit }, data) {
      // eslint-disable-next-line
      if (!data) data = { id: state.auth.id, token: state.auth.token };
      axios.get(`auth/${data.id}`)
        .then(result => commit('REFRESH_AUTH_DATA', { data: result.data, token: data.token }))
        .catch(err => console.log(err));
    },
  },
};
