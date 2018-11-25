const nconf = require('nconf');

nconf.argv().env().defaults({
  SERVER_PORT: 3000,
});

const get = key => nconf.get(key);

module.exports = { get, nconf };
