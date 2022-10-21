import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Tree } from 'antd';
import { bookmarkHtml2Json } from './lib/parser';

export default function App() {

  const [bookmarks, setBookmarks] = useState();

  // get bookmark data thought api on mount
  useEffect(() => {
    const url = 'http://127.0.0.1:3000/mock/test00.html'
    axios.get(url).then(res => {
      setBookmarks(bookmarkHtml2Json(res.data))
    });
  }, []);

  console.log('this is App')

  function translate(root) {
    const res = {
      title: root.name,
      key: root.id,
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
          /> : <div>Loading</div>
      }
    </div>
  );
}
