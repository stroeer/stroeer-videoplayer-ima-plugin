var version = "0.0.1";

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

var debugMode = false;
if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    if (window.localStorage.getItem('StroeerVideoplayerDebugMode') !== null) {
        debugMode = true;
    }
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

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
var Plugin = /** @class */ (function () {
    function Plugin() {
        var _this = this;
        this.init = function (StroeerVideoplayer, opts) {
            var _a, _b, _c;
            opts = opts !== null && opts !== void 0 ? opts : {};
            opts.numRedirects = (_a = opts.numRedirects) !== null && _a !== void 0 ? _a : 10;
            opts.timeout = (_b = opts.timeout) !== null && _b !== void 0 ? _b : 5000;
            opts.adLabel = (_c = opts.adLabel) !== null && _c !== void 0 ? _c : 'Advertisment ends in {{seconds}} seconds';
            var videoElement = StroeerVideoplayer.getVideoEl();
            var videoElementWidth = videoElement.clientWidth;
            var videoElementHeight = videoElement.clientHeight;
            var adContainer = document.createElement('div');
            adContainer.classList.add('ad-container');
            videoElement.after(adContainer);
            var adsLoaded = false;
            var adsManager;
            var adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement);
            var adsLoader = new google.ima.AdsLoader(adDisplayContainer);
            window.addEventListener('resize', function (event) {
                if (adsManager) {
                    var width = videoElement.clientWidth;
                    var height = videoElement.clientHeight;
                    adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
                }
            });
            adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function (adsManagerLoadedEvent) {
                console.log('ads manager loaded');
                var adsRenderingSettings = new google.ima.AdsRenderingSettings();
                adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = false;
                adsRenderingSettings.enablePreloading = false;
                adsManager = adsManagerLoadedEvent.getAdsManager(videoElement);
                adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (adErrorEvent) {
                    var error = adErrorEvent.getError();
                    videoElement.dispatchEvent(eventWrapper('ima:error', {
                        errorCode: error.getVastErrorCode(),
                        errorMessage: error.getMessage()
                    }));
                    Logger.log('Event', 'ima:error', {
                        errorCode: error.getVastErrorCode(),
                        errorMessage: error.getMessage()
                    });
                });
                adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, function () {
                    videoElement.pause();
                });
                adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, function () {
                    console.log('>>>> resume');
                    videoElement.play();
                    adContainer.style.display = 'none';
                });
                adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, function () {
                    Logger.log('>>> all ads complete');
                });
                adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, function () {
                    Logger.log('>>> ad loaded');
                });
                adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, function () {
                    StroeerVideoplayer.deinitUI('default');
                    StroeerVideoplayer.initUI('ima');
                    adContainer.style.display = 'block';
                    Logger.log('Event', 'ima:impression');
                    videoElement.dispatchEvent(eventWrapper('ima:impression'));
                });
                adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, function () {
                    StroeerVideoplayer.deinitUI('ima');
                    StroeerVideoplayer.initUI('default');
                    adsLoaded = false;
                    Logger.log('Event', 'ima:ended');
                    videoElement.dispatchEvent(eventWrapper('ima:ended'));
                });
                adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, function () {
                    Logger.log('Event', 'ima:pause');
                    videoElement.dispatchEvent(eventWrapper('ima:pause'));
                });
                adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, function () {
                    Logger.log('Event', 'ima:click');
                    videoElement.dispatchEvent(eventWrapper('ima:click'));
                });
                adsManager.addEventListener(google.ima.AdEvent.Type.FIRST_QUARTILE, function () {
                    Logger.log('Event', 'ima:firstQuartile');
                    videoElement.dispatchEvent(eventWrapper('ima:firstQuartile'));
                });
                adsManager.addEventListener(google.ima.AdEvent.Type.MIDPOINT, function () {
                    Logger.log('Event', 'ima:midpoint');
                    videoElement.dispatchEvent(eventWrapper('ima:midpoint'));
                });
                adsManager.addEventListener(google.ima.AdEvent.Type.THIRD_QUARTILE, function () {
                    Logger.log('Event', 'ima:thirdQuartile');
                    videoElement.dispatchEvent(eventWrapper('ima:thirdQuartile'));
                });
            }, { passive: false });
            adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (adErrorEvent) {
                console.log('>>> ads loader error');
                if (adsManager) {
                    adsManager.destroy();
                }
                var error = adErrorEvent.getError();
                videoElement.dispatchEvent(eventWrapper('ima:error', {
                    errorCode: error.getVastErrorCode(),
                    errorMessage: error.getMessage()
                }));
                Logger.log('Event', 'ima:error', {
                    errorCode: error.getVastErrorCode(),
                    errorMessage: error.getMessage()
                });
            });
            // Let the AdsLoader know when the video has ended
            videoElement.addEventListener('contentVideoEnded', function () {
                adsLoader.contentComplete();
            });
            var adsRequest = new google.ima.AdsRequest();
            adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
                'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
                'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
                'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';
            // videoElement.getAttribute('data-ivad-preroll-adtag')
            // Specify the linear and nonlinear slot sizes. This helps the SDK to
            // select the correct creative if multiple are returned.
            adsRequest.linearAdSlotWidth = videoElement.clientWidth;
            adsRequest.linearAdSlotHeight = videoElement.clientHeight;
            adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
            adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;
            // Pass the request to the adsLoader to request ads
            console.log('>>> request ads');
            adsLoader.requestAds(adsRequest);
            videoElementWidth = videoElement.clientWidth;
            videoElementHeight = videoElement.clientHeight;
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
                        console.log('>>> play video with new adtag');
                        if (adsLoaded) {
                            return;
                        }
                        adsLoaded = true;
                        // videoElement.pause() // TODO: needed??
                        videoElement.dispatchEvent(new CustomEvent('ima:adcall'));
                        event.preventDefault();
                        // Initialize the container. Must be done via a user action on mobile devices.
                        adDisplayContainer.initialize();
                        try {
                            adsManager.init(videoElementWidth, videoElementHeight, google.ima.ViewMode.NORMAL);
                            adsManager.start();
                            console.log('>>> ad start');
                        }
                        catch (adError) {
                            // play the video without the ads
                            console.log('AdsManager could not be started', adError);
                            // eslint-disable-next-line
                            videoElement.play();
                        }
                    }
                }
            };
            _this.onVideoElContentVideoEnded = function () {
                videoElement.addEventListener('play', _this.onVideoElPlay);
            };
            videoElement.addEventListener('play', _this.onVideoElPlay);
            videoElement.addEventListener('contentVideoEnded', _this.onVideoElContentVideoEnded);
            /*
            videoElement.addEventListener('uiima:mute', () => {
              console.log('>>>> IMA MUTE')
              if (adsManager) {
                adsManager.setVolume(0)
              }
            })
            videoElement.addEventListener('uiima:unmute', () => {
              console.log('>>>> IMA UNMUTE')
              if (adsManager) {
                adsManager.setVolume(1)
              }
            })
            videoElement.addEventListener('uiima:play', () => {
              console.log('>>>> IMA PLAY')
              if (adsManager) {
                adsManager.resume()
              }
            })
            videoElement.addEventListener('uiima:pause', () => {
              console.log('>>>> IMA PAUSE')
              if (adsManager) {
                adsManager.pause()
              }
            })
            videoElement.addEventListener('uiima:resume', () => {
              console.log('>>>> IMA RESUME')
              if (adsManager) {
                adsManager.resume()
              }
            })
        
            // fullscreen listener ?
            */
        };
        this.deinit = function (StroeerVideoplayer) {
            var videoElement = StroeerVideoplayer.getVideoEl();
            videoElement.removeEventListener('loadedmetadata', _this.initIMA());
            videoElement.removeEventListener('play', _this.onVideoElPlay);
            videoElement.removeEventListener('contentVideoEnded', _this.onVideoElContentVideoEnded);
            // remove uiima listener
        };
        this.initIMA = noop;
        this.requestAds = noop;
        this.onVideoElPlay = noop;
        this.onVideoElContentVideoEnded = noop;
        return this;
    }
    Plugin.version = version;
    Plugin.pluginName = 'ima';
    return Plugin;
}());

export default Plugin;
//# sourceMappingURL=stroeerVideoplayer-ima-plugin.esm.js.map
