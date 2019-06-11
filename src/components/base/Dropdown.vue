<template>
  <div class="dropdown">
    <a class="dropbtn" tabindex="0">{{ text }}</a>
    <div class="dropdown-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
  },
};
</script>

<style scoped lang="scss">
@import '../../style/variables';

.dropbtn {
  color: $tertiary;
  display: block;
  outline: none;
}
.dropbtn:hover {
  color: #bbbbbb;
}
.dropdown-content {
  display: none;
  float: left;
  min-width: 160px;
  position: absolute;
  //top: 60px;
  right: 0px;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}
.dropdown-content a {
  float: none;
  display: block;
  padding: 10px;
  color: $tertiary;
}
.dropdown-content a:hover {
  background: #f4f4f4;
  color: $tertiary;
}
.dropbtn {
  cursor: pointer;
}
//.dropbtn:focus ~ .dropdown-content
.dropdown:hover .dropdown-content {
  display: block;
}
</style>
