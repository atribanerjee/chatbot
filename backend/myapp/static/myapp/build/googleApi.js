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

/***/ "./src/googleApi.js":
/*!**************************!*\
  !*** ./src/googleApi.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"renderGoogleSearchResult\": () => (/* binding */ renderGoogleSearchResult),\n/* harmony export */   \"postToGoogle\": () => (/* binding */ postToGoogle)\n/* harmony export */ });\nconst renderGoogleSearchResult = (json, searchImage) => {\n  /*\n  This functino will render the google search result on the browser.\n  */\n  var gsResultBox = \"\";\n\n  if (!searchImage) {\n    gsResultBox += '<div class=\"gs-result-container\">';\n\n    for (var i = 0; i < json.items.length; i++) {\n      var item = json.items[i]; // in production code, item.htmlTitle should have the HTML entities escaped.\n\n      gsResultBox += '<div class=\"gs-result-box\">';\n      gsResultBox += '<a style=\"text-decoration: none; color: inherit;\" target=\"_blank\" href=' + item.formattedUrl + \">\";\n      gsResultBox += \"<h3>\" + item.htmlTitle + \"</h3>\";\n      gsResultBox += item.displayLink;\n      gsResultBox += \"<br>\" + \"<p>\" + item.htmlSnippet + \"</p>\";\n      gsResultBox += \"</a>\";\n      gsResultBox += \"</div>\";\n    }\n\n    gsResultBox += \"<br/>\" + \"<br/>\";\n    gsResultBox += \"</div>\";\n  } else {\n    gsResultBox += '<div class=\"gs-image-container\">';\n\n    for (var i = 0; i < json.items.length; i++) {\n      var item = json.items[i]; // in production code, item.htmlTitle should have the HTML entities escaped.\n\n      gsResultBox += '<div class=\"gs-image-box\">';\n      gsResultBox += '<a style=\"text-decoration: none; color: inherit;\" target=\"_blank\" href=' + item.image.contextLink + \">\";\n      gsResultBox += '<img class=\"gs-image\" src=' + item.link + ' style=\"width:100% !important;height:auto !importnat;\">';\n      gsResultBox += \"<br>\" + '<p class=\"gs-image-text\">' + item.displayLink + \"</p>\";\n      gsResultBox += \"</a>\";\n      gsResultBox += \"</div>\";\n    }\n\n    gsResultBox += \"</div>\";\n    gsResultBox += \"<br/>\" + \"<br/>\";\n  }\n\n  var container = document.getElementById(\"gs-container\");\n  container.innerHTML = gsResultBox;\n};\n\nconst postToGoogle = (newMessage, searchImage) => {\n  /*\n  This function will post the corresponding message as query arguments to the google api to get the google search result\n  */\n  var words = newMessage.split(\" \");\n  const API_key = 'AIzaSyCbFSWl19Os-yEiAVDDVCsjRhx3upg03Tw';\n  const cx = '733234c43a3ba69a0';\n  var url = 'https://www.googleapis.com/customsearch/v1?key=' + API_key + '&cx=' + cx + '&q=';\n\n  for (var word of words) {\n    url += word + '+';\n  }\n\n  url = url.slice(0, -1);\n  if (searchImage) url += \"&searchType=image\";\n  console.log(url);\n  fetch(url).then(response => response.json()).then(json => {\n    // json.items has the results \n    console.log(json.items);\n    renderGoogleSearchResult(json, searchImage);\n  }).catch(console.error);\n};\n\n\n\n//# sourceURL=webpack://frontend/./src/googleApi.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/googleApi.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;