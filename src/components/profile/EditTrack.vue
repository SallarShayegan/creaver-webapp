<template>
  <div>
    <h3 class="float-left">Edit track</h3>
    <div class="float-right" style="margin-top:20px">
      <button @click="$emit('close')"
              class="background-red"
              style="margin-right: 10px;">Cancel</button>
      <button @click="editTrack">Save changes</button>
    </div>
    <div style="clear:both"></div>
    <track-input @input="editedData = $event"
                 :editingTrack="id"
                 @removeClicked="deleteTrack"/>
  </div>
</template>

<script>
import TrackInput from '@/components/tracks/TrackInput.vue';

export default {
  components: {
    TrackInput,
  },
  props: {
    id: String,
  },
  data() {
    return {
      editedData: {},
    };
  },
  methods: {
    editTrack() {
      console.log(this.editedData);
      this.$store.dispatch('tracks/editTrack', {
        id: this.id,
        newData: this.editedData.trackData,
      })
        .then(() => {
          if (this.editedData.image) {
            this.$store.dispatch('tracks/changeTrackImage', {
              id: this.id,
              image: this.editedData.image,
            });
          }
        })
        .then(() => this.$emit('close'));
    },
    deleteTrack() {
      this.$store.dispatch('tracks/deleteTrack', { id: this.id })
        .then(() => this.$emit('close'));
    },
  },
};
</script>

<style>

</style>
