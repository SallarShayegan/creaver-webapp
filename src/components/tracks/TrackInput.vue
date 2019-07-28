<template>
  <div class="add-track">
    <div style="float:left">
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
      <div v-if="!editingTrack">
        Select track: <input type="file" @change="addTrack($event)"/>
      </div>
    </div>
    <div style="float:right">
      <image-input @imageAdded="addImage($event)"
                   :currentImage="trackData.imageUrl"
                   placeholder="./placeholders/track.jpg"/>
    </div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
import ImageInput from '@/components/base/ImageInput.vue';

export default {
  components: {
    ImageInput,
  },
  props: {
    editingTrack: {
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
        hasImage: false,
      },
      image: null,
      trackFile: {},
    };
  },
  created() {
    if (this.editingTrack) {
      this.$store.dispatch('tracks/getTrackById', this.editingTrack)
        .then(() => {
          const trackData = this.$store.getters['tracks/getTrackById'](this.editingTrack).data;
          this.trackData.name = trackData.name;
          this.trackData.discription = trackData.discription;
          this.trackData.genre = trackData.genre;
          this.trackData.place = trackData.place;
          this.trackData.hasImage = trackData.hasImage;
          this.trackData.imageUrl = trackData.imageUrl;
        });
    }
  },
  methods: {
    sendData() {
      // [Validation]
      const result = {
        trackData: this.trackData,
        image: this.image,
      };
      if (!this.editingTrack) result.trackFile = this.trackFile;
      this.$emit('input', result);
    },
    addTrack(event) {
      // eslint-disable-next-line
      this.trackFile = event.target.files[0];
      this.sendData();
    },
    addImage(image) {
      this.image = image;
      this.trackData.hasImage = true;
      this.sendData();
    },
    removeImage() {
      this.$store.dispatch('tracks/removeTrackImage', { id: this.editingTrack });
    },
  },
};
</script>

<style scoped>
input {
  display: block;
  margin-bottom: 10px;
  min-width: 200px;
}
</style>
