const { getProfileList } = require('../src/lib/webdav.js');
const { readFile } = require('node:fs/promises');

const username = 'bjchacha@outlook.com';
const password = 'ahypmjpcnzizbuva';

const p = { username, password };

// (async () => {
//   let files = await getProfileList(p);
//   console.log(files);
//   console.log(files['d:multistatus']['d:response']);
// })();

(async () => {
  const file = await readFile('../mock/test.html');
  const html = file.toString().split('\r\n').map((line) => line.trim());
  const bookmarks = {
    name: 'root',
    type: 'folder',
    children: [],
  };
  const stk = [];
  let cur = bookmarks.children;
  for (let line of html) {
    if (/<\/DL>/.test(line)) {
      console.log('pop: ', stk.length);
      cur = stk.pop();
    } else if (/^<DT><H3/.test(line)) {
      let folder = DT2Folder(line);
      cur.push(folder);
      stk.push(cur);
      cur = folder.children;
    } else if (/^<DT><A/.test(line)) {
      let entity = DT2Entity(line);
      cur.push(entity);
    }
  }
  console.log(bookmarks);
})();

function DT2Folder(line) {
  const res = {
    type: 'folder',
    children: [],
  };
  const exps = {
    date: /ADD_DATE="(.+?)"/i,
    last: /LAST_MODIFIED="(.+?)"/i,
    name: /">(.+?)<\/H3>$/i,
  }
  for (let [key, exp] of Object.entries(exps)) {
    const r = line.match(exp);
    if (r) res[key] = r[1];
  }
  console.log('folder: ', res.name);
  return res;
}

function DT2Entity(line) {
  const res = {
    type: 'entity',
  };
  const exps = {
    href: /HREF="(.+?)"/i,
    date: /ADD_DATE="(.+?)"/i,
    name: /">(.+?)<\/A>$/i,
  }
  for (let [key, exp] of Object.entries(exps)) {
    const r = line.match(exp);
    if (r) res[key] = r[1];
  }
  console.log('entity: ', res.name);
  return res;
}
