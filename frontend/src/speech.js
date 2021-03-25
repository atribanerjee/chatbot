import voicebutton from './doc/voicebutton.jpeg';
//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream;                      //stream from getUserMedia()
var rec;                            //Recorder.js object
var input;                          //MediaStreamAudioSourceNode we'll be recording
var isRecording = false;

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record
var rcwSender = document.getElementsByClassName("rcw-sender")[0];
var voiceButton = document.createElement("DIV");
var voiceImage = document.createElement("IMG");

voiceImage.src = voicebutton;
voiceButton.className = "rcw-voice";
voiceButton.onclick = recording;

voiceButton.appendChild(voiceImage);
rcwSender.insertBefore(voiceButton, rcwSender.firstChild);

var clicked = false;
document.getElementsByClassName('rcw-send')[0].addEventListener("click", function() {
   clicked = true;
});

function recording() {
    // console.log("voiceButton clicked");
    if (!isRecording) {
        /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
        */

        var constraints = { audio: true, video:false }

        /*
            We're using the standard promise based getUserMedia()
            https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        */

        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            // console.log("Initializing recorder ...");

            /*
                create an audio context after getUserMedia is called
                sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
                the sampleRate defaults to the one set in your OS for your playback device

            */
            audioContext = new AudioContext();

            /*  assign to gumStream for later use  */
            gumStream = stream;

            /* use the stream */
            input = audioContext.createMediaStreamSource(stream);

            /*
                Create the Recorder object and configure to record mono sound (1 channel)
                Recording 2 channels  will double the file size
            */
 
            rec = new Recorder(input,{numChannels:1})

            // start the recording process
            rec.record();
            isRecording = true;
            // console.log("Recording started");

        }).catch(function(err) {
            // enable the record button if getUserMedia() fails
            console.log("getUserMedia failed!");
            console.log(err);
        });
    } else {
        // tell the recorder to stop the recording
        rec.stop();
        isRecording = false;

        // stop microphone access
        gumStream.getAudioTracks()[0].stop();

        //create the wav blob and pass it on to handleDataAvailable
        rec.exportWAV(handleDataAvailable);
    }
}

function handleDataAvailable(blob) {
    // console.log("data-available");

    let csrftoken = getCookie('csrftoken');
    console.log("CSRFtoken: " + csrftoken);

    var fd=new FormData();
    fd.append("audio_data", blob);

    // send the audio file to server
    fetch("/speech/", {
        method:"POST", 
        credentials: 'same-origin',
        headers: { "X-CSRFToken": csrftoken },
        body:fd
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        var alt = data['alternative'];
        console.log(data);
        if (alt != undefined) {
            var transcript = alt[0]['transcript'];
            console.log(transcript);
            var userInput = document.getElementsByClassName("rcw-new-message")[0];
            if (isRecording) {
                userInput.value = transcript;
            } else {
                userInput.value = "";
            }
        }
    })
    .catch(err => console.error(err));
}

// https://stackoverflow.com/questions/43606056/proper-django-csrf-validation-using-fetch-post-request
// The following function are copying from 
// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function stopRecording() {
    if (isRecording) {
        rec.stop();
    }
}

setInterval(function(){
    if (isRecording) {
        console.log("here", clicked);
        if (clicked) {
            rec.stop();
            isRecording = false;
            // stop microphone access
            gumStream.getAudioTracks()[0].stop();
            clicked = false;
        } else {
            rec.exportWAV(handleDataAvailable);
        }
        
    }
}, 1000);//wait 2 seconds