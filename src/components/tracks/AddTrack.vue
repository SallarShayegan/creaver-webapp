<template>
  <div class="add-track">
    Select track:<br>
    <input type="file" @change="addTrack($event)"/>
  </div>
</template>

<script>
export default {
  methods: {
    addTrack(event) {
      const track = new FormData();
      track.append('file', event.target.files[0]);
      this.$emit('trackAdded', track);
    },
  },
};
</script>

<style scoped>

</style>
