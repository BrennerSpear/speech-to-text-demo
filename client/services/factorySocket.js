angular.module('myApp').factory('socket', function($http) {

  var factory = {};

  factory.localStream = null;
  factory.localAudioContext = null;

  factory.stopRecording = function() {
    window.Stream.end();
    this.localAudioContext.close();
    this.localStream.getTracks()[0].stop();
  }

  factory.runSocket = function() {

    function convertFloat32ToInt16(buffer) {
      l = buffer.length;
      buf = new Int16Array(l);
      while (l--) {
        buf[l] = Math.min(1, buffer[l])*0x7FFF;
      }
      return buf.buffer;
    }

    var session = {
      audio: true,
      video: false
    };

    var recorderProcess = function(e) {
      var left = e.inputBuffer.getChannelData(0);
      window.Stream.write(convertFloat32ToInt16(left));
    }

    var initializeRecorder = function(stream) {

      factory.localStream = stream;
      console.log('stream:', stream);
      console.log('inside initializeRecorder');

      var audioContext = window.AudioContext;
      var context = new audioContext();

      //set to factory variable so we can close it with the stop button
      factory.localAudioContext = context;

      var audioInput = context.createMediaStreamSource(stream);

      var bufferSize = 2048;

      // create a javascript node
      var recorder = context.createScriptProcessor(bufferSize, 1, 1);

      // specify the processing function
      console.log('this: ', factory);
      recorder.onaudioprocess = recorderProcess.bind(factory);

      // connect stream to our recorder
      audioInput.connect(recorder);

       // connect our recorder to the previous destination
      recorder.connect(context.destination);
      console.log('bottom of initializeRecorder');
    }

    navigator.getUserMedia(session, initializeRecorder, err => {
      console.log(err);
    });

    var client = new BinaryClient('ws://localhost:9001');

    client.on('open', function() {
      // for the sake of this example let's put the stream in the window
      window.Stream = client.createStream();
    });

  };

  return factory;
});