<template>
  <div class="track-preview" @click="play">
    <div class="thumbnail" :style="thumbnail"></div>
    {{ trackData.data.name }}
    <span v-if="editable" class="edit-button" @click="$emit('editClicked')">
      <i class="fas fa-pen"></i>
    </span>
    <div class="small-text" style="float:right">
      {{ trackData.plays }} plays | {{ trackData.likes }} likes
    </div>
    <div class="small-text" style="margin-top:10px;">{{ trackData.data.discription }}</div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      default: '',
      type: String,
    },
    editable: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {

    };
  },
  created() {
    this.$store.dispatch('getTrackById', this.id);
  },
  methods: {
    play() {
      // window.location = `http://localhost:3000/tracks/${this.id}.mp3`;
    },
  },
  computed: {
    trackData() {
      return this.$store.getters.getTrackById(this.id) || { data: {} };
    },
    thumbnail() {
      // return `background-image:url('http://localhost:3000/images/tracks/${this.id || 'nopic'}.jpg')`;
      return '';
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
.track-preview:hover .edit-button {
  display: initial;
}
.thumbnail {
  background: #f0f0f0;
  width: 70px;
  height: 70px;
  margin-right: 10px;
  float: left;
}
.edit-button {
  display: none;
  cursor: pointer;
  z-index: 1000;
  font-size: 12px;
  color: #cccccc;
}
</style>
