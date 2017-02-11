angular.module('myApp').factory('socket', function($http) {

  var factory = {};

  factory.streaming = false;
  factory.localStream = null;
  factory.localAudioContext = null;

  factory.stopRecording = function() {
    if(this.streaming) {
      window.Stream.end();
      this.localAudioContext.close();
      this.localStream.getTracks()[0].stop();
      this.streaming = false;
      console.log('recording stopped');
    }
  }

  factory.runSocket = function() {

    //comes out as F32, we need it in I16
    function convertFloat32ToInt16(buffer) {
      l = buffer.length;
      buf = new Int16Array(l);
      while (l--) {
        buf[l] = Math.min(1, buffer[l])*0x7FFF;
      }
      return buf.buffer;
    }

    const permissions = {
      audio: true,
      video: false
    };

    const recorderProcess = function(e) {
      if(window.Stream.writable) {
        console.log('streaming...');
        //it's mono, so we only need left
        var left = e.inputBuffer.getChannelData(0);
        //stream the audio to our web socket
        window.Stream.write(convertFloat32ToInt16(left));
      }
    }

    const initializeRecorder = function(stream) {
      
      console.log('initialize Recorder');

      //set factory variable so we can stop it with the stop button
      factory.localStream = stream;

      //create instance of audioContext
      const audioContext = new window.AudioContext();

      //set to factory variable so we can close it with the stop button
      factory.localAudioContext = audioContext;

      //where the audio stream is coming from. in this case, from
      //the media stream from navigator
      const audioInput = audioContext.createMediaStreamSource(stream);

      // create a recorder - think of it as a wiretap on the stream
      const bufferSize = 2048;
      const recorder = audioContext.createScriptProcessor(bufferSize, 1, 1);

      // specify the processing function
      recorder.onaudioprocess = recorderProcess;

      // connect stream to our recorder
      audioInput.connect(recorder);

       // connect our recorder to the previous destination
      recorder.connect(audioContext.destination);
    }

    if(!this.streaming) {
      //get stream from the global navigator object
      //and send the stream to initalize our recorder
      navigator.mediaDevices.getUserMedia(permissions)
      .then(mediaStream => {
        initializeRecorder(mediaStream);
      })
      .catch(err => {
        console.error;
      });

      //open new socket
      var client = new BinaryClient('ws://localhost:9001');

      client.on('open', function() {
        console.log('opening socket on localhost:9001');
        // for the sake of this example let's put the stream in the window
        window.Stream = client.createStream();
      });

      this.streaming = true;
    }

  };

  return factory;
});