<template>
  <div class="container">
    <div class="before-body"></div>
    <div class="content">
      <div class="infobar">
        <div class="track-image"
            :style="`background-image:url('${trackData.imageUrl}');`">
        </div>
        {{ trackData.data.name }}<br>
        <span class="small-text">
        {{ trackData.data.discription }}<br><br>
        Genre: {{ trackData.data.genre }}<br>
        Creation place: {{ trackData.data.place }}
        </span>
      </div>
      <div class="visubar">
        <div class="visubox"></div>
      </div>
    </div>
    <div class="after-body"></div>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.$store.dispatch('tracks/getTrackById', this.$route.params.trackId);
  },
  destroyed() {
    this.$store.commit('tracks/RESET_TRACK_DATA');
  },
  computed: {
    trackData() {
      return this.$store.getters['tracks/getTrackById'](this.$route.params.trackId) || { data: {}, likes: [] };
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: auto 1200px auto;
  min-height: 500px;
  padding: 0;
}
.content {
  display: grid;
  grid-template-columns: 350px auto;
}
.infobar {
  background: #f4f4f4;
  grid-column: 1;
  padding: 30px 60px 30px 0;
}
.track-image {
  width: 150px;
  height: 150px;
  background: #f0f0f0;
  background-size: 100%;
  margin-bottom: 10px;
}
.visubar {
  grid-column: 2;
  display: grid;
  grid-template-columns: auto 600px auto;
  // background: #000000;
  padding: 50px 0;
  min-width: 600px;
}
.visubox {
  background: #030303;
  grid-column: 2;
  width: 600px;
  height: 600px;
}
.before-body {
  background: #f4f4f4;
  grid-column: 1;
}
.after-body {
  grid-column: 3;
}

@media screen and (max-width: 800px) {
  .container {
    grid-template-columns: auto 750px auto;
    grid-template-rows: auto auto;
  }

  .visubar {
    min-width: 450px;
    grid-column: 1;
  }

  .infobar {
    grid-column: 1;
    grid-row: 2;
  }
}

@media screen and (max-width: 450px) {
  .container {
    grid-template-columns: auto 450px auto;
  }

  .content {
    grid-template-columns: 100%;
  }

  .visubar {
    min-width: 300px;
  }
}
</style>
