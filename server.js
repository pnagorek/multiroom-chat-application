const express = require('express');
const config = require('./configuration/serverconfig');

const app = express();
const port = config.get('SERVER_PORT');

app.use(express.static('public'));

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Server listening on port ${port}.`));
