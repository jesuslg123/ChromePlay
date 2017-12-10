/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ 3:
/***/ (function(module, exports) {

window.addEventListener("load", tryToEnableChromePlay, false);
window.addEventListener("DOMActivate", tryToEnableChromePlay, false);

// $(document).bind('DOMNodeInserted', function(e) {
// 		tryToEnableChromePlay();   
// });

/**
 * Tries to find video src in given document.
 * Uses window.document by default.
 *
 * @param  {Object} [document] document to search in
 * @return {Object}            object with video url and position
 */
function checkForHtml5Video(document) {
	var ret = { url: null, position: 0 };

	// Fallback to the window.document if no document is given
	document = document || window.document;

	if (document.URL.indexOf("debugChromePlay.html") > -1) {
		ret.url = document.getElementById("debugChromePlayUrl").value;
		return ret;
	}

	var videos = document.getElementsByTagName('video');
	for (var i = 0; i < videos.length; i++) {
		var video = videos[i];
		ret.url = video.currentSrc;
		ret.position = video.currentTime / video.duration;
		if (ret.url) return ret;
	}

	var iframes = document.getElementsByTagName('iframe');
	for (var i = 0; i < iframes.length; i++) {
		// Search within same origin iframes because we can't access other domains
		if (iframes[i].src.indexOf(window.document.domain) !== -1) {
			// Recursive search within iframe if it contains any video
			ret = checkForHtml5Video(iframes[i].contentDocument);
			if (ret.url) return ret;
		}
	}

	var noscripts = document.getElementsByTagName('noscript');
	for (var i = 0; i < noscripts.length; i++) {
		var el = document.createElement("div");
		el.innerHTML = noscripts[i].innerHTML;
		el.innerHTML = el.childNodes[0].nodeValue
		if (el.getElementsByTagName('video').length > 0) {
			ret = checkForHtml5Video(el);
			if (ret.url) return ret;
		}
	}

	return ret;
}

browser.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.action == "Html5Video") {
			console.log('Request message getHtml5Video received');
			sendResponse({ Html5Video: checkForHtml5Video() });
			return true;
		}
	});

// Listen for messages
browser.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.action === 'getYtPlayer') {
			const ytplayer_config_re = /<script>.+?ytplayer.config.+?=.+?(\{.+?\});.+?;<\/script>/
			let ytplayer_config_matches = ytplayer_config_re.exec(document.all[0].outerHTML);
			sendResponse(JSON.parse(ytplayer_config_matches[1]));
		}
	});

function tryToEnableChromePlay(evt) {

	var jsInitChecktimer = setInterval(checkForJS_Finish, 111);

	function checkForJS_Finish() {
		if (!/vimeo.com/.test(document.URL) || document.getElementsByClassName('target').length > 0) {
			clearInterval(jsInitChecktimer);
			enableChromePlay();
		}
		function enableChromePlay() {
			if (/^https?:\/\/(?:www\.)?youtube.com\/watch\?(?=[^?]*v=\w+)(?:[^\s?]+)?$/.test(document.URL)) {
				browser.runtime.sendMessage("");
				//browser.extension.sendRequest({}, function(response) {}); // show the icon in omnibox
			} else if (checkForHtml5Video().url) { // we're having HTML5 video
				browser.runtime.sendMessage("");
				//browser.extension.sendRequest({}, function(response) {}); // show the icon in omnibox
			} else if (/vimeo.com/.test(document.URL)) {
				// some magic to enable right-clicking on Vimeo videos
				var elements = document.getElementsByClassName('target');
				for (var i = 0; i < elements.length; i++) {
					elements[i].style.zIndex = "-1";
				}
				elements = document.getElementsByClassName('video');
				for (var i = 0; i < elements.length; i++) {
					elements[i].style.zIndex = "1000";
					elements[i].className = 'video_unlocked_by_chromeplay';
				}
				elements = document.getElementsByClassName('video cover');
				for (var i = 0; i < elements.length; i++) {
					elements[i].className = 'video_unlocked_by_chromeplay cover';
				}
			}
			else {
				// No match was found.
			}
		}
	}
}


/***/ })

/******/ });
//# sourceMappingURL=content.bundle.js.map