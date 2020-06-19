import Vue from 'vue';

export default Vue.filter('date', (value) => {
  const date = new Date(parseInt(value, 10));
  let day = date.getDate().toString();
  day = (day.length === 2) ? day : `0${day}`;
  let month = date.getMonth().toString();
  month = (month.length === 2) ? month : `0${month}`;
  return `${day}.${month}.${date.getFullYear()}`;
});
