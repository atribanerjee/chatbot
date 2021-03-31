/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/speech.js":
/*!***********************!*\
  !*** ./src/speech.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"stopRecording\": () => (/* binding */ stopRecording)\n/* harmony export */ });\n/* harmony import */ var _doc_voicebutton_jpeg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./doc/voicebutton.jpeg */ \"./src/doc/voicebutton.jpeg\");\n //webkitURL is deprecated but nevertheless\n\nURL = window.URL || window.webkitURL;\nvar gumStream; //stream from getUserMedia()\n\nvar rec; //Recorder.js object\n\nvar input; //MediaStreamAudioSourceNode we'll be recording\n\nvar isRecording = false; // Socket global variable\n\nvar roomCode = 1;\nvar connectionString = 'ws://' + window.location.host + '/ws/speechsocket/' + roomCode + '/';\nvar gameSocket = new WebSocket(connectionString); // shim for AudioContext when it's not avb.\n\nvar AudioContext = window.AudioContext || window.webkitAudioContext;\nvar audioContext; //audio context to help us record\n\nvar rcwSender = document.getElementsByClassName(\"rcw-sender\")[0];\nvar voiceButton = document.createElement(\"DIV\");\nvar voiceImage = document.createElement(\"IMG\");\nvoiceImage.src = _doc_voicebutton_jpeg__WEBPACK_IMPORTED_MODULE_0__.default;\nvoiceButton.className = \"rcw-voice\";\nvoiceButton.onclick = recording;\nvoiceButton.appendChild(voiceImage);\nrcwSender.insertBefore(voiceButton, rcwSender.firstChild);\ndocument.getElementsByClassName('rcw-send')[0].addEventListener(\"click\", function () {\n  rec.stop();\n  isRecording = false; // stop microphone access\n\n  gumStream.getAudioTracks()[0].stop(); // hide recording message\n\n  var modal = document.getElementsByClassName(\"recordingMsg\")[0];\n  modal.style.display = \"none\";\n});\n\nfunction recording() {\n  // console.log(\"voiceButton clicked\");\n  if (!isRecording) {\n    /*\n    Simple constraints object, for more advanced audio features see\n    https://addpipe.com/blog/audio-constraints-getusermedia/\n    */\n    var constraints = {\n      audio: true,\n      video: false\n    };\n    /*\n        We're using the standard promise based getUserMedia()\n        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia\n    */\n\n    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {\n      // console.log(\"Initializing recorder ...\");\n\n      /*\n          create an audio context after getUserMedia is called\n          sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods\n          the sampleRate defaults to the one set in your OS for your playback device\n       */\n      audioContext = new AudioContext();\n      console.log(\"here\", audioContext.sampleRate);\n      /*  assign to gumStream for later use  */\n\n      gumStream = stream;\n      /* use the stream */\n\n      input = audioContext.createMediaStreamSource(stream);\n      /*\n          Create the Recorder object and configure to record mono sound (1 channel)\n          Recording 2 channels  will double the file size\n      */\n\n      rec = new Recorder(input, {\n        numChannels: 1\n      }); // start the recording process\n\n      rec.record();\n      isRecording = true; // console.log(\"Recording started\");\n\n      var modal = document.getElementsByClassName(\"recordingMsg\")[0];\n      modal.style.display = \"block\"; // modal.classList.add('fadeOut');\n    }).catch(function (err) {\n      // enable the record button if getUserMedia() fails\n      console.log(\"getUserMedia failed!\");\n      console.log(err);\n    });\n  } else {\n    // tell the recorder to stop the recording\n    rec.stop();\n    isRecording = false; // stop microphone access\n\n    gumStream.getAudioTracks()[0].stop(); //create the wav blob and pass it on to handleDataAvailable\n\n    rec.exportWAV(handleDataAvailable);\n    var modal = document.getElementsByClassName(\"recordingMsg\")[0];\n    modal.style.display = \"none\";\n  }\n}\n\nfunction handleDataAvailable(blob) {\n  // console.log(\"data-available\");\n  let csrftoken = getCookie('csrftoken');\n  var fd = new FormData();\n  fd.append(\"audio_data\", blob); // use websocket\n\n  gameSocket.send(blob); // send the audio file to server\n  // fetch(\"/speech/\", {\n  //     method:\"POST\", \n  //     credentials: 'same-origin',\n  //     headers: { \"X-CSRFToken\": csrftoken },\n  //     body:fd\n  // })\n  // .then(response => {\n  //     if (!response.ok) {\n  //         throw new Error('Network response was not ok');\n  //     }\n  //     return response.json();\n  // })\n  // .then(data => {\n  //     var alt = data['alternative'];\n  //     console.log(data);\n  //     if (alt != undefined) {\n  //         var transcript = alt[0]['transcript'];\n  //         console.log(transcript);\n  //         var userInput = document.getElementsByClassName(\"rcw-new-message\")[0];\n  //         if (isRecording) {\n  //             userInput.value = transcript;\n  //         } else {\n  //             userInput.value = \"\";\n  //         }\n  //     }\n  // })\n  // .catch(err => console.error(err));\n} // https://stackoverflow.com/questions/43606056/proper-django-csrf-validation-using-fetch-post-request\n// The following function are copying from \n// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax\n\n\nfunction getCookie(name) {\n  var cookieValue = null;\n\n  if (document.cookie && document.cookie !== '') {\n    var cookies = document.cookie.split(';');\n\n    for (var i = 0; i < cookies.length; i++) {\n      var cookie = cookies[i].trim(); // Does this cookie string begin with the name we want?\n\n      if (cookie.substring(0, name.length + 1) === name + '=') {\n        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));\n        break;\n      }\n    }\n  }\n\n  return cookieValue;\n}\n\nfunction stopRecording() {\n  if (isRecording) {\n    rec.stop();\n  }\n}\nsetInterval(function () {\n  if (isRecording) {\n    rec.exportWAV(handleDataAvailable);\n  }\n}, 500); //wait 2 seconds\n// Main function which handles the connection\n// of websocket.\n\nfunction connect() {\n  gameSocket.onopen = function open() {\n    console.log('WebSockets connection created.'); // on websocket open, send the START event.\n\n    gameSocket.send(JSON.stringify({\n      \"event\": \"START\",\n      \"message\": \"\"\n    }));\n  };\n\n  gameSocket.onclose = function (e) {\n    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);\n    setTimeout(function () {\n      connect();\n    }, 1000);\n  }; // Sending the info about the room\n\n\n  gameSocket.onmessage = function (e) {\n    // On getting the message from the server\n    // Do the appropriate steps on each event.\n    let data = JSON.parse(e.data);\n    data = data[\"payload\"];\n    var alt = data[\"message\"][\"alternative\"];\n\n    if (data[\"transcript\"]) {\n      if (alt != undefined) {\n        var transcript = alt[0]['transcript'];\n        console.log(transcript);\n        var userInput = document.getElementsByClassName(\"rcw-new-message\")[0];\n\n        if (isRecording) {\n          userInput.value = transcript;\n        } else {\n          userInput.value = \"\";\n        }\n      }\n    }\n  };\n\n  if (gameSocket.readyState == WebSocket.OPEN) {\n    gameSocket.onopen();\n  }\n} //call the connect function at the start.\n\n\nconnect();\n\n//# sourceURL=webpack://frontend/./src/speech.js?");

/***/ }),

/***/ "./src/doc/voicebutton.jpeg":
/*!**********************************!*\
  !*** ./src/doc/voicebutton.jpeg ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"data:image/jpeg;base64,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\");\n\n//# sourceURL=webpack://frontend/./src/doc/voicebutton.jpeg?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/speech.js");
/******/ 	
/******/ })()
;