<template>
  <div>
    <div>
      <input type="file" name="image" @change="addFile($event)"/>
    </div>
    <div class="canvas-container">
      <div id="border" @mousedown="startDrag"
                       @mousemove="doDrag"
                       @mouseup="stopDrag"
                       :style="borderStyle">
        <div class="top-container">
          <div id="top-left"></div>
          <div id="top"></div>
          <div id="top-right"></div>
        </div>
        <div class="bottom-container">
          <div id="bottom-left"></div>
          <div id="bottom"></div>
          <div id="bottom-right"></div>
        </div>
        <div class="left-container">
          <div id="left-top"></div>
          <div id="left"></div>
          <div id="left-bottom"></div>
        </div>
        <div class="right-container">
          <div id="right-top"></div>
          <div id="right"></div>
          <div id="right-bottom"></div>
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
      mouse: {
        startX: 0, startY: 0, x: 0, y: 0,
      },
      border: {
        top: 0, left: 0, lastLeft: 0, lastTop: 0, size: 0,
      },
      canvas: { width: 0, height: 0, src: '' },
    };
  },
  computed: {
    borderStyle() {
      let top = this.border.lastTop + this.mouse.y - this.mouse.startY;
      let left = this.border.lastLeft + this.mouse.x - this.mouse.startX;
      if (top < 0) top = 0;
      if (left < 0) left = 0;
      if (top + this.border.size > this.canvas.height) top = this.canvas.height - this.border.size;
      if (left + this.border.size > this.canvas.width) left = this.canvas.width - this.border.size;
      return `top:${top}px;left:${left}px;`
           + `width:${this.border.size}px;`
           + `height:${this.border.size}px;`;
    },
  },
  methods: {
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
        this.border.left = this.getBorderX();
        this.border.top = this.getBorderY();
      }
    },
    stopDrag() {
      this.dragging = false;
      // Build cropped image:

      const canvasFile = document.createElement('canvas');
      const jpeg = new Image();

      jpeg.onload = () => {
        canvasFile.height = this.border.size;
        canvasFile.width = this.border.size;
        const canvasFile2 = canvasFile.getContext('2d');
        canvasFile2.drawImage(jpeg, this.getBorderX(), this.getBorderY(),
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
    getBorderX() {
      const { left } = document.getElementById('border').style;
      return parseInt(left.substring(0, left.indexOf('px')), 10);
    },
    getBorderY() {
      const { top } = document.getElementById('border').style;
      return parseInt(top.substring(0, top.indexOf('px')), 10);
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
      };
      image.src = URL.createObjectURL(event.target.files[0]);
    },
  },
};
</script>

<style scoped>
.canvas-container {
  position: relative;
  overflow: hidden;
  width: 400px;
}
#canvas {
  display: none;
}
#border {
  width: 100px;
  height: 100px;
  position: absolute;
  z-index: 1000;
  cursor: move;
  box-shadow: 0px 0px 10000000px #ffffff;
  display: grid;
  grid-template-columns: 5px auto 5px;
  grid-template-rows: 5px auto 5px;
  min-height: 20px;
}
#border div div {
  background: #333333;
  border: 1px solid #cccccc;
}
.top-container {
  grid-column: 2 / 3;
  grid-row: 1;
}
.bottom-container {
  grid-column: 2 / 3;
  grid-row: 3;
}
.left-container {
  grid-column: 3;
  grid-row: 2 / 3;
}
.right-container {
  grid-column: 1;
  grid-row: 2 / 3;
}
.top-container, .bottom-container {
  display: grid;
  grid-template-columns: 15% auto 20% auto 15%;
}
.left-container, .right-container {
  display: grid;
  grid-template-rows: 15% auto 20% auto 15%;
}
#top-left, #bottom-left {
  grid-column: 1;
}
#top-right, #bottom-right {
  grid-column: 5;
}
#left-top, #right-top {
  grid-row: 1;
}
#left-bottom, #right-bottom {
  grid-row: 5;
}
#top, #bottom {
  cursor: ns-resize;
  grid-column: 3;
}
#left, #right {
  cursor: ew-resize;
  grid-row: 3;
}
</style>
