<template>
  <div class="container">
    <div class="before-body"></div>
    <div class="content">
      <div class="infobar">
        <div class="track-image"
            :style="`background-image:url('${trackData.imageUrl}');`">
        </div>
        <div style="font-wight: bold">{{ trackData.data.name }}</div>
        <div class="small-text">{{ trackData.data.discription }}</div>

        <div style="height: 30px"></div>

        <div class="small-text">
        Artist: <router-link :to="`/${artistData.data.username}`">
                {{ artistData.data.name }}
                </router-link><br>
        </div>
        <div class="small-text" v-if="trackData.data.genre">
          Genre: <span class="faded">{{ trackData.data.genre }}</span>
        </div>
        <div class="small-text" v-if="trackData.data.place">
          Creation Place: <span class="faded">{{ trackData.data.place }}</span>
        </div>
        <div class="small-text" v-if="trackData.sharing_date">
          Release Date: <span class="faded">{{ trackData.sharing_date | date }}</span>
        </div>

        <div style="height: 30px"></div>

        <h4>Comments (0)</h4>
        <div class="track-comments faded">
          no comments yet.
        </div>
      </div>
      <div class="visubar">
        <div class="visubox">
          <div>
            <div class="play"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="after-body"></div>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    const id = this.$route.params.trackId;
    this.$store.dispatch('tracks/getTrackById', id);
    this.$store.commit('tracks/SET_CURRENT_TRACK', id);
  },
  destroyed() {
    this.$store.commit('tracks/RESET_TRACK_DATA');
  },
  watch: {
    trackData(val) {
      this.$store.dispatch('people/getPersonalDataById', val.artist_id);
    },
  },
  computed: {
    trackData() {
      return this.$store.getters['tracks/getTrackById'](this.$route.params.trackId) || { data: {}, likes: [], artist_id: '' };
    },
    artistData() {
      return this.$store.getters['people/getPersonalDataById'](this.trackData.artist_id) || { data: {} };
    },
  },
};
</script>

<style scoped lang="scss">
@import '../style/variables';

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
.infobar div {
  padding: 2px 0;
}
.track-image {
  width: 150px;
  height: 150px;
  background: #f0f0f0;
  background-size: 100%;
  margin-bottom: 10px;
}
.track-comments {
  font-size: 11pt;
}
.faded {
  color:#b0b0b0;
}
.visubar {
  grid-column: 2;
  display: grid;
  grid-template-columns: auto 600px auto;
  background: #202020;
  padding: 50px 0;
  min-width: 600px;
}
.visubox {
  background: #030303 url('../../public/kreis-muster-01.png');
  grid-column: 2;
  width: 600px;
  height: 600px;
  display: grid;
  grid-template-columns: auto 200 auto;
  grid-template-rows: auto 200 auto;
}
.visubox div {
  grid-row: 2;
  grid-column: 2;
  color: #cccccc;
  font-size: 30pt;
  text-align: center;
}
.play {
  background: $primary url('../../public/play-white.png') no-repeat;
  background-size: 70%;
  background-position:  20px center;
  box-shadow: 0px 0px 30px #030303;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  cursor: pointer;
}
.before-body {
  background: #f4f4f4;
  grid-column: 1;
}
.after-body {
  grid-column: 3;
  background: #202020;
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
