var express = require('express');
var path = require('path');
var fs = require('fs');
var router = require('./server/routes');

var app = express();


app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));

app.use('', router);

app.use(express.static(__dirname + '/client'));


// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, '/client/index.html'));
// });


app.listen(3000, function () {
  console.log('Server listening on port 3000!')
})