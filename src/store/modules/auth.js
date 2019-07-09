import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 1000,
});

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
      state.auth = payload;
    },
  },

  actions: {
    login({ state, commit }, data) {
      axios.post('auth/login', data)
        .then(result => commit('SET_AUTH_DATA', result.data))
        .catch(err => state.errors.login.push(err));
    },
  },
};
