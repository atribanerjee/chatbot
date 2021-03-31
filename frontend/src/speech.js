import voicebutton from './doc/voicebutton.jpeg';

//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream;                      //stream from getUserMedia()
var rec;                            //Recorder.js object
var input;                          //MediaStreamAudioSourceNode we'll be recording
var isRecording = false;

// Socket global variable
var roomCode = 1;
var connectionString = 'ws://' + window.location.host + '/ws/speechsocket/' + roomCode + '/';
var gameSocket = new WebSocket(connectionString);

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


document.getElementsByClassName('rcw-send')[0].addEventListener("click", function() {
    rec.stop();
    isRecording = false;

    // stop microphone access
    gumStream.getAudioTracks()[0].stop();

    // hide recording message
    var modal = document.getElementsByClassName("recordingMsg")[0];
    modal.style.display = "none";
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
            console.log("here", audioContext.sampleRate);

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

            var modal = document.getElementsByClassName("recordingMsg")[0];
            modal.style.display = "block";
            // modal.classList.add('fadeOut');

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
        var modal = document.getElementsByClassName("recordingMsg")[0];
        modal.style.display = "none";
    }
}

function handleDataAvailable(blob) {
    // console.log("data-available");

    let csrftoken = getCookie('csrftoken');

    var fd=new FormData();
    fd.append("audio_data", blob);

    // use websocket
    if (isRecording) gameSocket.send(blob);

    // send the audio file to server
    // fetch("/speech/", {
    //     method:"POST", 
    //     credentials: 'same-origin',
    //     headers: { "X-CSRFToken": csrftoken },
    //     body:fd
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     var alt = data['alternative'];
    //     console.log(data);
    //     if (alt != undefined) {
    //         var transcript = alt[0]['transcript'];
    //         console.log(transcript);
    //         var userInput = document.getElementsByClassName("rcw-new-message")[0];
    //         if (isRecording) {
    //             userInput.value = transcript;
    //         } else {
    //             userInput.value = "";
    //         }
    //     }
    // })
    // .catch(err => console.error(err));
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
        rec.exportWAV(handleDataAvailable);
    }
}, 500);//wait 2 seconds

// Main function which handles the connection
// of websocket.
function connect() {
    gameSocket.onopen = function open() {
        console.log('WebSockets connection created.');
        // on websocket open, send the START event.
        gameSocket.send(JSON.stringify({
            "event": "START",
            "message": ""
        }));
    };

    gameSocket.onclose = function (e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function () {
            connect();
        }, 1000);
    };
    // Sending the info about the room
    gameSocket.onmessage = function (e) {
        // On getting the message from the server
        // Do the appropriate steps on each event.
        let data = JSON.parse(e.data);
        data = data["payload"];
        if (!isRecording) return;
        var alt = data["message"]["alternative"];
        if (data["transcript"]) {
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
        }
    };

    if (gameSocket.readyState == WebSocket.OPEN) {
        gameSocket.onopen();
    }
}

//call the connect function at the start.
connect();