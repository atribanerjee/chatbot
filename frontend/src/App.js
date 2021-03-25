import logo from './doc/logo.svg';

import React, { useEffect } from 'react';
import { Widget, addResponseMessage, setQuickButtons, toggleWidget, toggleMsgLoader} from 'react-chat-widget';

import {ActionProvider} from './ActionProvider'
import {postToGoogle} from './googleApi'


const App = (props) => {
  var currMessage;
  var failCount;

  useEffect(() => {
    // this open up the chat window (otherwise it will be the floating widget in the middle)
    toggleWidget();
    addResponseMessage('Welcome to this awesome chat!');

    // Setup onclick function for google search result container close button
    var gsCloseButton = document.getElementById("gs-close-button");
    gsCloseButton.onclick = function() {
      var google = document.getElementById("gs-container");
      google.style.display = "none";
      gsCloseButton.style.display = "none";

      // change width of chat window
      var widgetContainer = document.getElementsByClassName("rcw-widget-container")[0];
      widgetContainer.style.width = "100%";

      // set up the quick buttons
      setQuickButtons([
        {
        label : 'show results',
        value : 3,
        },
      ]);
    }
  }, []);

  const postMessage = (message, url) => {
    /*
    This function will send the message to the GPT3 server.
    */

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // the required body for post in order to get a response
    xhr.send(JSON.stringify({ Transaction_ID: "12345", User_ID: "1234", Timestamp: "122334567", Input: message }));
    var gotMessage = false;

    xhr.onreadystatechange = (e) => {
      const res = xhr.responseText;
      if (xhr.status == 200) {
        if (!gotMessage && res.length > 0) {
          console.log("Response from GPT3: " + res);
          // handle response message
          ActionProvider(res, currMessage);
          gotMessage = true;
          toggleMsgLoader();
        }
      } else if (xhr.status == 500) {
        if (!gotMessage) {
          console.log(res);
          // only resend the request if the failed request is not more than 5
          if (failCount < 5) postMessage(message, url);
          // increment failed counter to keep track of failed requests
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
    /*
    This functino =handle the new message sent from the user/browser
    */
    toggleMsgLoader();
    console.log(`New message incoming! ${newMessage}`);
    currMessage = newMessage;
    // Now send the message to the GPT3 API
    postMessage(newMessage, 'http://ec2-54-165-106-6.compute-1.amazonaws.com:5000/predict_GPT3_tips');
    
    // reset the failed request counter
    failCount = 0;

    // remove the google search container when a new message is sent
    var gsCloseButton = document.getElementById("gs-close-button");
    gsCloseButton.style.display = "none";
    var google = document.getElementById("gs-container");
    google.style.display = "none";
    var widgetContainer = document.getElementsByClassName("rcw-widget-container")[0];
    widgetContainer.style.width = "100%";

    // reset all quich buttons
    setQuickButtons([]);
  };

  const handleQuickButtonClicked = (value) => {
    /*
    This function will handle the event when a quick button is clicked
    */
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
        autofocus={false}
      />

      <span class="recordingMsg">recording</span>
      
    </div>
  );
}

export default App;
