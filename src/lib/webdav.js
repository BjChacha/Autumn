import axios from 'axios';
import { parseString } from 'xml2js';

export async function getProfileList({ username, password }) {

  const auth_val = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

  const config = {
    method: 'propfind',
    url: 'https://dav.jianguoyun.com/dav/Autumn/',
    headers: {
      Depth: '1',
      Authorization: auth_val,
    }
  };

  await initFolder({ username, password });

  let res = await axios(config)
    .then((response) => {
      // console.log(response.data)
      return parseXML(response.data);
    }).catch((err) => {
      console.log(err);
    });
  return res;
}

export async function uploadBookmark({ user, password }) {

}

async function initFolder({ username, password }) {
  const auth_val = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

  const config = {
    method: 'mkcol',
    url: 'https://dav.jianguoyun.com/dav/Autumn/',
    headers: {
      Authorization: auth_val,
    }
  };

  let res = await axios(config)
    .then((response) => {
      return 0
    }).catch((err) => {
      console.log(err);
      return 1
    });
  return res;

}

async function parseXML(xml) {
  const res = await new Promise((resolve, reject) => {
    parseString(xml, (err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  })
  return res;
}

