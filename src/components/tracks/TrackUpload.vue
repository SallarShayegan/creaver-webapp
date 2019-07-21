<template>
  <div>
    <h3 class="float-left">Add your track</h3>
    <div class="float-right" style="margin-top:20px">
      <button @click="$emit('close')"
              class="background-red"
              style="margin-right: 10px;">Cancel</button>
      <button @click="upload">Done</button>
    </div>
    <div style="clear:both"></div>
    <track-input @input="newTrack = $event"/>
  </div>
</template>

<script>
import TrackInput from '@/components/tracks/TrackInput.vue';

export default {
  components: {
    TrackInput,
  },
  data() {
    return {
      newTrack: {
        trackData: {},
      },
    };
  },
  methods: {
    upload() {
      const data = new FormData();
      data.append('track', this.newTrack.trackFile);
      data.append('trackData', JSON.stringify(this.newTrack.trackData));

      this.$store.dispatch('tracks/uploadTrack', { data, image: this.newTrack.image })
        .then(() => this.$emit('close'));
    },
  },
};
</script>

<style>

</style>
