import React, { useEffect, useState } from "react";
import { Tree } from 'antd';
import { bookmarkHtml2Json } from './lib/parser';
import { openNewTab } from './lib/utils';
import { fetchData } from './lib/request';

export default function App() {

  const [bookmarks, setBookmarks] = useState();

  const handleSelect = (_, { node }) => {
    console.log(node);
    if (node.type === 'entity') {
      openNewTab(node.href)
    }
  }


  // get bookmark data thought api on mount
  useEffect(() => {
    const url = 'http://127.0.0.1:3000/mock/test00.html';
    fetchData(url, data => {
      setBookmarks(bookmarkHtml2Json(data));
    })
  }, []);

  console.log('this is App')

  function translate(root) {
    const res = {
      title: root.name,
      key: root.id,
      type: root.type,
      href: root.href,
      children: [],
    };
    if (root.children) {
      for (const node of root.children) {
        res.children.push(translate(node));
      }
    }
    return res;
  }

  return (
    <div>
      <div>This is react app</div>
      {
        bookmarks ?
          <Tree
            treeData={[translate(bookmarks)]}
            onSelect={handleSelect}
          /> : <div>Loading</div>
      }
    </div>
  );
}
