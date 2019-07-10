<template>
  <div v-if="visible"
       id="alert"
       :class="(type === 'error') ? 'background-red' : 'background-green'">
    <span style="float:left;margin-right:30px">{{ message }}</span>
    <span style="float:right;cursor:pointer" @click="visible = false">x</span>
    <div style="clear:both"></div>
  </div>
</template>

<script>
export default {
  name: 'alert',
  props: {
    type: {
      type: String,
      default: 'error',
    },
    message: {
      type: String,
      default: 'Something went wrong!',
    },
  },
  data() {
    return {
      visible: true,
    };
  },
};
</script>

<style scoped>
#alert {
  padding: 10px 15px;
  color: #ffffff;
  margin: 2px 0;
  cursor: pointer;
}
</style>
