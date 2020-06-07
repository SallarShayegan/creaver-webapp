import EventBus from '../EventBus';

export const baseVolumeValue = 7.5;

export const prefixCls = 'vue-sound';
/* eslint-disable */
export const generateUUID = () => 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});
/* eslint-enable */

export const convertTimeHHMMSS = (val) => {
  const hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
  return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss;
};

export default {
  name: 'vue-audio',
  props: {
    file: {
      type: String,
      default: null,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    duration() {
      return this.audio ? convertTimeHHMMSS(this.totalDuration) : '';
    },
    playerId() {
      return `player-${this.uuid}`;
    },
    classes() {
      return prefixCls;
    },
  },
  data() {
    return {
      isMuted: false,
      loaded: false,
      playing: false,
      paused: true,
      progressStyle: '',
      currentTime: '00:00',
      uuid: '0',
      innerLoop: undefined,
      audio: undefined,
      totalDuration: 0,
      hideVolumeSlider: true,
      volumeValue: baseVolumeValue,
    };
  },
  methods: {
    setPosition: function name(e) {
      const tag = e.target;
      if (this.paused) return;

      if (e.target.tagName === 'SPAN') {
        return;
      }
      const pos = tag.getBoundingClientRect();
      const seekPos = (e.clientX - pos.left) / pos.width;
      this.audio.currentTime = parseInt(this.audio.duration * seekPos, 10);
    },
    updateVolume() {
      // this.hideVolumeSlider = false;
      this.audio.volume = this.volumeValue / 100;
      if (this.volumeValue / 100 > 0) {
        this.isMuted = false;
        this.audio.muted = false;
      }

      if (this.volumeValue / 100 === 0) {
        this.isMuted = true;
        this.audio.muted = true;
      }
    },
    toggleVolume() {
      // this.hideVolumeSlider = true;
    },
    stop() {
      this.playing = false;
      this.paused = true;
      this.audio.pause();
      this.audio.currentTime = 0;
    },
    play() {
      if (this.playing && !this.paused) return;
      this.paused = false;
      this.audio.play();
      this.playing = true;
    },
    pause() {
      this.paused = !this.paused;
      if (this.paused) this.audio.pause();
      else this.audio.play();
    },
    changeLoop() {
      this.innerLoop = !this.innerLoop;
    },
    download() {
      this.stop();
      window.open(this.file, 'download');
    },
    mute() {
      this.isMuted = !this.isMuted;
      this.audio.muted = this.isMuted;
      this.volumeValue = this.isMuted ? 0 : 75;
    },
    // eslint-disable-next-line
    _handleLoaded() {
      if (this.audio.readyState >= 2) {
        if (this.autoPlay) this.play();

        this.loaded = true;
        this.totalDuration = parseInt(this.audio.duration, 10);
      } else {
        throw new Error('Failed to load sound file');
      }
    },
    // eslint-disable-next-line
    _handlePlayingUI(e) {
      const currTime = parseInt(this.audio.currentTime, 10);
      const percentage = parseInt((currTime / this.totalDuration) * 100, 10);
      this.progressStyle = `width:${percentage}%;`;
      this.currentTime = convertTimeHHMMSS(currTime);
    },
    // eslint-disable-next-line
    _handlePlayPause(e) {
      if (e.type === 'pause' && this.playing === false) {
        this.progressStyle = 'width:0%;';
        this.currentTime = '00:00';
        this.paused = true;
      }
    },
    init() {
      /* eslint-disable */
      this.audio.addEventListener('timeupdate', this._handlePlayingUI);
      this.audio.addEventListener('loadeddata', this._handleLoaded);
      this.audio.addEventListener('pause', this._handlePlayPause);
      this.audio.addEventListener('play', this._handlePlayPause);
      /* eslint-enable */
    },
    getAudio() {
      return this.$el.querySelectorAll('audio')[0];
    },
  },
  created() {
    EventBus.$on('trackSelected', () => {
      this.stop();
    });
  },
  mounted() {
    this.uuid = generateUUID();
    this.audio = this.getAudio();
    this.innerLoop = this.loop;
    this.init();
  },
  beforeDestroy() {
    /* eslint-disable */
    this.audio.removeEventListener('timeupdate', this._handlePlayingUI);
    this.audio.removeEventListener('loadeddata', this._handleLoaded);
    this.audio.removeEventListener('pause', this._handlePlayPause);
    this.audio.removeEventListener('play', this._handlePlayPause);
    /* eslint-enable */
  },

};
