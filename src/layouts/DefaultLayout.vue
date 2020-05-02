<template>
  <div class="layout">
    <div class="alert-container" ref="alertContainer">
      <alert v-for="alert in alerts"
             :key="alert.index"
             :message="alert.message"
             :type="alert.type"/>
    </div>
    <div><navbar/></div>
    <div><slot></slot></div>
    <div><Footer/></div>
  </div>
</template>

<script>
import Navbar from '@/components/base/Navbar.vue';
import Footer from '@/components/base/Footer.vue';
import Alert from '@/components/base/Alert.vue';

export default {
  components: {
    Navbar,
    Footer,
    Alert,
  },
  computed: {
    alerts() {
      return this.$store.state.notes;
    },
  },
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-rows: auto auto 100px;
}
.alert-container {
  opacity: 0.7;
  position: fixed;
  z-index: 10000;
  max-width: 400px;
  top: 20px;
  right: 20px;
}
</style>
