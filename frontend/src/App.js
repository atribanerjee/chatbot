import logo from './doc/logo.svg';
// import './App.css';

import React, { useState, useEffect } from 'react';
import { Widget, addResponseMessage, setQuickButtons, addLinkSnippet, toggleWidget, toggleMsgLoader} from 'react-chat-widget';
// import './styles.css';

// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

import {ActionProvider} from './ActionProvider'
import {postToGoogle} from './googleApi'

const App = (props) => {
  var currMessage;
  var failCount;
  var debugMode = false;
  var timer = 0;
  var support = true;
  // var placeholder = "Type here: hold spacebar to talk";
  const targetKey = " ";
  // const {
  //   transcript,
  //   interimTranscript,
  //   finalTranscript,
  //   resetTranscript,
  //   listening,
  // } = useSpeechRecognition();

  useEffect(() => {
    toggleWidget();
    addResponseMessage('Welcome to this awesome chat!');

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // Get the submit button in modal
    var submitButton = document.getElementsByClassName("modal-submit")[0];

    submitButton.onclick = function() {
      var username = document.getElementById("username");
      console.log(username.value);
      var password = document.getElementById("password");
      console.log(password.value);
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

    // Setup onclick function for google search result container close button
    var gsCloseButton = document.getElementById("gs-close-button");
    gsCloseButton.onclick = function() {
      var google = document.getElementById("gs-container");
      google.style.display = "none";
      gsCloseButton.style.display = "none";
      // change width of chat window
      var widgetContainer = document.getElementsByClassName("rcw-widget-container")[0];
      widgetContainer.style.width = "100%";
      setQuickButtons([
        {
        label : 'show results',
        value : 3,
        },
      ]);
    }

    // window.addEventListener('keydown', downHandler);
    // window.addEventListener('keyup', upHandler);
    // // Remove event listeners on cleanup
    // return () => {
    //   window.removeEventListener('keydown', downHandler);
    //   window.removeEventListener('keyup', upHandler);
    // };
  }, []);

  // if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
  //   console.log("This browser does not support speeech recognition!");
  //   support = false;
  //   placeholder = "Type here"
  //   // return null;
  // }

  // useEffect(() => {
  //   if (!listening && finalTranscript !== '') {
  //     console.log('Got final transcript:', finalTranscript);
  //     var userInput = document.getElementsByClassName("rcw-new-message")[0];
  //     userInput.value = finalTranscript;
  //     document.getElementsByClassName("rcw-send")[0].click();
  //     userInput.value = "";
  //     resetTranscript();
  //   }
  // }, [listening, finalTranscript]);

  // useEffect(() => {
  //   if (listening && interimTranscript !== '') {
  //     var userInput = document.getElementsByClassName("rcw-new-message")[0];
  //     userInput.value = transcript;
  //     console.log("Got interim transcript:", interimTranscript);
  //   }
  // }, [listening, interimTranscript]);

  // function downHandler({ key }) {
  //   if (!support) {
  //     return;
  //   }
  //   if (key === targetKey) {
  //     timer += 1;
  //     if (timer > 20) {
  //       SpeechRecognition.startListening({
  //         continuous: true,
  //       });
  //       var userInput = document.getElementsByClassName("rcw-new-message")[0];
  //       userInput.disabled = true;
  //       if (timer == 21) userInput.value = "";
  //       var recordingMsg = document.getElementsByClassName("recordingMsg")[0];
  //       recordingMsg.style.display = "block";
  //     }
  //   }
  // }

  // // If released key is our target key then set to false
  // const upHandler = ({ key }) => {
  //   if (!support) {
  //     return;
  //   }
  //   if (key === targetKey) {
  //     timer = 0;
  //     SpeechRecognition.stopListening();
  //     var userInput = document.getElementsByClassName("rcw-new-message")[0];
  //     userInput.disabled = false;
  //     var recordingMsg = document.getElementsByClassName("recordingMsg")[0];
  //     recordingMsg.style.display = "none";
  //   }
  // };

  const postMessage = (message, url) => {

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ Transaction_ID: "12345", User_ID: "1234", Timestamp: "122334567", Input: message }));
    var gotMessage = false;

    xhr.onreadystatechange = (e) => {
      const res = xhr.responseText;
      if (xhr.status == 200) {
        if (!gotMessage && res.length > 0) {
          console.log("Response from GPT3: " + res);
          // TODO: handle response message
          ActionProvider(res, currMessage);
          gotMessage = true;
          toggleMsgLoader();
        }
      } else if (xhr.status == 500) {
        if (!gotMessage) {
          console.log(res);
          if (failCount < 5) postMessage(message, url);
          failCount = failCount + 1;
          gotMessage = true;
        }
      } else {
        if (!gotMessage) {
          console.log(res);
          addResponseMessage("Sorry I don't understand");
          gotMessage = true;
          toggleMsgLoader();
        }
      }
    }
  }

  const handleNewUserMessage = (newMessage) => {
    toggleMsgLoader();
    console.log(`New message incoming! ${newMessage}`);
    currMessage = newMessage;
    // Now send the message throught the backend API
    postMessage(newMessage, 'http://ec2-54-165-106-6.compute-1.amazonaws.com:5000/predict_GPT3_tips');
    // if (debugMode) {
    //   postMessage(newMessage, 'http://ec2-3-83-253-148.compute-1.amazonaws.com:5000/predict_GPT3_tagging');
    // }
    failCount = 0;
    var gsCloseButton = document.getElementById("gs-close-button");
    gsCloseButton.style.display = "none";
    var google = document.getElementById("gs-container");
    google.style.display = "none";
    var widgetContainer = document.getElementsByClassName("rcw-widget-container")[0];
    widgetContainer.style.width = "100%";
    setQuickButtons([]);
  };

  const handleQuickButtonClicked = (value) => {
    if (value == 1) {
        
    } else if (value == 2) {
        postToGoogle(currMessage, true);
        setQuickButtons([
          {
          label : 'show text only',
          value : 3,
          },
        ]);
    } else if (value == 3) {
      postToGoogle(currMessage, false);
      // change width of chat window
      var widgetContainer = document.getElementsByClassName("rcw-widget-container")[0];
      widgetContainer.style.width = "50%";
      // Get the google search container
      var gsCloseButton = document.getElementById("gs-close-button");
      gsCloseButton.style.display = "block";
      var google = document.getElementById("gs-container");
      google.style.display = "block";
      setQuickButtons([
        {
        label : 'show images',
        value : 2,
        },
      ]);
    }
  }

  return (
    
    <div>
      <Widget 
        handleNewUserMessage={handleNewUserMessage}
        title="AI ChatBot"
        subtitle="Easy Search Answer Agent"
        profileAvatar={logo}
        handleQuickButtonClicked={handleQuickButtonClicked}
        // senderPlaceHolder={placeholder}
        autofocus={false}
      />

      <div id="myModal" class="modal">
        <div class="modal-content">
        <div class="modal-header">
          <span class="close">&times;</span>
          <h2>Quick Login</h2>
        </div>
        <div class="modal-body">
          <label for="username">Username:</label>
          <input type="text" name="userInfo" id="username" placeholder="username" />
          <br></br>
          <label for="password">Password:</label>
          <input type="text" name="userInfo" id="password" placeholder="password" />
          <br></br>
          <input class="modal-submit" type="submit" value="Submit" />
        </div>
        <div class="modal-footer">
          <h3></h3>
        </div>
        </div>
      </div>

      <span class="recordingMsg">recording</span>
      
    </div>
  );
}

export default App;
