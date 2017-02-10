var express = require('express');

var router = require('./server/routes');

require('./server/binaryServer');

var app = express();


app.use(require('morgan')('combined'));
// app.use(require('body-parser').urlencoded({ extended: true }));

app.use('', router);

app.use(express.static(__dirname + '/client'));


app.listen(3000, function () {
  console.log('Server listening on port 3000!')
});