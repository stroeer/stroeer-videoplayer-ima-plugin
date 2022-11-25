var version = "2.0.0";

var noop = function () {
    return false;
};

var eventWrapper = function (eventName, eventData) {
    var ev = document.createEvent('Event');
    ev.initEvent(eventName, true, true);
    if (eventData !== undefined) {
        ev.detail = eventData;
    }
    return ev;
};

var _a, _b;
var debugMode = false;
if (((_b = (_a = window.localStorage) === null || _a === void 0 ? void 0 : _a.getItem) === null || _b === void 0 ? void 0 : _b.call(_a, 'StroeerVideoplayerLoggingEnabled')) !== null) {
    debugMode = true;
}
var Logger = {
    log: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (debugMode) {
            console.log.apply(console, args);
        }
    }
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function SVGHelper(type, opts) {
    var _a, _b;
    opts = opts !== null && opts !== void 0 ? opts : {};
    opts.svgAttributes = (_a = opts.svgAttributes) !== null && _a !== void 0 ? _a : [];
    opts.svgAttributes.push(['role', 'presentation']);
    opts.svgAttributes.push(['focusable', 'false']);
    var namespace = 'http://www.w3.org/2000/svg';
    var iconPrefix = '';
    var iconPath = '#' + iconPrefix;
    var icon = document.createElementNS(namespace, 'svg');
    opts.svgAttributes.forEach(function (attr) {
        icon.setAttribute(attr[0], attr[1]);
    });
    var use = document.createElementNS(namespace, 'use');
    var path = iconPath + type;
    if ('href' in use) {
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', path);
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if ((_b = opts.useAttributes) === null || _b === void 0 ? void 0 : _b.length) {
        opts.useAttributes.forEach(function (attr) {
            use.setAttribute(attr[0], attr[1]);
        });
    }
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', path);
    icon.appendChild(use);
    return icon;
}

function loadScript(url) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var script = document.createElement('script');
                        script.src = url;
                        script.className = 'loaded-script';
                        script.async = true;
                        script.onload = function () {
                            script.remove();
                            resolve();
                        };
                        script.onerror = function () {
                            script.remove();
                            reject(new Error(url + " could not be loaded"));
                        };
                        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                        if (document.head) {
                            document.head.appendChild(script);
                        }
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var convertLocalStorageIntegerToBoolean = function (key) {
    if (typeof window !== 'undefined') {
        var localStorageItem = window.localStorage.getItem(key);
        if (localStorageItem !== null) {
            var probablyInteger = parseInt(localStorageItem, 10);
            if (isNaN(probablyInteger)) {
                return false;
            }
            else {
                return Boolean(probablyInteger);
            }
        }
    }
    return false;
};
var convertLocalStorageStringToNumber = function (key) {
    if (typeof window !== 'undefined') {
        var localStorageItem = window.localStorage.getItem(key);
        if (localStorageItem !== null) {
            var number = parseFloat(localStorageItem);
            if (number >= 0 && number <= 1) {
                return number;
            }
            else {
                return 0.5;
            }
        }
        else {
            return 0.5;
        }
    }
    return 0.5;
};
var hideElement = function (element) {
    element.classList.add('hidden');
    element.setAttribute('aria-hidden', 'true');
};
var showElement = function (element) {
    element.classList.remove('hidden');
    element.removeAttribute('aria-hidden');
};
var createButton = function (container, cls, aria, svgid, ishidden) {
    var el = document.createElement('button');
    el.classList.add(cls);
    el.setAttribute('aria-label', aria);
    el.appendChild(SVGHelper(svgid));
    if (ishidden)
        hideElement(el);
    container.appendChild(el);
    return el;
};
var dispatchEvent = function (target, eventName, data) {
    var event = new CustomEvent(eventName, { detail: data });
    target.dispatchEvent(event);
};
var calculateVolumePercentageBasedOnYCoords = function (y, offsetHeight) {
    var percentage = (100 / offsetHeight) * y;
    return percentage;
};
var isTouchDevice = function () {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
};
var isAlreadyInFullscreenMode = function (rootElement, videoElement) {
    return (document.fullscreenElement === rootElement || document.fullscreenElement === videoElement);
};

/* eslint-disable @typescript-eslint/no-floating-promises */
var Plugin = /** @class */ (function () {
    function Plugin() {
        var _this = this;
        this.init = function (StroeerVideoplayer, opts) {
            _this.videoElement = StroeerVideoplayer.getVideoEl();
            _this.rootElement = StroeerVideoplayer.getRootEl();
            _this.isMuted = convertLocalStorageIntegerToBoolean('StroeerVideoplayerMuted');
            _this.volume = convertLocalStorageStringToNumber('StroeerVideoplayerVolume');
            _this.adContainer.classList.add('ima-ad-container');
            _this.videoElement.after(_this.adContainer);
            var uiContainer = document.createElement('div');
            uiContainer.className = 'ima';
            _this.adContainer.appendChild(uiContainer);
            _this.createUI(uiContainer, _this.videoElement, _this.isMuted, isAlreadyInFullscreenMode(_this.rootElement, _this.videoElement));
            _this.videoElement.addEventListener('play', _this.onVideoElementPlay);
            _this.videoElement.addEventListener('contentVideoEnded', _this.onContentVideoEnded);
            _this.loadIMAScript = loadScript('//imasdk.googleapis.com/js/sdkloader/ima3.js');
        };
        this.onVideoElementPlay = function (event) {
            var prerollAdTag = _this.videoElement.getAttribute('data-ivad-preroll-adtag');
            if (prerollAdTag === null)
                return;
            if (prerollAdTag === 'adblocked') {
                _this.dispatchAndLogError(301, 'IMA could not be loaded');
                return;
            }
            // no new play event until content video is ended
            _this.videoElement.removeEventListener('play', _this.onVideoElementPlay);
            _this.showLoadingSpinner(true);
            _this.videoElement.pause();
            if (_this.videoElement.muted) {
                _this.isMuted = true;
            }
            _this.loadIMAScript
                .then(function () {
                if (!_this.adsManager) {
                    _this.createAdsManager();
                }
                _this.requestAds();
            })
                .catch(function () {
                _this.dispatchAndLogError(301, 'IMA could not be loaded');
            });
        };
        this.onContentVideoEnded = function (event) {
            _this.videoElement.addEventListener('play', _this.onVideoElementPlay);
        };
        this.createAdsManager = function () {
            google.ima.settings.setNumRedirects(10);
            google.ima.settings.setLocale('de');
            _this.adsDisplayContainer = new google.ima.AdDisplayContainer(_this.adContainer);
            _this.adsLoader = new google.ima.AdsLoader(_this.adsDisplayContainer);
            _this.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function (adsManagerLoadedEvent) {
                _this.onAdsManagerLoaded(adsManagerLoadedEvent);
            });
            _this.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (adErrorEvent) {
                _this.onAdsManagerError(adErrorEvent);
            });
        };
        this.onAdsManagerLoaded = function (adsManagerLoadedEvent) {
            var adsRenderingSettings = new google.ima.AdsRenderingSettings();
            adsRenderingSettings.loadVideoTimeout = -1;
            adsRenderingSettings.uiElements = [];
            _this.adsManager = adsManagerLoadedEvent.getAdsManager(_this.videoElement, adsRenderingSettings);
            Logger.log('IMA AdsManager loaded');
            _this.addAdsManagerEvents();
            _this.connectUiWithAdsManager();
            if (!_this.isMuted) {
                _this.adsManager.setVolume(convertLocalStorageStringToNumber('StroeerVideoplayerVolume'));
            }
            else {
                _this.adsManager.setVolume(0);
            }
            if (!_this.adsInitialized) {
                _this.adsDisplayContainer.initialize();
                _this.adsInitialized = true;
            }
            try {
                _this.adsManager.init(_this.videoElement.clientWidth, _this.videoElement.clientHeight, google.ima.ViewMode.NORMAL);
                _this.adsManager.start();
            }
            catch (adError) {
                _this.videoElement.play();
            }
        };
        this.onAdsManagerError = function (adErrorEvent) {
            var error = adErrorEvent.getError();
            if (_this.adsManager) {
                _this.adsManager.destroy();
            }
            _this.videoElement.play();
            _this.dispatchAndLogError(error.getVastErrorCode(), error.getMessage());
        };
        this.requestAds = function () {
            var adsRequest = new google.ima.AdsRequest();
            adsRequest.adTagUrl = _this.videoElement.getAttribute('data-ivad-preroll-adtag');
            if (_this.autoplay) {
                adsRequest.setAdWillAutoPlay(true);
                adsRequest.setAdWillPlayMuted(true);
            }
            adsRequest.omidAccessModeRules = {};
            adsRequest.omidAccessModeRules[google.ima.OmidVerificationVendor.GOOGLE] = google.ima.OmidAccessMode.FULL;
            adsRequest.omidAccessModeRules[google.ima.OmidVerificationVendor.OTHER] = google.ima.OmidAccessMode.FULL;
            adsRequest.linearAdSlotWidth = _this.videoElement.clientWidth;
            adsRequest.linearAdSlotHeight = _this.videoElement.clientHeight;
            adsRequest.nonLinearAdSlotWidth = _this.videoElement.clientWidth;
            adsRequest.nonLinearAdSlotHeight = _this.videoElement.clientHeight / 3;
            _this.adsLoader.requestAds(adsRequest);
            _this.videoElement.dispatchEvent(new CustomEvent('ima:adcall'));
        };
        this.addAdsManagerEvents = function () {
            _this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (adErrorEvent) {
                var error = adErrorEvent.getError();
                _this.dispatchAndLogError(error.getVastErrorCode(), error.getMessage());
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.AD_CAN_PLAY, function () {
                _this.showLoadingSpinner(false);
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.AD_BUFFERING, function () {
                _this.showLoadingSpinner(true);
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.AD_METADATA, function () {
                _this.setTimeDisp(_this.adsManager.getRemainingTime());
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.AD_PROGRESS, function () {
                _this.setTimeDisp(_this.adsManager.getRemainingTime());
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, function () {
                Logger.log('Event', 'ima:click');
                _this.videoElement.dispatchEvent(eventWrapper('ima:click'));
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, function () {
                _this.adContainer.style.display = 'none';
                Logger.log('Event', 'ima:ended');
                _this.videoElement.dispatchEvent(eventWrapper('ima:ended'));
            });
            // same as ended
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, function () {
                _this.adContainer.style.display = 'none';
                Logger.log('Event', 'ima:ended');
                _this.videoElement.dispatchEvent(eventWrapper('ima:ended'));
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.FIRST_QUARTILE, function () {
                Logger.log('Event', 'ima:firstQuartile');
                _this.videoElement.dispatchEvent(eventWrapper('ima:firstQuartile'));
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.MIDPOINT, function () {
                Logger.log('Event', 'ima:midpoint');
                _this.videoElement.dispatchEvent(eventWrapper('ima:midpoint'));
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, function () {
                showElement(_this.playButton);
                hideElement(_this.pauseButton);
                Logger.log('Event', 'ima:pause');
                _this.videoElement.dispatchEvent(eventWrapper('ima:pause'));
                dispatchEvent(_this.videoElement, 'UIPause', _this.adsManager.getRemainingTime());
                dispatchEvent(_this.videoElement, 'uiima:pause', _this.adsManager.getRemainingTime());
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, function () {
                hideElement(_this.playButton);
                showElement(_this.pauseButton);
                dispatchEvent(_this.videoElement, 'uiima:resume', _this.adsManager.getRemainingTime());
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, function () {
                _this.adContainer.style.display = 'block';
                hideElement(_this.playButton);
                showElement(_this.pauseButton);
                if (_this.isMuted) {
                    _this.adsManager.setVolume(0);
                    hideElement(_this.muteButton);
                    showElement(_this.unmuteButton);
                }
                else {
                    _this.adsManager.setVolume(_this.volume);
                    showElement(_this.muteButton);
                    hideElement(_this.unmuteButton);
                }
                Logger.log('Event', 'ima:impression');
                _this.videoElement.dispatchEvent(eventWrapper('ima:impression'));
                dispatchEvent(_this.videoElement, 'UIPlay', _this.adsManager.getRemainingTime());
                dispatchEvent(_this.videoElement, 'uiima:play', _this.adsManager.getRemainingTime());
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.THIRD_QUARTILE, function () {
                Logger.log('Event', 'ima:thirdQuartile');
                _this.videoElement.dispatchEvent(eventWrapper('ima:thirdQuartile'));
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED, function () {
                if (!_this.isMuted) {
                    _this.volume = _this.adsManager.getVolume();
                    window.localStorage.setItem('StroeerVideoplayerVolume', _this.volume.toFixed(2));
                    dispatchEvent(_this.videoElement, 'UIUnmute', _this.adsManager.getRemainingTime());
                    dispatchEvent(_this.videoElement, 'uiima:unmute', _this.adsManager.getRemainingTime());
                }
                window.localStorage.setItem('StroeerVideoplayerMuted', _this.isMuted ? '1' : '0');
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED, function () {
                window.localStorage.setItem('StroeerVideoplayerMuted', '1');
                dispatchEvent(_this.videoElement, 'UIMute', _this.adsManager.getRemainingTime());
                dispatchEvent(_this.videoElement, 'uiima:mute', _this.adsManager.getRemainingTime());
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, function () {
                _this.videoElement.pause();
            });
            _this.adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, function () {
                _this.videoElement.play();
            });
        };
        this.connectUiWithAdsManager = function () {
            var controlbarContainer = _this.adContainer.querySelector('.controlbar-container');
            _this.playButton = _this.adContainer.querySelector('.buttons .play');
            _this.pauseButton = _this.adContainer.querySelector('.buttons .pause');
            _this.muteButton = _this.adContainer.querySelector('.buttons .mute');
            _this.unmuteButton = _this.adContainer.querySelector('.buttons .unmute');
            var enterFullscreenButton = _this.adContainer.querySelector('.buttons .enterFullscreen');
            var exitFullscreenButton = _this.adContainer.querySelector('.buttons .exitFullscreen');
            var volumeContainer = _this.adContainer.querySelector('.volume-container');
            var volumeRange = volumeContainer === null || volumeContainer === void 0 ? void 0 : volumeContainer.querySelector('.volume-range');
            var volumeLevel = volumeContainer === null || volumeContainer === void 0 ? void 0 : volumeContainer.querySelector('.volume-level');
            var volumeLevelBubble = volumeContainer === null || volumeContainer === void 0 ? void 0 : volumeContainer.querySelector('.volume-level-bubble');
            var toggleControlbarInSeconds = 5;
            var toggleControlbarSecondsLeft = toggleControlbarInSeconds;
            var toggleControlbarTicker = function () {
                if (toggleControlbarSecondsLeft === 0) {
                    controlbarContainer.style.opacity = '0';
                }
                else {
                    toggleControlbarSecondsLeft = toggleControlbarSecondsLeft - 1;
                }
            };
            _this.rootElement.addEventListener('mousemove', function () {
                toggleControlbarSecondsLeft = toggleControlbarInSeconds;
                controlbarContainer.style.opacity = '1';
            });
            clearInterval(_this.toggleControlBarInterval);
            _this.toggleControlBarInterval = setInterval(toggleControlbarTicker, 1000);
            var toggleVolumeSliderInSeconds = 2;
            var toggleVolumeSliderSecondsLeft = toggleVolumeSliderInSeconds;
            var toggleVolumeSliderTicker = function () {
                if (toggleVolumeSliderSecondsLeft === 0) {
                    volumeContainer.style.opacity = '0';
                }
                else {
                    toggleVolumeSliderSecondsLeft = toggleVolumeSliderSecondsLeft - 1;
                }
            };
            var volumeHeight = String((_this.volume * 100).toFixed(2)) + '%';
            volumeLevel.style.height = volumeHeight;
            volumeLevelBubble.style.bottom = 'calc(' + volumeHeight + ' - 4px)';
            volumeContainer.addEventListener('mousemove', function () {
                toggleVolumeSliderSecondsLeft = toggleVolumeSliderInSeconds;
            });
            clearInterval(_this.toggleVolumeBarInterval);
            _this.toggleVolumeBarInterval = setInterval(toggleVolumeSliderTicker, 1000);
            window.addEventListener('resize', function (event) {
                var _a;
                (_a = _this.adsManager) === null || _a === void 0 ? void 0 : _a.resize(_this.videoElement.clientWidth, _this.videoElement.clientHeight, google.ima.ViewMode.NORMAL);
            });
            _this.playButton.addEventListener('click', function () {
                _this.adsManager.resume();
            });
            _this.pauseButton.addEventListener('click', function () {
                _this.adsManager.pause();
            });
            _this.muteButton.addEventListener('click', function () {
                _this.volume = _this.adsManager.getVolume() || _this.volume;
                _this.isMuted = true;
                _this.adsManager.setVolume(0);
                hideElement(_this.muteButton);
                showElement(_this.unmuteButton);
            });
            _this.unmuteButton.addEventListener('click', function () {
                _this.adsManager.setVolume(_this.volume);
                _this.isMuted = false;
                hideElement(_this.unmuteButton);
                showElement(_this.muteButton);
            });
            _this.muteButton.addEventListener('mouseover', function () {
                if (!isTouchDevice()) {
                    volumeContainer.style.opacity = '1';
                    toggleVolumeSliderSecondsLeft = toggleVolumeSliderInSeconds;
                }
            });
            _this.unmuteButton.addEventListener('mouseover', function () {
                if (!isTouchDevice()) {
                    volumeContainer.style.opacity = '1';
                    toggleVolumeSliderSecondsLeft = toggleVolumeSliderInSeconds;
                }
            });
            enterFullscreenButton.addEventListener('click', function () {
                dispatchEvent(_this.videoElement, 'UIEnterFullscreen', _this.adsManager.getRemainingTime());
                dispatchEvent(_this.videoElement, 'uiima:enterFullscreen', _this.adsManager.getRemainingTime());
                _this.adsManager.resize(window.innerWidth, window.innerHeight, google.ima.ViewMode.FULLSCREEN);
                if (typeof _this.rootElement.requestFullscreen === 'function') {
                    _this.rootElement.requestFullscreen();
                }
                else if (typeof _this.rootElement.webkitRequestFullscreen === 'function') {
                    if (navigator.userAgent.includes('iPad') && _this.videoElement.webkitRequestFullscreen) {
                        _this.videoElement.webkitRequestFullscreen();
                    }
                    else {
                        _this.rootElement.webkitRequestFullscreen();
                    }
                }
                else if (typeof _this.rootElement.mozRequestFullscreen === 'function') {
                    _this.rootElement.mozRequestFullscreen();
                }
                else if (typeof _this.rootElement.msRequestFullscreen === 'function') {
                    _this.rootElement.msRequestFullscreen();
                }
                else if (typeof _this.rootElement.webkitEnterFullscreen === 'function') {
                    _this.rootElement.webkitEnterFullscreen();
                }
                else if (typeof _this.videoElement.webkitEnterFullscreen === 'function') {
                    _this.videoElement.webkitEnterFullscreen();
                }
                else {
                    console.log('Error trying to enter Fullscreen mode: No Request Fullscreen Function found');
                }
            });
            exitFullscreenButton.addEventListener('click', function () {
                dispatchEvent(_this.videoElement, 'UIExitFullscreen', _this.adsManager.getRemainingTime());
                dispatchEvent(_this.videoElement, 'uiima:exitFullscreen', _this.adsManager.getRemainingTime());
                if (typeof document.exitFullscreen === 'function') {
                    document.exitFullscreen().then(noop).catch(noop);
                }
                else if (typeof document.webkitExitFullscreen === 'function') {
                    document.webkitExitFullscreen();
                }
                else if (typeof document.mozCancelFullScreen === 'function') {
                    document.mozCancelFullScreen().then(noop).catch(noop);
                }
                else if (typeof document.msExitFullscreen === 'function') {
                    document.msExitFullscreen();
                }
                else if (typeof _this.videoElement.webkitExitFullscreen === 'function') {
                    _this.videoElement.webkitExitFullscreen();
                }
                else {
                    console.log('Error trying to enter Fullscreen mode: No Request Fullscreen Function found');
                }
                _this.adsManager.resize(_this.videoElement.clientWidth, _this.videoElement.clientHeight, google.ima.ViewMode.NORMAL);
            });
            _this.onDocumentFullscreenChange = function () {
                if (document.fullscreenElement === _this.rootElement || document.fullscreenElement === _this.videoElement) {
                    _this.videoElement.dispatchEvent(new Event('fullscreen'));
                    hideElement(enterFullscreenButton);
                    showElement(exitFullscreenButton);
                }
                else {
                    _this.videoElement.dispatchEvent(new Event('exitFullscreen'));
                    showElement(enterFullscreenButton);
                    hideElement(exitFullscreenButton);
                }
            };
            // @ts-expect-error
            document.addEventListener('fullscreenchange', _this.onDocumentFullscreenChange);
            // iOS Workarounds
            _this.videoElement.addEventListener('webkitendfullscreen', function () {
                // @ts-expect-error
                document.fullscreenElement = null;
                showElement(enterFullscreenButton);
                hideElement(exitFullscreenButton);
            });
            document.addEventListener('webkitfullscreenchange', function () {
                if (document.webkitFullscreenElement !== null) {
                    showElement(exitFullscreenButton);
                    hideElement(enterFullscreenButton);
                }
                else {
                    showElement(enterFullscreenButton);
                    hideElement(exitFullscreenButton);
                }
            });
            // IE11 workaround
            document.addEventListener('MSFullscreenChange', function () {
                if (document.msFullscreenElement !== null) {
                    showElement(exitFullscreenButton);
                    hideElement(enterFullscreenButton);
                }
                else {
                    hideElement(exitFullscreenButton);
                    showElement(enterFullscreenButton);
                }
            });
            var updateVolumeWhileDragging = function (evt) {
                if (evt.target === volumeContainer ||
                    evt.target === volumeLevel ||
                    evt.target === volumeLevelBubble ||
                    evt.target === volumeRange) {
                    var clientY = evt.clientY;
                    if (clientY === undefined) {
                        if ('touches' in evt && evt.touches.length > 0) {
                            clientY = evt.touches[0].clientY;
                        }
                        else {
                            clientY = false;
                        }
                    }
                    if (clientY === false)
                        return;
                    var volumeRangeBoundingClientRect = volumeRange.getBoundingClientRect();
                    var volumeContainerOffsetY = 0;
                    if ('y' in volumeRangeBoundingClientRect) {
                        volumeContainerOffsetY = volumeRangeBoundingClientRect.y;
                    }
                    else {
                        volumeContainerOffsetY = volumeRangeBoundingClientRect.top;
                    }
                    var y = clientY - volumeContainerOffsetY;
                    if (y < 0) {
                        y = 0;
                    }
                    if (y > volumeRangeBoundingClientRect.height) {
                        y = volumeRangeBoundingClientRect.height;
                    }
                    var percentageY = calculateVolumePercentageBasedOnYCoords(y, volumeRange.offsetHeight);
                    var percentageHeight = 100 - percentageY;
                    var percentageHeightString = String(percentageHeight);
                    var percentageYString = String(percentageY);
                    volumeLevel.style.height = percentageHeightString + '%';
                    if (percentageY < 90) {
                        volumeLevelBubble.style.top = percentageYString + '%';
                    }
                    var volume = percentageHeight / 100;
                    _this.volume = volume;
                    window.localStorage.setItem('StroeerVideoplayerVolume', _this.volume.toFixed(2));
                    if (!_this.isMuted) {
                        _this.adsManager.setVolume(volume);
                    }
                }
            };
            var draggingWhat = '';
            _this.onDragStart = function (evt) {
                switch (evt.target) {
                    case volumeRange:
                    case volumeLevel:
                    case volumeLevelBubble:
                        dispatchEvent(_this.videoElement, 'UIVolumeChangeStart', {
                            volume: _this.adsManager.getVolume(),
                            currentTime: _this.adsManager.getRemainingTime()
                        });
                        dispatchEvent(_this.videoElement, 'uiima:volumeChangeStart', {
                            volume: _this.adsManager.getVolume(),
                            currentTime: _this.adsManager.getRemainingTime()
                        });
                        draggingWhat = 'volume';
                        break;
                }
            };
            _this.onDragEnd = function (evt) {
                if (draggingWhat === 'volume') {
                    draggingWhat = '';
                    updateVolumeWhileDragging(evt);
                    dispatchEvent(_this.videoElement, 'UIVolumeChangeEnd', {
                        volume: _this.adsManager.getVolume(),
                        currentTime: _this.adsManager.getRemainingTime()
                    });
                    dispatchEvent(_this.videoElement, 'uiima:volumeChangeEnd', {
                        volume: _this.adsManager.getVolume(),
                        currentTime: _this.adsManager.getRemainingTime()
                    });
                }
            };
            _this.onDrag = function (evt) {
                if (draggingWhat === 'volume') {
                    updateVolumeWhileDragging(evt);
                }
            };
            document.body.addEventListener('touchstart', _this.onDragStart, { passive: true });
            document.body.addEventListener('touchend', _this.onDragEnd, { passive: true });
            document.body.addEventListener('touchmove', _this.onDrag, { passive: true });
            document.body.addEventListener('mousedown', _this.onDragStart, { passive: true });
            document.body.addEventListener('mouseup', _this.onDragEnd, { passive: true });
            document.body.addEventListener('mousemove', _this.onDrag, { passive: true });
        };
        this.createUI = function (uiContainer, videoElement, isMuted, isFullscreen) {
            var controlBarContainer = document.createElement('div');
            controlBarContainer.classList.add('controlbar-container');
            uiContainer.appendChild(controlBarContainer);
            var controlBar = document.createElement('div');
            controlBar.className = 'controlbar';
            controlBarContainer.appendChild(controlBar);
            var buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'buttons';
            controlBar.appendChild(buttonsContainer);
            createButton(buttonsContainer, 'play', 'Play', 'Icon-Play', true);
            createButton(buttonsContainer, 'pause', 'Pause', 'Icon-Pause', false);
            createButton(buttonsContainer, 'mute', 'Mute', 'Icon-Volume', isMuted);
            createButton(buttonsContainer, 'unmute', 'Unmute', 'Icon-Mute', !isMuted);
            createButton(buttonsContainer, 'enterFullscreen', 'Enter Fullscreen', 'Icon-Fullscreen', isFullscreen);
            createButton(buttonsContainer, 'exitFullscreen', 'Exit Fullscreen', 'Icon-FullscreenOff', !isFullscreen);
            var volumeContainer = document.createElement('div');
            volumeContainer.className = 'volume-container';
            volumeContainer.style.opacity = '0';
            controlBar.appendChild(volumeContainer);
            var volumeRange = document.createElement('div');
            volumeRange.className = 'volume-range';
            volumeContainer.appendChild(volumeRange);
            var volumeLevel = document.createElement('div');
            volumeLevel.className = 'volume-level';
            volumeRange.appendChild(volumeLevel);
            var volumeLevelBubble = document.createElement('div');
            volumeLevelBubble.className = 'volume-level-bubble';
            volumeRange.appendChild(volumeLevelBubble);
            _this.timeDisp.classList.add('time');
            controlBar.appendChild(_this.timeDisp);
            if (isTouchDevice()) {
                var overlayTouchClickContainer = document.createElement('div');
                overlayTouchClickContainer.className = 'video-overlay-touchclick';
                overlayTouchClickContainer.innerHTML = 'Mehr Informationen';
                uiContainer.appendChild(overlayTouchClickContainer);
            }
            var loadingSpinnerAnimation = document.createElement('div');
            _this.loadingSpinnerContainer.className = 'loading-spinner';
            hideElement(_this.loadingSpinnerContainer);
            loadingSpinnerAnimation.className = 'animation';
            _this.loadingSpinnerContainer.appendChild(loadingSpinnerAnimation);
            uiContainer.appendChild(_this.loadingSpinnerContainer);
            for (var i = 0; i < 12; i++) {
                var d = document.createElement('div');
                loadingSpinnerAnimation.appendChild(d);
            }
        };
        this.showLoadingSpinner = function (modus) {
            if (modus) {
                showElement(_this.loadingSpinnerContainer);
            }
            else {
                hideElement(_this.loadingSpinnerContainer);
            }
        };
        this.setTimeDisp = function (remainingTime) {
            if (isNaN(remainingTime)) {
                _this.timeDisp.innerHTML = 'Werbung';
            }
            else {
                _this.timeDisp.innerHTML = 'Werbung endet in ' + String(Math.floor(remainingTime)) + ' Sekunden';
            }
        };
        this.dispatchAndLogError = function (code, message) {
            _this.videoElement.dispatchEvent(eventWrapper('ima:error', {
                errorCode: code,
                errorMessage: message
            }));
            Logger.log('event', 'ima:error', {
                errorCode: code,
                errorMessage: message
            });
        };
        this.deinit = function (StroeerVideoplayer) {
            _this.videoElement.removeEventListener('play', _this.onVideoElementPlay);
            _this.videoElement.removeEventListener('contentVideoEnded', _this.onContentVideoEnded);
        };
        this.videoElement = document.createElement('video');
        this.rootElement = document.createElement('div');
        this.adContainer = document.createElement('div');
        this.loadingSpinnerContainer = document.createElement('div');
        this.timeDisp = document.createElement('div');
        this.playButton = document.createElement('button');
        this.pauseButton = document.createElement('button');
        this.muteButton = document.createElement('button');
        this.unmuteButton = document.createElement('button');
        this.onDocumentFullscreenChange = noop;
        this.onDrag = noop;
        this.onDragStart = noop;
        this.onDragEnd = noop;
        this.assignEvent = noop;
        this.toggleControlBarInterval = setInterval(noop, 1000);
        this.toggleVolumeBarInterval = setInterval(noop, 1000);
        this.isMuted = false;
        this.volume = 0;
        this.loadIMAScript = new Promise(function (resolve, reject) { });
        this.autoplay = false;
        this.adsManager = null;
        this.adsLoader = null;
        this.adsDisplayContainer = null;
        this.adsInitialized = false;
        return this;
    }
    Plugin.version = version;
    Plugin.pluginName = 'ima';
    return Plugin;
}());

export { Plugin as default };
//# sourceMappingURL=stroeerVideoplayer-ima-plugin.esm.js.map
