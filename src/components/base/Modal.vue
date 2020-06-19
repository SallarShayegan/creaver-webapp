<template>
  <div v-if="isVisible">
    <div class="background" @click="close"></div>
    <div class="modal"
         :style="modalSize">
      <div class="form">
        <div class="titlebar">
          <span style="float:left">{{ title }}</span>
          <span class="close" @click="close">
            <i class="fas fa-times"></i>
          </span>
          <div style="clear:both"></div>
        </div>
        <div class="content" :style="contentStyle">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
    };
  },
  props: {
    centered: {
      type: Boolean,
      default: false,
    },
    visible: {
      default: false,
      type: Boolean,
    },
    title: {
      default: '',
      type: String,
    },
    formWidth: {
      default: 300,
      type: Number,
    },
    formHeight: {
      default: 300,
      type: Number,
    },
  },
  watch: {
    visible(val) {
      this.isVisible = val;
    },
  },
  methods: {
    close() {
      this.isVisible = false;
      this.$emit('close');
      console.log('closing');
    },
  },
  computed: {
    modalSize() {
      return `grid-template-columns: auto ${this.formWidth}px auto;
              grid-template-rows: auto ${this.formHeight + 30}px auto`;
    },
    contentStyle() {
      const centered = (this.centered) ? ';display:table-cell;vertical-align:middle;text-align:center;' : '';
      return `width: ${this.formWidth}px;
              height: ${this.formHeight}px
              ${centered}`;
    },
  },
};
</script>

<style scoped>
.modal {
  display: grid;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
}
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: black;
  opacity: 0.4;
}
.close {
  cursor: pointer;
  float: right;
}
.form {
  grid-column: 2;
  grid-row: 2;
  background: #fff;
  overflow: hidden;
}
.titlebar {
  padding: 7px 10px;
  border-bottom: 1px solid #eee;
}
.content {
  overflow: scroll;
}
</style>
