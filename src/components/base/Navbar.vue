<template>
  <div class="navbar">
    <slot></slot>
  </div>
</template>

<script>
export default {

};
</script>

<style scoped lang="scss">
@import '../../style/variables';

.navbar {
  display: grid;
  grid-template-columns: 50% 50%;
  background: $secondary;
  color: $tertiary;
  margin-bottom: 10px;
  padding: 20px;
}
a {
  color: $tertiary;
  margin: 0 10px;
}
a:hover {
  color: #bbbbbb;
}
</style>
