const generate_folder = () => {
  return {
    // id: for react
    id: undefined,
    // type
    type: 'folder',
    // name to display
    name: undefined,
    // display order
    order: null,
    // date of create
    date: undefined,
    // date of last modified
    last: undefined,
    // folder's children
    children: [],
  };
};

const generate_entity = () => {
  return {
    // id: for react
    id: undefined,
    // type
    type: 'entity',
    // name to display
    name: undefined,
    // display order
    order: null,
    // url
    href: null,
    // date of create
    date: undefined,
  };
};

const hash = (string) => {
  let hash = 0;
  if (!string || string.length == 0) return '' + hash;

  for (let i = 0; i < string.length; ++i) {
    let ch = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash = hash & hash;
  }
  return '' + hash;
}

const DT2Folder = (line) => {
  const folder = generate_folder();
  folder.children = [];
  const regExps = {
    date: /ADD_DATE="(.+?)"/i,
    last: /LAST_MODIFIED="(.+?)"/i,
    name: /">(.+?)<\/H3>$/i,
  }
  for (let [key, regExp] of Object.entries(regExps)) {
    const r = line.match(regExp);
    if (r) folder[key] = r[1];
  }
  folder.id = hash(`${folder.name}${folder.date}${Math.random()}`);
  return folder;
}

const DT2Entity = (line) => {
  const entity = generate_entity();
  const regExps = {
    href: /HREF="(.+?)"/i,
    date: /ADD_DATE="(.+?)"/i,
    name: /">(.+?)<\/A>$/i,
  }
  for (let [key, regExp] of Object.entries(regExps)) {
    const r = line.match(regExp);
    if (r) entity[key] = r[1];
  }
  entity.id = hash(`${entity.name}${entity.date}${Math.random()}`);
  return entity;
}

export function bookmarkHtml2Json(html) {
  const lines = html.split('\r\n').map(line => line.trim());

  const bookmarks = generate_folder()
  bookmarks.name = 'root';
  bookmarks.id = '-1';
  const stk = [];
  let cur = bookmarks.children;

  for (let line of lines) {
    if (/<\/DL>/.test(line)) {
      cur = stk.pop();
    } else if (/^<DT><H3/.test(line)) {
      let folder = DT2Folder(line);
      cur.push(folder);
      stk.push(cur);
      cur = folder.children;
    } else if (/^<DT><A/.test(line)) {
      let entity = DT2Entity(line);
      cur.push(entity);
    } else {
    }
  }
  return bookmarks.children[0];
};

export function bookmarkJson2Node(json) {
  const node = {
    title: json.name,
    key: json.id,
    type: json.type,
    href: json.href,
    isLeaf: json.type === 'entity' ? true : false,
    children: [],
  };
  if (json.children) {
    for (const child of json.children) {
      node.children.push(bookmarkJson2Node(child));
    }
  }
  return node;
}
