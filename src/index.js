import { getProfileList } from './lib/webdav.js';

const username = 'bjchacha@outlook.com';
const password = 'ahypmjpcnzizbuva';

const p = { username, password };

let files = await getProfileList(p);
console.log(files);
console.log(files['d:multistatus']['d:response']);
