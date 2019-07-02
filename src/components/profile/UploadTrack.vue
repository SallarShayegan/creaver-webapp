<template>
  <div>
    <h3 class="float-left">Add your track</h3>
    <div class="float-right" style="margin-top:20px">
      <button @click="$emit('close')"
              class="background-red"
              style="margin-right: 10px;">cancel</button>
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
  props: {
    artistId: String,
  },
  data() {
    return {
      newTrack: {
        trackData: {
          artist_id: '',
          data: {},
        },
      },
    };
  },
  methods: {
    upload() {
      const data = new FormData();
      data.append('track', this.newTrack.trackFile);
      this.newTrack.trackData.artist_id = this.id;
      data.append('trackData', JSON.stringify(this.newTrack.trackData));
      const image = new FormData();
      image.append('image', this.newTrack.image);
      this.$store.dispatch('tracks/uploadTrack', { data, image })
        .then(() => this.$emit('close'));
    },
  },
};
</script>

<style>

</style>
