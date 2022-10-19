var version = "1.1.0";

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
var createButton = function (container, tag, cls, aria, svgid, ishidden) {
    var el = document.createElement(tag);
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
var setTimeDisp = function (timeDisp, remainingTime) {
    var secondsLeftString = String(Math.floor(remainingTime));
    if (isNaN(remainingTime)) {
        timeDisp.innerHTML = 'Werbung';
    }
    else {
        timeDisp.innerHTML = 'Werbung endet in ' + secondsLeftString + ' Sekunden';
    }
};
var isTouchDevice = function () {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
};
var isAlreadyInFullscreenMode = function (rootElement, videoElement) {
    return (document.fullscreenElement === rootElement || document.fullscreenElement === videoElement);
};

var createUI = function (videoElement, isMuted, isFullscreen) {
    var adContainer = document.createElement('div');
    adContainer.classList.add('ima-ad-container');
    videoElement.after(adContainer);
    var uiContainer = document.createElement('div');
    uiContainer.className = 'ima';
    adContainer.appendChild(uiContainer);
    var controlBarContainer = document.createElement('div');
    controlBarContainer.classList.add('controlbar-container');
    uiContainer.appendChild(controlBarContainer);
    var controlBar = document.createElement('div');
    controlBar.className = 'controlbar';
    controlBarContainer.appendChild(controlBar);
    var buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons';
    controlBar.appendChild(buttonsContainer);
    createButton(buttonsContainer, 'button', 'play', 'Play', 'Icon-Play', true);
    createButton(buttonsContainer, 'button', 'pause', 'Pause', 'Icon-Pause', false);
    createButton(buttonsContainer, 'button', 'mute', 'Mute', 'Icon-Volume', isMuted);
    createButton(buttonsContainer, 'button', 'unmute', 'Unmute', 'Icon-Mute', !isMuted);
    createButton(buttonsContainer, 'button', 'enterFullscreen', 'Enter Fullscreen', 'Icon-Fullscreen', isFullscreen);
    createButton(buttonsContainer, 'button', 'exitFullscreen', 'Exit Fullscreen', 'Icon-FullscreenOff', !isFullscreen);
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
    var timeDisp = document.createElement('div');
    timeDisp.classList.add('time');
    controlBar.appendChild(timeDisp);
    if (isTouchDevice()) {
        var overlayTouchClickContainer = document.createElement('div');
        overlayTouchClickContainer.className = 'video-overlay-touchclick';
        overlayTouchClickContainer.innerHTML = 'Mehr Informationen';
        uiContainer.appendChild(overlayTouchClickContainer);
    }
    var loadingSpinnerContainer = document.createElement('div');
    var loadingSpinnerAnimation = document.createElement('div');
    loadingSpinnerContainer.className = 'loading-spinner';
    hideElement(loadingSpinnerContainer);
    loadingSpinnerAnimation.className = 'animation';
    loadingSpinnerContainer.appendChild(loadingSpinnerAnimation);
    uiContainer.appendChild(loadingSpinnerContainer);
    for (var i = 0; i < 12; i++) {
        var d = document.createElement('div');
        loadingSpinnerAnimation.appendChild(d);
    }
};

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
var Plugin = /** @class */ (function () {
    function Plugin() {
        var _this = this;
        this.init = function (StroeerVideoplayer, opts) {
            var videoElement = StroeerVideoplayer.getVideoEl();
            // load sdk first
            var promise = loadScript('//imasdk.googleapis.com/js/sdkloader/ima3.js');
            promise
                .then(function () {
                _this.requestAds(StroeerVideoplayer);
            })
                .catch(function () {
                videoElement.dispatchEvent(eventWrapper('ima:error', {
                    errorCode: 301,
                    errorMessage: 'IMA could not be loaded'
                }));
                Logger.log('event', 'ima:error', {
                    errorCode: 301,
                    errorMessage: 'IMA could not be loaded'
                });
            });
        };
        this.requestAds = function (StroeerVideoplayer) {
            var videoElement = StroeerVideoplayer.getVideoEl();
            var rootElement = StroeerVideoplayer.getRootEl();
            _this.isMuted = convertLocalStorageIntegerToBoolean('StroeerVideoplayerMuted');
            _this.volume = convertLocalStorageStringToNumber('StroeerVideoplayerVolume');
            createUI(videoElement, _this.isMuted, isAlreadyInFullscreenMode(rootElement, videoElement));
            var adContainer = document.querySelector('.ima-ad-container');
            var loadingSpinnerContainer = adContainer === null || adContainer === void 0 ? void 0 : adContainer.querySelector('.loading-spinner');
            var controlbarContainer = adContainer === null || adContainer === void 0 ? void 0 : adContainer.querySelector('.controlbar-container');
            var playButton = adContainer === null || adContainer === void 0 ? void 0 : adContainer.querySelector('.buttons .play');
            var pauseButton = adContainer === null || adContainer === void 0 ? void 0 : adContainer.querySelector('.buttons .pause');
            var muteButton = adContainer === null || adContainer === void 0 ? void 0 : adContainer.querySelector('.buttons .mute');
            var unmuteButton = adContainer === null || adContainer === void 0 ? void 0 : adContainer.querySelector('.buttons .unmute');
            var timeDisp = adContainer === null || adContainer === void 0 ? void 0 : adContainer.querySelector('.controlbar .time');
            var enterFullscreenButton = adContainer === null || adContainer === void 0 ? void 0 : adContainer.querySelector('.buttons .enterFullscreen');
            var exitFullscreenButton = adContainer === null || adContainer === void 0 ? void 0 : adContainer.querySelector('.buttons .exitFullscreen');
            var volumeContainer = adContainer === null || adContainer === void 0 ? void 0 : adContainer.querySelector('.volume-container');
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
            var showLoading = function (modus) {
                if (modus) {
                    showElement(loadingSpinnerContainer);
                }
                else {
                    hideElement(loadingSpinnerContainer);
                }
            };
            showLoading(true);
            rootElement.addEventListener('mousemove', function () {
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
                if (adsManager) {
                    adsManager.resize(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL);
                }
            });
            playButton.addEventListener('click', function () {
                if (adsManager) {
                    dispatchEvent(videoElement, 'UIPlay', videoElement.currentTime);
                    dispatchEvent(videoElement, 'uiima:play', videoElement.currentTime);
                    /* if (adsManager.getRemainingTime() > 0) {
                      dispatchEvent(videoElement, 'uiima:resume', videoElement.currentTime)
                    } */
                    adsManager.resume();
                }
            });
            pauseButton.addEventListener('click', function () {
                if (adsManager) {
                    dispatchEvent(videoElement, 'UIPause', adsManager.getRemainingTime());
                    dispatchEvent(videoElement, 'uiima:pause', adsManager.getRemainingTime());
                    adsManager.pause();
                }
            });
            muteButton.addEventListener('click', function () {
                if (adsManager) {
                    dispatchEvent(videoElement, 'UIMute', adsManager.getRemainingTime());
                    dispatchEvent(videoElement, 'uiima:mute', adsManager.getRemainingTime());
                    _this.volume = adsManager.getVolume();
                    _this.isMuted = true;
                    adsManager.setVolume(0);
                }
            });
            unmuteButton.addEventListener('click', function () {
                if (adsManager) {
                    dispatchEvent(videoElement, 'UIUnmute', adsManager.getRemainingTime());
                    dispatchEvent(videoElement, 'uiima:unmute', adsManager.getRemainingTime());
                    adsManager.setVolume(_this.volume);
                    _this.isMuted = false;
                }
            });
            muteButton.addEventListener('mouseover', function () {
                if (!isTouchDevice()) {
                    volumeContainer.style.opacity = '1';
                    toggleVolumeSliderSecondsLeft = toggleVolumeSliderInSeconds;
                }
            });
            unmuteButton.addEventListener('mouseover', function () {
                if (!isTouchDevice()) {
                    volumeContainer.style.opacity = '1';
                    toggleVolumeSliderSecondsLeft = toggleVolumeSliderInSeconds;
                }
            });
            enterFullscreenButton.addEventListener('click', function () {
                if (adsManager) {
                    dispatchEvent(videoElement, 'UIEnterFullscreen', adsManager.getRemainingTime());
                    dispatchEvent(videoElement, 'uiima:enterFullscreen', adsManager.getRemainingTime());
                    adsManager.resize(window.innerWidth, window.innerHeight, google.ima.ViewMode.FULLSCREEN);
                    if (typeof rootElement.requestFullscreen === 'function') {
                        rootElement.requestFullscreen();
                    }
                    else if (typeof rootElement.webkitRequestFullscreen === 'function') {
                        if (navigator.userAgent.includes('iPad')) {
                            videoElement.webkitRequestFullscreen();
                        }
                        else {
                            rootElement.webkitRequestFullscreen();
                        }
                    }
                    else if (typeof rootElement.mozRequestFullScreen === 'function') {
                        rootElement.mozRequestFullScreen();
                    }
                    else if (typeof rootElement.msRequestFullscreen === 'function') {
                        rootElement.msRequestFullscreen();
                    }
                    else if (typeof rootElement.webkitEnterFullscreen === 'function') {
                        rootElement.webkitEnterFullscreen();
                    }
                    else if (typeof videoElement.webkitEnterFullscreen === 'function') {
                        videoElement.webkitEnterFullscreen();
                    }
                    else {
                        console.log('Error trying to enter Fullscreen mode: No Request Fullscreen Function found');
                    }
                }
            });
            exitFullscreenButton.addEventListener('click', function () {
                if (adsManager) {
                    dispatchEvent(videoElement, 'UIExitFullscreen', adsManager.getRemainingTime());
                    dispatchEvent(videoElement, 'uiima:exitFullscreen', adsManager.getRemainingTime());
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
                    else if (typeof videoElement.webkitExitFullscreen === 'function') {
                        videoElement.webkitExitFullscreen();
                    }
                    else {
                        console.log('Error trying to enter Fullscreen mode: No Request Fullscreen Function found');
                    }
                    adsManager.resize(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL);
                }
            });
            _this.onDocumentFullscreenChange = function () {
                if (document.fullscreenElement === rootElement || document.fullscreenElement === videoElement) {
                    videoElement.dispatchEvent(new Event('fullscreen'));
                    hideElement(enterFullscreenButton);
                    showElement(exitFullscreenButton);
                }
                else {
                    videoElement.dispatchEvent(new Event('exitFullscreen'));
                    showElement(enterFullscreenButton);
                    hideElement(exitFullscreenButton);
                }
            };
            // @ts-expect-error
            document.addEventListener('fullscreenchange', _this.onDocumentFullscreenChange);
            // iOS Workarounds
            videoElement.addEventListener('webkitendfullscreen', function () {
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
                if ('x' in volumeRangeBoundingClientRect) {
                    volumeContainerOffsetY = volumeRangeBoundingClientRect.y;
                }
                else {
                    volumeContainerOffsetY = volumeRangeBoundingClientRect.top;
                }
                var y = clientY - volumeContainerOffsetY;
                if (y < 0)
                    y = 0;
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
                    adsManager.setVolume(volume);
                }
            };
            var draggingWhat = '';
            _this.onDragStart = function (evt) {
                switch (evt.target) {
                    case volumeRange:
                    case volumeLevel:
                    case volumeLevelBubble:
                        dispatchEvent(videoElement, 'UIVolumeChangeStart', {
                            volume: adsManager.getVolume(),
                            currentTime: adsManager.getRemainingTime()
                        });
                        dispatchEvent(videoElement, 'uiima:volumeChangeStart', {
                            volume: adsManager.getVolume(),
                            currentTime: adsManager.getRemainingTime()
                        });
                        draggingWhat = 'volume';
                        break;
                }
            };
            _this.onDragEnd = function (evt) {
                if (draggingWhat === 'volume') {
                    draggingWhat = '';
                    updateVolumeWhileDragging(evt);
                    dispatchEvent(videoElement, 'UIVolumeChangeEnd', {
                        volume: adsManager.getVolume(),
                        currentTime: adsManager.getRemainingTime()
                    });
                    dispatchEvent(videoElement, 'uiima:volumeChangeEnd', {
                        volume: adsManager.getVolume(),
                        currentTime: adsManager.getRemainingTime()
                    });
                }
            };
            _this.onDrag = function (evt) {
                if (draggingWhat === 'volume') {
                    updateVolumeWhileDragging(evt);
                }
            };
            document.body.addEventListener('touchstart', _this.onDragStart, {
                passive: true
            });
            document.body.addEventListener('touchend', _this.onDragEnd, {
                passive: true
            });
            document.body.addEventListener('touchmove', _this.onDrag, {
                passive: true
            });
            document.body.addEventListener('mousedown', _this.onDragStart, {
                passive: true
            });
            document.body.addEventListener('mouseup', _this.onDragEnd, {
                passive: true
            });
            document.body.addEventListener('mousemove', _this.onDrag, {
                passive: true
            });
            // ima settings
            google.ima.settings.setNumRedirects(10);
            google.ima.settings.setLocale('de');
            var adsManager;
            var adDisplayContainer = new google.ima.AdDisplayContainer(adContainer);
            var adsLoader = new google.ima.AdsLoader(adDisplayContainer);
            _this.assignEvent = function (event) {
                switch (event.type) {
                    case google.ima.AdEvent.Type.AD_CAN_PLAY:
                        showLoading(false);
                        break;
                    case google.ima.AdEvent.Type.AD_BUFFERING:
                        showLoading(true);
                        break;
                    case google.ima.AdEvent.Type.AD_METADATA:
                        setTimeDisp(timeDisp, adsManager.getRemainingTime());
                        break;
                    case google.ima.AdEvent.Type.AD_PROGRESS:
                        // showLoading(false)
                        setTimeDisp(timeDisp, adsManager.getRemainingTime());
                        break;
                    case google.ima.AdEvent.Type.STARTED:
                        adContainer.style.display = 'block';
                        hideElement(playButton);
                        showElement(pauseButton);
                        Logger.log('Event', 'ima:impression');
                        videoElement.dispatchEvent(eventWrapper('ima:impression'));
                        break;
                    case google.ima.AdEvent.Type.RESUMED:
                        hideElement(playButton);
                        showElement(pauseButton);
                        break;
                    case google.ima.AdEvent.Type.SKIPPED:
                    case google.ima.AdEvent.Type.COMPLETE:
                        adContainer.style.display = 'none';
                        Logger.log('Event', 'ima:ended');
                        videoElement.dispatchEvent(eventWrapper('ima:ended'));
                        break;
                    case google.ima.AdEvent.Type.PAUSED:
                        showElement(playButton);
                        hideElement(pauseButton);
                        Logger.log('Event', 'ima:pause');
                        videoElement.dispatchEvent(eventWrapper('ima:pause'));
                        break;
                    case google.ima.AdEvent.Type.CLICK:
                        Logger.log('Event', 'ima:click');
                        videoElement.dispatchEvent(eventWrapper('ima:click'));
                        break;
                    case google.ima.AdEvent.Type.FIRST_QUARTILE:
                        Logger.log('Event', 'ima:firstQuartile');
                        videoElement.dispatchEvent(eventWrapper('ima:firstQuartile'));
                        break;
                    case google.ima.AdEvent.Type.MIDPOINT:
                        Logger.log('Event', 'ima:midpoint');
                        videoElement.dispatchEvent(eventWrapper('ima:midpoint'));
                        break;
                    case google.ima.AdEvent.Type.THIRD_QUARTILE:
                        Logger.log('Event', 'ima:thirdQuartile');
                        videoElement.dispatchEvent(eventWrapper('ima:thirdQuartile'));
                        break;
                    case google.ima.AdEvent.Type.VOLUME_CHANGED:
                        if (!_this.isMuted) {
                            _this.volume = adsManager.getVolume();
                        }
                        if (_this.isMuted) {
                            hideElement(muteButton);
                            showElement(unmuteButton);
                        }
                        else {
                            showElement(muteButton);
                            hideElement(unmuteButton);
                        }
                        window.localStorage.setItem('StroeerVideoplayerMuted', _this.isMuted ? '1' : '0');
                        if (!_this.isMuted) {
                            window.localStorage.setItem('StroeerVideoplayerVolume', _this.volume.toFixed(2));
                        }
                        break;
                    case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                        videoElement.pause();
                        break;
                    case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                        videoElement.play();
                        break;
                }
            };
            adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function (adsManagerLoadedEvent) {
                var adsRenderingSettings = new google.ima.AdsRenderingSettings();
                adsRenderingSettings.loadVideoTimeout = -1;
                adsRenderingSettings.uiElements = [];
                adsManager = adsManagerLoadedEvent.getAdsManager(videoElement, adsRenderingSettings);
                Logger.log('IMA AdsManager loaded');
                if (!_this.isMuted) {
                    adsManager.setVolume(convertLocalStorageStringToNumber('StroeerVideoplayerVolume'));
                }
                else {
                    adsManager.setVolume(convertLocalStorageIntegerToBoolean('StroeerVideoplayerMuted'));
                }
                try {
                    adsManager.init(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL);
                    adsManager.start();
                }
                catch (adError) {
                    // eslint-disable-next-line
                    videoElement.play();
                }
                adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (adErrorEvent) {
                    var error = adErrorEvent.getError();
                    videoElement.dispatchEvent(eventWrapper('ima:error', {
                        errorCode: error.getVastErrorCode(),
                        errorMessage: error.getMessage()
                    }));
                    Logger.log('adsManager ', 'ima:error', {
                        errorCode: error.getVastErrorCode(),
                        errorMessage: error.getMessage()
                    });
                });
                var events = [
                    google.ima.AdEvent.Type.AD_BUFFERING,
                    google.ima.AdEvent.Type.AD_CAN_PLAY,
                    google.ima.AdEvent.Type.AD_METADATA,
                    google.ima.AdEvent.Type.AD_PROGRESS,
                    google.ima.AdEvent.Type.CLICK,
                    google.ima.AdEvent.Type.COMPLETE,
                    google.ima.AdEvent.Type.FIRST_QUARTILE,
                    google.ima.AdEvent.Type.MIDPOINT,
                    google.ima.AdEvent.Type.PAUSED,
                    google.ima.AdEvent.Type.RESUMED,
                    google.ima.AdEvent.Type.SKIPPED,
                    google.ima.AdEvent.Type.STARTED,
                    google.ima.AdEvent.Type.THIRD_QUARTILE,
                    google.ima.AdEvent.Type.VOLUME_CHANGED,
                    google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
                    google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED
                ];
                events.forEach(function (event) {
                    adsManager.addEventListener(event, _this.assignEvent);
                });
            });
            adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (adErrorEvent) {
                if (adsManager) {
                    adsManager.destroy();
                }
                // eslint-disable-next-line
                videoElement.play();
                var error = adErrorEvent.getError();
                videoElement.dispatchEvent(eventWrapper('ima:error', {
                    errorCode: error.getVastErrorCode(),
                    errorMessage: error.getMessage()
                }));
                Logger.log('adsLoader ', 'ima:error', {
                    errorCode: error.getVastErrorCode(),
                    errorMessage: error.getMessage()
                });
            });
            _this.onVideoElPlay = function (event) {
                var prerollAdTag = videoElement.getAttribute('data-ivad-preroll-adtag');
                if (prerollAdTag !== null) {
                    videoElement.removeEventListener('play', _this.onVideoElPlay);
                    if (prerollAdTag === 'adblocked') {
                        videoElement.dispatchEvent(eventWrapper('ima:error', {
                            errorCode: 301,
                            errorMessage: 'VAST redirect timeout reached'
                        }));
                        Logger.log('event', 'ima:error', {
                            errorCode: 301,
                            errorMessage: 'VAST redirect timeout reached'
                        });
                    }
                    else {
                        event.preventDefault();
                        videoElement.pause();
                        videoElement.dispatchEvent(new CustomEvent('ima:adcall'));
                        if (adsManager) {
                            adsManager.destroy();
                        }
                        var adsRequest = new google.ima.AdsRequest();
                        adsRequest.adTagUrl = videoElement.getAttribute('data-ivad-preroll-adtag');
                        adsRequest.omidAccessModeRules = {};
                        adsRequest.omidAccessModeRules[google.ima.OmidVerificationVendor.GOOGLE] = google.ima.OmidAccessMode.FULL;
                        // Specify the linear and nonlinear slot sizes. This helps the SDK to
                        // select the correct creative if multiple are returned.
                        adsRequest.linearAdSlotWidth = videoElement.clientWidth;
                        adsRequest.linearAdSlotHeight = videoElement.clientHeight;
                        adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
                        adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;
                        // Pass the request to the adsLoader to request ads
                        adsLoader.requestAds(adsRequest);
                        // TODO: Initialize the container Must be done via a user action on mobile devices.
                        adDisplayContainer.initialize();
                    }
                }
            };
            _this.onVideoElContentVideoEnded = function () {
                videoElement.addEventListener('play', _this.onVideoElPlay);
            };
            videoElement.addEventListener('contentVideoEnded', function () {
                _this.onVideoElContentVideoEnded();
            });
            videoElement.addEventListener('play', _this.onVideoElPlay);
        };
        this.deinit = function (StroeerVideoplayer) {
            var videoElement = StroeerVideoplayer.getVideoEl();
            videoElement.removeEventListener('play', _this.onVideoElPlay);
            videoElement.removeEventListener('contentVideoEnded', _this.onVideoElContentVideoEnded);
        };
        this.onVideoElPlay = noop;
        this.onVideoElContentVideoEnded = noop;
        this.onDocumentFullscreenChange = noop;
        this.onDrag = noop;
        this.onDragStart = noop;
        this.onDragEnd = noop;
        this.assignEvent = noop;
        this.toggleControlBarInterval = setInterval(noop, 1000);
        this.toggleVolumeBarInterval = setInterval(noop, 1000);
        this.isMuted = false;
        this.volume = 0;
        return this;
    }
    Plugin.version = version;
    Plugin.pluginName = 'ima';
    return Plugin;
}());

export { Plugin as default };
//# sourceMappingURL=stroeerVideoplayer-ima-plugin.esm.js.map
