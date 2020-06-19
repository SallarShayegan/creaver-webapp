import Vue from 'vue';
import VueMeta from 'vue-meta';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import style from './style/global.scss';
import filters from './filters/index';
import fontawesome from '../node_modules/@fortawesome/fontawesome-free/js/all';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  style,
  filters,
  fontawesome,
  VueMeta,
  render: h => h(App),
}).$mount('#app');
