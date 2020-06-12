<template>
  <div>
    <div style="float:left;width:40px">
      <div class="upload-btn-wrapper">
        <input type="file" @change="addFile($event)"/>
        <button class="tool-button"><i class="fas fa-pen"></i></button>
      </div>
      <button class="tool-button" @click="removeImage">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="canvas-container"
         @mousemove="doResize"
         @mouseup="stopResize"
         style="float:rigth">
      <div id="border" @mousedown.self="startDrag"
                       @mousemove="doDrag"
                       @mouseup="stopDrag"
                       :style="borderStyle">
        <div class="ne-container">
          <div id="top-right" @mousedown="startResize($event, 'ne')"></div>
          <div id="right-top" @mousedown="startResize($event, 'ne')"></div>
        </div>
        <div class="nw-container">
          <div id="top-left" @mousedown="startResize($event, 'nw')"></div>
          <div id="left-top" @mousedown="startResize($event, 'nw')"></div>
        </div>
        <div class="se-container">
          <div id="bottom-right" @mousedown="startResize($event, 'se')"></div>
          <div id="right-bottom" @mousedown="startResize($event, 'se')"></div>
        </div>
        <div class="sw-container">
          <div id="bottom-left" @mousedown="startResize($event, 'sw')"></div>
          <div id="left-bottom" @mousedown="startResize($event, 'sw')"></div>
        </div>
      </div>
      <canvas id="canvas"></canvas>
    </div>
    <div style="clear:both"></div>

      <canvas id="original"></canvas>
  </div>
</template>

<script>
import exifReader from './exifReader';

export default {
  props: {
    currentImage: String,
    placeholder: String,
  },
  data() {
    return {
      image: null,
      dragging: false,
      resizing: false,
      mouse: {
        startX: 0, startY: 0, x: 0, y: 0,
      },
      border: {
        top: 0, left: 0, lastLeft: 0, lastTop: 0, size: 0, lastSize: 0,
      },
      canvas: {
        width: 0, height: 0, src: '', rotation: 0,
      },
    };
  },
  watch: {
    currentImage() {
      this.addFile(null, this.currentImage ? this.currentImage : this.placeholder);
    },
  },
  mounted() {
    this.addFile(null, this.currentImage ? this.currentImage : this.placeholder);
  },
  computed: {
    borderStyle() {
      let { top } = this.border;
      let { left } = this.border;
      let { size } = this.border;
      const dx = this.mouse.x - this.mouse.startX;
      const dy = this.mouse.y - this.mouse.startY;
      const minDistance = ((dx < dy) ? dx : dy);

      if (this.dragging) {
        top = this.border.lastTop + dy;
        left = this.border.lastLeft + dx;
      } else if (this.resizing === 'ne') { // top-right resize
        top = this.border.top + minDistance;
        size = this.border.size - minDistance;
      } else if (this.resizing === 'nw') { // top-left resize
        top = this.border.top + minDistance;
        left = this.border.left + minDistance;
        size = this.border.size - minDistance;
      } else if (this.resizing === 'se') { // bottom-right resize
        size = this.border.size + minDistance;
      } else if (this.resizing === 'sw') { // bottom-left resize
        left = this.border.left + minDistance;
        size = this.border.size - minDistance;
      }
      if (top < 0) top = 0;
      if (left < 0) left = 0;
      if (top + this.border.size > this.canvas.height) top = this.canvas.height - this.border.size;
      if (left + this.border.size > this.canvas.width) left = this.canvas.width - this.border.size;
      if (size > this.canvas.height) size = this.canvas.height;
      if (size > this.canvas.width) size = this.canvas.width;
      return `top:${top}px;left:${left}px;`
           + `width:${size}px;`
           + `height:${size}px;`;
    },
  },
  methods: {
    startResize(event, type) {
      this.border.lastSize = this.border.size;
      this.resizing = type;
      this.mouse.startX = event.clientX;
      this.mouse.startY = event.clientY;
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
    },
    doResize(event) {
      if (this.resizing) {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
      }
    },
    stopResize() {
      this.resizing = false;
      this.border.size = this.getBorderSize();
      this.prepareImage();
    },
    startDrag(event) {
      this.border.lastLeft = this.border.left;
      this.border.lastTop = this.border.top;
      this.dragging = true;
      this.mouse.startX = event.clientX;
      this.mouse.startY = event.clientY;
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
    },
    doDrag(event) {
      if (this.dragging) {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
      }
    },
    stopDrag() {
      this.dragging = false;
      this.border.left = this.getBorderX();
      this.border.top = this.getBorderY();
      this.prepareImage();
    },
    getBorderX() {
      const { left } = document.getElementById('border').style;
      return parseInt(left.substring(0, left.indexOf('px')), 10);
    },
    getBorderY() {
      const { top } = document.getElementById('border').style;
      return parseInt(top.substring(0, top.indexOf('px')), 10);
    },
    getBorderSize() {
      const { width } = document.getElementById('border').style;
      return parseInt(width.substring(0, width.indexOf('px')), 10);
    },
    addFile(event, current) {
      const image = new Image();
      const canvas = document.getElementById('canvas');
      const original = document.getElementById('original');
      const border = document.getElementById('border');
      canvas.style.display = 'block';
      if (event) border.style.display = 'grid';

      image.onload = () => {
        canvas.height = canvas.width * (image.height / image.width);
        original.height = image.height;
        original.width = image.width;
        this.canvas.height = canvas.height;
        this.canvas.width = canvas.width;
        const context = canvas.getContext('2d');
        const originalContext = original.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        originalContext.drawImage(image, 0, 0, image.width, image.height);

        this.border.size = (canvas.width > canvas.height) ? canvas.height : canvas.width;
        if (event) {
          // this.canvas.src = canvas.toDataURL('image/jpeg');
          this.canvas.src = original.toDataURL('image/jpeg');
          this.prepareImage();
        }
      };
      if (event) {
        image.src = window.URL.createObjectURL(event.target.files[0]);
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const orientation = exifReader(e.target.result).Orientation;
          switch (orientation) {
            case 8:
              this.canvas.rotation = -90;
              break;
            case 3:
              this.canvas.rotation = 180;
              break;
            case 6:
              this.canvas.rotation = 90;
              break;
            default:
              this.canvas.rotation = 0;
          }
        };
        fileReader.readAsDataURL(event.target.files[0]);
      } else if (current) image.src = current;
    },
    removeImage() {
      this.addFile(null, this.placeholder);
      this.$emit('imageRemoved');
    },
    prepareImage() {
      // Build cropped image:
      const canvas = document.createElement('canvas');
      const original = document.getElementById('original');
      const cropped = new Image();

      cropped.onload = () => {
        /*
        canvas.height = this.border.size;
        canvas.width = this.border.size;
        const context = canvas.getContext('2d');
        context.drawImage(cropped, this.border.left, this.border.top,
          this.border.size, this.border.size,
          0, 0, this.border.size, this.border.size);
        */
        const left = this.border.left * original.width / this.canvas.width;
        const top = this.border.top * original.height / this.canvas.height;

        const size = this.border.size * original.width / canvas.width;
        canvas.width = 400;
        canvas.height = 400;

        const context = canvas.getContext('2d');
        context.drawImage(cropped, left, top,
          size, size,
          0, 0, 400, 400);

        canvas.toBlob((blob) => {
          const imageFile = new FormData();
          imageFile.append('image', blob);
          this.image = imageFile;
          this.$emit('imageAdded', imageFile);
        });
      };
      cropped.src = this.canvas.src;
    },
  },
};

</script>

<style scoped lang="scss">
@import '../../../style/variables';

.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}
.upload-btn-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.tool-button {
  padding: 10px;
  border-radius: 50%;
  background: $primary;
  color: white;
  font-size: 15px;
  cursor: pointer;
}
.canvas-container {
  position: relative;
  overflow: hidden;
  width: 300px;
}
#canvas {
  display: block;
  background: #f0f0f0;
}
#original {
  display: none;
}
#border {
  position: absolute;
  border: 1px solid #ffffff;
  z-index: 1000;
  cursor: move;
  box-shadow: 0px 0px 10000px #ffffff;
  display: none;
  grid-template-columns: 30px auto 30px;
  grid-template-rows: 30px auto 30px;
  min-height: 60px;
  min-width: 60px;
}
#border div {
  display: grid;
  grid-template-columns: 5px auto 5px;
  grid-template-rows: 5px auto 5px;
}
#border div div {
  background: #000000;
  opacity: 0.5;
}
.ne-container {
  grid-column: 3;
  grid-row: 1;
}
.nw-container {
  grid-column: 1;
  grid-row: 1;
}
.se-container {
  grid-column: 3;
  grid-row: 3;
}
.sw-container {
  grid-column: 1;
  grid-row: 3;
}
#top-left, #top-right {
  grid-column: 1 / 3;
  grid-row: 1;
}
#bottom-left, #bottom-right {
  grid-column: 1 / 3;
  grid-row: 3;
}
#left-top, #left-bottom {
  grid-column: 1;
  grid-row: 1 / 3;
}
#right-top, #right-bottom {
  grid-column: 3;
  grid-row: 1 / 3;
}
#top-left, #left-top, #bottom-right, #right-bottom {
  cursor: nwse-resize;
}
#top-right, #right-top, #bottom-left, #left-bottom {
  cursor: nesw-resize;
}
</style>
