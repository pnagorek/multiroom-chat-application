const express = require('express');
const path = require('path');
const http = require('http');

const config = require('./configuration/serverconfig');
const chatServer = require('./src/chatServer');

const app = express();
const server = http.Server(app);

const PORT = config.get('SERVER_PORT');

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, './views/index.html')));
server.listen(PORT, () => { console.log(`Server started on port ${PORT}`); });

chatServer.listen(server);
