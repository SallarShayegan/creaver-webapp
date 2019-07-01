<template>
  <div v-if="signedIn" class="container">
    <div>
      <h1>Edit profile</h1>
      <div class="settings-container">
        <input class="column-100"
              type="text"
              v-model="editingData.data.username"
              placeholder="Username"/>
        <input class="column"
              type="text"
              v-model="editingData.data.name"
              placeholder="Name"/>
        <input class="column-100"
              type="text"
              v-model="editingData.data.email"
              placeholder="Email address"/>
        <input class="column-100"
              type="text"
              v-model="editingData.data.phone"
              placeholder="Phone number"/>
        <input class="column-100"
              type="text"
              v-model="editingData.data.birth_date"
              placeholder="Date of birth"/>
        <input class="column-100"
              type="text"
              v-model="editingData.data.city"
              placeholder="City"/>
        <input class="column-100"
              type="text"
              v-model="editingData.data.country"
              placeholder="Country"/>
        <div class="column-100">
          Profile picture: <input type="file" name="profileImage" @change="addFile($event)"/>
        </div>
        <div class="column" style="position: relative">
          <div id="border" onclick=""></div>
          <canvas id="canvas"></canvas>
        </div>
        <div class="column-100">
          <button @click="saveChanges" class="margin-top">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <login/>
  </div>
</template>

<script>
import Login from '@/views/Login.vue';

export default {
  components: {
    Login,
  },
  data() {
    return {
      editingData: {},
      profileImage: null,
    };
  },
  methods: {
    saveChanges() {
      this.$store.dispatch('people/changePersonalData', this.editingData);
      if (this.profileImage) {
        this.$store.dispatch('people/changeProfileImage', {
          id: this.editingData.id,
          profileImage: this.profileImage,
        });
      }
    },
    addFile(event) {
      const image = new Image();
      const canvas = document.getElementById('canvas');
      const border = document.getElementById('border');
      canvas.style.display = 'block';

      image.onload = () => {
        canvas.height = canvas.width * (image.height / image.width);
        const canvas2 = canvas.getContext('2d');
        canvas2.drawImage(image, 0, 0, canvas.width, canvas.height);
        const size = (canvas.width > canvas.height) ? canvas.height : canvas.width;
        border.style.height = `${size}px`;
        border.style.width = `${size}px`;
        const canvasFile = document.createElement('canvas');
        const jpeg = new Image();

        jpeg.onload = () => {
          canvasFile.height = size;
          canvasFile.width = size;
          const canvasFile2 = canvasFile.getContext('2d');
          canvasFile2.drawImage(jpeg, 0, 0, size, size, 0, 0, size, size);

          canvasFile.toBlob((blob) => {
            const imageFile = new FormData();
            imageFile.append('profileImage', blob);
            this.profileImage = imageFile;
          });
        };
        jpeg.src = canvas.toDataURL('image/jpeg');
      };
      image.src = URL.createObjectURL(event.target.files[0]);
    },
  },
  computed: {
    signedIn() {
      if (this.$store.state.people.personalData.token != null) {
        // eslint-disable-next-line
        this.editingData = JSON.parse(JSON.stringify(this.$store.state.people.personalData));
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped>
.settings-container {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}
.column-100 {
  grid-column-start: 1;
  grid-column-end: 3;
}
.margin-top {
  margin-top: 15px;
}
#canvas {
  display: none;
}
#border {
  border: 1px dotted #ffffff;
  width: 100px;
  height: 100px;
  position: absolute;
  z-index: 1000;
  top: 0px;
  left: 0px;
}
#border:after {
  cursor: pointer;
}
#border:before {
  cursor: pointer;
}
</style>
