<template>
  <div class="track-preview" @click="play">
    <div class="thumbnail"></div>
    [Track_name]
    <div class="small-text" style="float:right">[Plays/Likes]</div>
    <div class="small-text" style="margin-top:10px;">[Discription]</div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
export default {
  methods: {
    play() {

    },
  },
};
</script>

<style scoped>
.track-preview {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.track-preview:hover {
  background: #fafafd;
}
.thumbnail {
  background: #f0f0f0;
  width: 70px;
  height: 70px;
  margin-right: 10px;
  float: left;
}
</style>
