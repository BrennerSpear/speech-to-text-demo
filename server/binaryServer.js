var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');

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