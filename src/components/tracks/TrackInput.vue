<template>
  <div class="add-track">
    <input type="text"
           v-model="trackData.name"
           placeholder="Track name"
           @change="sendData"/>
    <input type="text"
           v-model="trackData.discription"
           placeholder="Discription"
           @change="sendData"/>
    <input type="text"
           v-model="trackData.place"
           placeholder="Creation place"
           @change="sendData"/>
    <input type="text"
           v-model="trackData.genre"
           placeholder="Genre"
           @change="sendData"/>
    <div v-if="!edittingTrack">
      Select track: <input type="file" @change="addTrack($event)"/>
    </div>
    Select image: <input type="file" @change="addImage($event)"/>
    <div v-if="edittingTrack">
      <button @click="deleteTrack">Remove track</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    edittingTrack: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      trackData: {
        name: '',
        discription: '',
        place: '',
        genre: '',
      },
      image: {},
      trackFile: {},
    };
  },
  created() {
    if (this.edittingTrack) {
      this.$store.dispatch('tracks/getTrackById', this.edittingTrack)
        .then(() => {
          const trackData = this.$store.getters.tracks.getTrackById(this.edittingTrack).data;
          this.trackData.name = trackData.name;
          this.trackData.discription = trackData.discription;
          this.trackData.genre = trackData.genre;
          this.trackData.place = trackData.place;
        });
    }
  },
  methods: {
    sendData() {
      // [Validation]
      if (this.edittingTrack) {
        this.$emit('input', this.trackData);
      } else {
        this.$emit('input', {
          trackData: { data: this.trackData },
          trackFile: this.trackFile,
          image: this.image,
        });
      }
    },
    addTrack(event) {
      // eslint-disable-next-line
      this.trackFile = event.target.files[0];
      this.sendData();
    },
    addImage(event) {
      // eslint-disable-next-line
      this.image = event.target.files[0];
      this.sendData();
    },
    deleteTrack() {
      this.$emit('removeClicked');
    },
  },
};
</script>

<style scoped>
input {
  display: block;
  margin-bottom: 10px;
}
</style>
