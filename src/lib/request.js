import axios from 'axios';

export function fetchData(url, callback) {
  axios.get(url).then(res => {
    callback(res.data);
  });
}
