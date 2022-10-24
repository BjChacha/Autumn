import React, { useEffect, useState } from "react";
import { Tree, Dropdown, Menu } from 'antd';
import { bookmarkHtml2Json, bookmarkJson2Node } from './lib/parser';
import { openNewTab } from './lib/utils';
import { fetchData } from './lib/request';

const menu = (items) => {
  return (
    <Menu
      items={items}
    />
  )
}

const entityMenuItems = [
  {
    label: (
      <a onClick={() => console.log(target)}>Edit</a>
    ),
    key: 1,
  },
  {
    label: 'Copy',
    key: 2,
  },
  {
    label: 'Delete',
    key: 3,
  }
];

const folderMenuItems = [
  {
    label: 'Edit',
    key: 1,
  },
  {
    label: 'Delete',
    key: 3,
  }
];

const listMenuItems = [
  {
    label: 'Edit',
    key: 1,
  },
  {
    label: 'Delete',
    key: 2,
  },
  {
    label: 'Group',
    key: 3,
  },
];

export default function App() {

  // bookmark data 
  const [bookmarks, setBookmarks] = useState();
  // hold ctrl to not open bookmark
  const [mode, setMode] = useState('normal');
  // selected target
  const [target, setTarget] = useState([]);

  const handleSelect = (_, { node, nativeEvent: e }) => {
    switch (mode) {
      case 'normal':
        e.preventDefault();
        if (node.type === 'entity') {
          setTarget(node);
          openNewTab(node.href);
        }
        break;
      case 'control':
        setTarget([...target, node]);
        break;
    }
  }

  const handleKeyUp = (e) => {
    if (mode === 'control' && e.code === 'ControlLeft') setMode('normal');
  }

  const handleKeyDown = (e) => {
    if (mode === 'normal' && e.code === 'ControlLeft') setMode('control');
  }

  const handleRightClick = (e) => {
    if (target.length > 1)
      setTarget([e.node]);
  }

  const adaptiveOverlay = () => {
    let items = null;
    if (target && target instanceof Array && target.length > 0) {
      console.log(target);
      if (target.length > 1) {
        items = listMenuItems;
      } else if (target[0].type === 'folder') {
        items = folderMenuItems;
      } else if (target[0].type === 'entity') {
        items = entityMenuItems;
      } else {
        console.log('Unknown target menu type: ', target);
      }
    }
    return menu(items);
  }

  // get bookmark data thought api on mount
  useEffect(() => {
    const url = 'http://127.0.0.1:3000/mock/test00.html';
    fetchData(url, data => {
      setBookmarks(bookmarkHtml2Json(data));
    })
  }, []);

  return (
    <div
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex='0'
    >
      <div>This is react app</div>
      {
        bookmarks ?
          <Dropdown
            overlay={adaptiveOverlay()}
            trigger={['contextMenu']}
          >
            <Tree.DirectoryTree
              multiple
              treeData={[bookmarkJson2Node(bookmarks)]}
              onSelect={handleSelect}
              onRightClick={handleRightClick}
            // TODO: virtual scroll optimization
            // height={window.innerHeight - 200}
            />
          </Dropdown>
          : <div>Loading</div>
      }
    </div >
  );
}
