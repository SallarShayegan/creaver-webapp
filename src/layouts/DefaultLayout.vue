<template>
  <div class="layout">
    <div>
      <navbar/>
    </div>
    <div>
      <slot></slot>
    </div>
    <div><Footer/></div>
  </div>
</template>

<script>
import Navbar from '../components/base/Navbar.vue';
import Footer from '../components/base/Footer.vue';

export default {
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-rows: auto auto 100px;
}
</style>
