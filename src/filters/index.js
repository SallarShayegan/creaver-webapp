import Vue from 'vue';

Vue.filter('dd.mm.yyyy', (value) => {
  const date = new Date(parseInt(value, 10));
  let day = date.getDate().toString();
  day = (day.length === 2) ? day : `0${day}`;
  let month = date.getMonth().toString();
  month = (month.length === 2) ? month : `0${month}`;
  return `${day}.${month}.${date.getFullYear()}`;
});

Vue.filter('timePassed', () => {

});

Vue.filter('secondsToMoment', (value) => {
  let sec = parseInt(value, 10);
  let h = '';
  let m = '0:';
  let s = '';
  if (sec > 3600) {
    h = `${Math.floor(sec / 3600).toString()}:`;
    sec %= 3600;
  }
  if (sec > 60) {
    m = `${Math.floor(sec / 60).toString()}:`;
  }
  s = (sec % 60).toString();
  if (s.length === 1) s = `0${s}`;
  return h + m + s;
});
