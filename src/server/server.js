const express = require('express');
const fs = require('node:fs/promises');
const path = require('path');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('server is on');
});

app.get('/mock/:filename', (req, res) => {
  res.sendFile(path.resolve(__dirname, `mock/${req.params.filename}`));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
