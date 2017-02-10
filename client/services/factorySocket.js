angular.module('myApp').factory('socket', function($http) {

  var factory = {};

  factory.runSocket = function() {
    console.log('listening from socket factory');

    var session = {
      audio: true,
      video: false
    };
    var recordRTC = null;

    var recorderProcess = function(e) {
      var left = e.inputBuffer.getChannelData(0);
    }

    var initializeRecorder = function(stream) {
      console.log('inside initializeRecorder');

      var audioContext = window.AudioContext;
      var context = new audioContext();
      var audioInput = context.createMediaStreamSource(stream);

      var bufferSize = 2048;

      // create a javascript node
      var recorder = context.createScriptProcessor(bufferSize, 1, 1);

      // specify the processing function
      recorder.onaudioprocess = recorderProcess;

      // connect stream to our recorder
      audioInput.connect(recorder);

       // connect our recorder to the previous destination
      recorder.connect(context.destination);
      console.log('bottom of initializeRecorder');
    }

    navigator.getUserMedia(session, initializeRecorder, err => {
      console.log(err);
    });

  };

  return factory;
});