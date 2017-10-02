var express, config, db;
express = require('express');
config = require('./config/config');
db = require('./app/models');

var app = express();
require('./config/express')(app, config);

db.sequelize
  .sync({
    force: false
  })
  .then(function () {
    app.listen(config.port);
  })
  .catch(function(err) {
    throw new Error(err);
  });
