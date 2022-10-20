import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Tree } from 'antd';
import { bookmark2json } from './lib/parser';

export default function App() {

  const [bookmarks, setBookmarks] = useState();

  // run on mount
  useEffect(() => {
    const url = 'http://127.0.0.1:3000/mock/test00.html'
    axios.get(url).then(res => {
      setBookmarks(bookmark2json(res.data))
      console.log('useEffect: ', res.data);
      console.log(bookmark2json(res.data));
    });
  }, []);

  console.log('this is App')

  function translate(root) {
    const res = {
      title: root.name,
      children: [],
    };
    for (const node of root.children) {
      res.children.push(translate(node));
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
