import store from './index';

export default {
  alert(type, message) {
    store.dispatch('sendNote', { type: type, message: message });
  },
};
