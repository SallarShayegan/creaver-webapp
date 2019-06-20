import Vue from 'vue';
import VueMeta from 'vue-meta';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import style from './style/global.scss';
import fontawesome from '../node_modules/@fortawesome/fontawesome-free/js/all';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  style,
  fontawesome,
  VueMeta,
  render: h => h(App),
}).$mount('#app');
