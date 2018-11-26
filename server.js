const express = require('express');
const path = require('path');
const config = require('./configuration/serverconfig');

const app = express();
const port = config.get('SERVER_PORT');

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, './views/index.html')));
app.listen(port, () => console.log(`Server listening on port ${port}.`));
