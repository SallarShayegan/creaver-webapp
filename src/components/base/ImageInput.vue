<template>
  <div>
    <div>
      <input type="file" name="image" @change="addFile($event)"/>
    </div>
    <div class="canvas-container" @mousemove="doResize" @mouseup="stopResize">
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
  </div>
</template>

<script>
export default {
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
      canvas: { width: 0, height: 0, src: '' },
    };
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
    addFile(event) {
      const image = new Image();
      const canvas = document.getElementById('canvas');
      const border = document.getElementById('border');
      canvas.style.display = 'block';
      border.style.display = 'grid';

      image.onload = () => {
        canvas.height = canvas.width * (image.height / image.width);
        this.canvas.height = canvas.height;
        this.canvas.width = canvas.width;
        const canvas2 = canvas.getContext('2d');
        canvas2.drawImage(image, 0, 0, canvas.width, canvas.height);
        this.border.size = (canvas.width > canvas.height) ? canvas.height : canvas.width;

        this.canvas.src = canvas.toDataURL('image/jpeg');
        this.prepareImage();
      };
      image.src = URL.createObjectURL(event.target.files[0]);
    },
    prepareImage() {
      // Build cropped image:
      const canvasFile = document.createElement('canvas');
      const jpeg = new Image();

      jpeg.onload = () => {
        canvasFile.height = this.border.size;
        canvasFile.width = this.border.size;
        const canvasFile2 = canvasFile.getContext('2d');
        canvasFile2.drawImage(jpeg, this.border.left, this.border.top,
          this.border.size, this.border.size,
          0, 0, this.border.size, this.border.size);

        canvasFile.toBlob((blob) => {
          const imageFile = new FormData();
          imageFile.append('image', blob);
          this.image = imageFile;
          this.$emit('imageAdded', imageFile);
        });
      };
      jpeg.src = this.canvas.src;
    },
  },
};
</script>

<style scoped>
input {
  margin-bottom: 10px;
}
.canvas-container {
  position: relative;
  overflow: hidden;
  width: 400px;
}
#canvas {
  display: none;
}
#border {
  position: absolute;
  border: 1px solid #ffffff;
  z-index: 1000;
  cursor: move;
  box-shadow: 0px 0px 10000px #ffffff;
  display: grid;
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
