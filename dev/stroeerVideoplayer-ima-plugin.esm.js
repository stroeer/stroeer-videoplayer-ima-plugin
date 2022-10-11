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
                            reject(new Error("".concat(url, " could not be loaded")));
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

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
var Plugin = /** @class */ (function () {
    // initialUI: String
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
            var adContainer = document.createElement('div');
            adContainer.classList.add('ima-ad-container');
            videoElement.after(adContainer);
            // this.initialUI = StroeerVideoplayer.getUIName()
            var uiElements = document.createElement('div');
            uiElements.classList.add('ui-elements');
            adContainer.appendChild(uiElements);
            var playButton = document.createElement('div');
            playButton.classList.add('play-button');
            uiElements.appendChild(playButton);
            var pauseButton = document.createElement('div');
            pauseButton.classList.add('pause-button');
            uiElements.appendChild(pauseButton);
            google.ima.settings.setNumRedirects(10);
            google.ima.settings.setLocale('de');
            var adsManager;
            var adDisplayContainer = new google.ima.AdDisplayContainer(adContainer);
            var adsLoader = new google.ima.AdsLoader(adDisplayContainer);
            window.addEventListener('resize', function (event) {
                if (adsManager) {
                    adsManager.resize(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL);
                }
            });
            playButton.addEventListener('click', function () {
                if (adsManager) {
                    adsManager.resume();
                }
            });
            pauseButton.addEventListener('click', function () {
                if (adsManager) {
                    adsManager.pause();
                }
            });
            _this.assignEvent = function (event) {
                switch (event.type) {
                    case google.ima.AdEvent.Type.STARTED:
                        adContainer.style.display = 'block';
                        Logger.log('Event', 'ima:impression');
                        videoElement.dispatchEvent(eventWrapper('ima:impression'));
                        break;
                    case google.ima.AdEvent.Type.COMPLETE:
                        // StroeerVideoplayer.deinitUI('ima', { adsLoader, adsManager })
                        // StroeerVideoplayer.initUI(this.initialUI)
                        adContainer.style.display = 'none';
                        Logger.log('Event', 'ima:ended');
                        videoElement.dispatchEvent(eventWrapper('ima:ended'));
                        break;
                    case google.ima.AdEvent.Type.PAUSED:
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
                }
            };
            adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function (adsManagerLoadedEvent) {
                var adsRenderingSettings = new google.ima.AdsRenderingSettings();
                adsRenderingSettings.loadVideoTimeout = -1;
                adsRenderingSettings.uiElements = [google.ima.UiElements.AD_ATTRIBUTION, google.ima.UiElements.COUNTDOWN];
                adsManager = adsManagerLoadedEvent.getAdsManager(videoElement, adsRenderingSettings);
                Logger.log('IMA AdsManager loaded');
                try {
                    adsManager.init(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL);
                    adsManager.start();
                }
                catch (adError) {
                    // eslint-disable-next-line
                    videoElement.play();
                }
                adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (adErrorEvent) {
                    // StroeerVideoplayer.deinitUI('ima', { adsManager, adsLoader })
                    // StroeerVideoplayer.initUI(this.initialUI)
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
                adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, function () {
                    videoElement.pause();
                });
                adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, function () {
                    videoElement.play();
                });
                var events = [
                    google.ima.AdEvent.Type.CLICK,
                    google.ima.AdEvent.Type.COMPLETE,
                    google.ima.AdEvent.Type.FIRST_QUARTILE,
                    google.ima.AdEvent.Type.MIDPOINT,
                    google.ima.AdEvent.Type.PAUSED,
                    google.ima.AdEvent.Type.STARTED,
                    google.ima.AdEvent.Type.THIRD_QUARTILE
                ];
                events.forEach(function (event) {
                    adsManager.addEventListener(event, _this.assignEvent);
                });
            });
            adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (adErrorEvent) {
                // StroeerVideoplayer.deinitUI('ima', { adsLoader })
                // StroeerVideoplayer.initUI(this.initialUI)
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
                        // StroeerVideoplayer.deinitUI(StroeerVideoplayer.getUIName())
                        // StroeerVideoplayer.initUI('ima', { adsLoader })
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
        this.assignEvent = noop;
        // this.initialUI = 'default'
        return this;
    }
    Plugin.version = version;
    Plugin.pluginName = 'ima';
    return Plugin;
}());

export { Plugin as default };
//# sourceMappingURL=stroeerVideoplayer-ima-plugin.esm.js.map
