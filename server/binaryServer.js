var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
const Speech = require('@google-cloud/speech');
require('dotenv');

const request = {
  config: {
    encoding: 'LINEAR16',
    sampleRate: 48000
  }
};


bServer = binaryServer({port: 9001});

bServer.on('connection', client => {
  console.log('new connection');

  client.on('stream', (stream, meta) => {
    console.log('new stream');

    //Create instance of Google Speech
    const speech = Speech();
    //create a place to pipe audio data
    const recognizeStream = speech.createRecognizeStream(request)
    .on('error', console.error)
    .on('data', (data) => {
      //send text data to console
      // console.log(data);
      process.stdout.write(data.results);
    });

    //pipe audio from the websocket to google speech
    stream.pipe(recognizeStream);

    //end on end or close
    stream.on('end', () => {
      //alert ending stream
      console.log('\nending stream');
    });

    client.on('close', () => {
      //never seem to need this but just in case
      console.log('closing client');
    });
    
  });

});


// GOOGLE_APPLICATION_CREDENTIALS=/Users/BrennerSpear/hackreactor/speech-to-text-demo/PalFinder-f5b1b61fd250.json