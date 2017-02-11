var binaryServer = require('binaryjs').BinaryServer;
var binaryClient = require('binaryjs').BinaryClient;
var wav = require('wav');
const Speech = require('@google-cloud/speech');
require('dotenv');


//for exporting to a wav file//
///////////////////////////////

// var outFile = 'demo.wav';
// var fileWriter = new wav.FileWriter(outFile, {
//     channels: 1,
//     sampleRate: 44100,
//     bitDepth: 16
//   });

const request = {
  config: {
    encoding: 'LINEAR16',
    sampleRate: 44100
  }
};

const audioServer = binaryServer({port: 9001});
// const textServer = binaryServer({port: 9002});

// var textStream = null;

// textServer.on('connection', textClient => {
//   textStream = textClient.createStream();

//   // textStream.on('data', data => {
//   //   console.log('data from 9002 on the server: ', data);
//   // });

//   console.log('new textStream');
//   // var outboundData = {data: 'hello from the server'};

//   // textStream.write(outboundData);
// });



audioServer.on('connection', audioClient => {
  console.log('new connection');

  audioClient.on('stream', (audioStream, meta) => {
    console.log('new audioStream');

    //Create instance of Google Speech
    const speech = Speech();
    //create a place to pipe audio data
    const recognizeStream = speech.createRecognizeStream(request)
    .on('error', console.error)
    .on('data', (data) => {
      
      // console.log(textStream);
      // textStream.write(data.results);
      console.log(data);
      // process.stdout.write(data);
    });

    //pipe audio from the websocket to google speech
    audioStream.pipe(recognizeStream);

    // audioStream.pipe(fileWriter);

    //end on end or close
    audioStream.on('end', () => {
      // fileWriter.end();
      //alert ending audioStream
      console.log('\nending audioStream');
    });

    audioClient.on('close', () => {
      //never seem to need this but just in case
      console.log('closing audioServer');
    });
    
  });

});


// export GOOGLE_APPLICATION_CREDENTIALS=/Users/BrennerSpear/hackreactor/speech-to-text-demo/PalFinder-f5b1b61fd250.json
