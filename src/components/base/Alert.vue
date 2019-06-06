<template>
  <div v-if="visible" class="alert">
    <span style="float:left">{{ message }}</span>
    <span style="float:right; cursor:pointer" @click="visible = false">x</span>
    <div style="clear:both"></div>
  </div>
</template>

<script>
export default {
  name: 'alert',
  props: {
    background: String,
    message: String,
  },
  data() {
    return {
      visible: true,
    };
  },
};
</script>

<style scoped>
.alert {
  padding: 10px 15px;
  background-color: #ffaaaa;
  color: #cc0000;
  margin: 2px 0;
}
</style>
