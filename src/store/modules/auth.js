import axios from '../axiosConfig';
import router from '../../router/index';
import store from '../index';

const placeholder = './placeholders/profile.jpg';
function imageUrl(id) {
  return `http://localhost:3000/images/profiles/${id}.jpg`;
}

export default {
  state: {
    auth: {
      data: {},
      id: '',
    },
  },

  mutations: {
    SET_AUTH_DATA(state, payload) {
      // eslint-disable-next-line
      payload.data.imageUrl = (payload.data.hasImage) ? imageUrl(payload.id) : placeholder;
      // eslint-disable-next-line
      state.auth = payload;
    },
    REFRESH_AUTH_DATA(state, payload) {
      // eslint-disable-next-line
      payload.data.imageUrl = (payload.data.hasImage) ? imageUrl(payload.id) : placeholder;
      // eslint-disable-next-line
      state.auth = payload.data;
      // eslint-disable-next-line
      state.auth.token = payload.token;
    },
  },

  actions: {
    login({ commit }, data) {
      axios.post('auth/login', data)
        .then((result) => {
          commit('SET_AUTH_DATA', result.data);
          router.push(`/${result.data.data.username}`);
        })
        .catch(() => store.dispatch('sendNote', { message: 'Ups... Wrong login data!' }));
    },

    refreshAuthData({ state, commit }) {
      axios.get(`auth/${state.auth.id}`)
        .then(result => commit('REFRESH_AUTH_DATA', { data: result.data, token: state.auth.token }))
        .catch(err => console.log(err));
    },
  },
};
