<template>
  <div>
    <div>
      Profile picture: <input type="file" name="profileImage" @change="addFile($event)"/>
    </div>
    <div style="position: relative">
      <div id="border" onclick=""></div>
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profileImage: null,
    };
  },
  methods: {
    addFile(event) {
      const image = new Image();
      const canvas = document.getElementById('canvas');
      const border = document.getElementById('border');
      canvas.style.display = 'block';
      border.style.display = 'inherit';

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
};
</script>

<style scoped>
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
  display: none;
}
#border:after {
  cursor: pointer;
}
#border:before {
  cursor: pointer;
}
</style>
