import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import SignUp from '@/views/SignUp.vue';
import Login from '@/views/Login.vue';
import Settings from '@/views/Settings.vue';
import Profile from '@/views/Profile.vue';
import Track from '@/views/Track.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUp,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/:username',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/:username/:trackId',
      name: 'track',
      component: Track,
    },
  ],
});
