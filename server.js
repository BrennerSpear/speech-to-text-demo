var express = require('express');
var path = require('path');
var fs = require('fs');
var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');

var router = require('./server/routes');


var app = express();


app.use(require('morgan')('combined'));
// app.use(require('body-parser').urlencoded({ extended: true }));

app.use('', router);

app.use(express.static(__dirname + '/client'));


// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, '/client/index.html'));
// });


app.listen(3000, function () {
  console.log('Server listening on port 3000!')
});


bServer = binaryServer({port: 9001});

bServer.on('connection', client => {
  console.log('new connection');

  var filename = 'Recording: '.concat(Date(), '.wav');

  var fileWriter = new wav.FileWriter(filename, {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });

  client.on('stream', (stream, meta) => {
    console.log('new stream');
    stream.pipe(fileWriter);

    //end on end or close
    stream.on('end', () => {
      fileWriter.end();
      console.log('ending stream');
    });

    client.on('close', () => {
      if(fileWriter != null) {
        fileWriter.end();
        console.log('closing client');
      }
    });
    
  });

});