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
                console.log('AdsManager loaded');
                adsManager = adsManagerLoadedEvent.getAdsManager(videoElement);
                try {
                    adsManager.init(videoElementWidth, videoElementHeight, google.ima.ViewMode.NORMAL);
                    adsManager.start();
                    console.log('>>> AdsManager start');
                }
                catch (adError) {
                    // play the video without the ads
                    console.log('AdsManager could not be started', adError);
                    // eslint-disable-next-line
                    videoElement.play();
                }
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
                    videoElement.play();
                });
                var events = [
                    google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
                    google.ima.AdEvent.Type.CLICK,
                    google.ima.AdEvent.Type.VIDEO_CLICKED,
                    google.ima.AdEvent.Type.VIDEO_ICON_CLICKED,
                    google.ima.AdEvent.Type.AD_PROGRESS,
                    google.ima.AdEvent.Type.AD_BUFFERING,
                    google.ima.AdEvent.Type.IMPRESSION,
                    google.ima.AdEvent.Type.DURATION_CHANGE,
                    google.ima.AdEvent.Type.USER_CLOSE,
                    google.ima.AdEvent.Type.LINEAR_CHANGED,
                    google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED,
                    google.ima.AdEvent.Type.AD_METADATA,
                    google.ima.AdEvent.Type.INTERACTION,
                    google.ima.AdEvent.Type.COMPLETE,
                    google.ima.AdEvent.Type.FIRST_QUARTILE,
                    google.ima.AdEvent.Type.LOADED,
                    google.ima.AdEvent.Type.MIDPOINT,
                    google.ima.AdEvent.Type.PAUSED,
                    google.ima.AdEvent.Type.RESUMED,
                    google.ima.AdEvent.Type.USER_CLOSE,
                    google.ima.AdEvent.Type.STARTED,
                    google.ima.AdEvent.Type.THIRD_QUARTILE,
                    google.ima.AdEvent.Type.SKIPPED,
                    google.ima.AdEvent.Type.VOLUME_CHANGED,
                    google.ima.AdEvent.Type.VOLUME_MUTED,
                    google.ima.AdEvent.Type.LOG
                ];
                events.forEach(function (event) {
                    adsManager.addEventListener(event, _this.assignEvent);
                });
            });
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
            _this.assignEvent = function (event) {
                // console.log('>>>> event: ', event.type)
                switch (event.type) {
                    case google.ima.AdEvent.Type.STARTED:
                        StroeerVideoplayer.deinitUI('default');
                        StroeerVideoplayer.initUI('ima', { adsManager: adsManager });
                        adContainer.style.display = 'block';
                        Logger.log('Event', 'ima:impression');
                        videoElement.dispatchEvent(eventWrapper('ima:impression'));
                        break;
                    case google.ima.AdEvent.Type.COMPLETE:
                        StroeerVideoplayer.deinitUI('ima');
                        StroeerVideoplayer.initUI('default');
                        adContainer.style.display = 'none';
                        adsLoaded = false;
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
                        if (adsLoaded) {
                            return;
                        }
                        adsLoaded = true;
                        event.preventDefault();
                        videoElement.pause();
                        videoElement.dispatchEvent(new CustomEvent('ima:adcall'));
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
                        // TODO: Initialize the container Must be done via a user action on mobile devices.
                        adDisplayContainer.initialize();
                    }
                }
            };
            _this.onVideoElContentVideoEnded = function () {
                videoElement.addEventListener('play', _this.onVideoElPlay);
            };
            videoElement.addEventListener('play', _this.onVideoElPlay);
            videoElement.addEventListener('contentVideoEnded', function () {
                // Let the AdsLoader know when the video has ended
                adsLoader.contentComplete();
                _this.onVideoElContentVideoEnded();
            });
        };
        this.deinit = function (StroeerVideoplayer) {
            var videoElement = StroeerVideoplayer.getVideoEl();
            videoElement.removeEventListener('play', _this.onVideoElPlay);
            videoElement.removeEventListener('contentVideoEnded', _this.onVideoElContentVideoEnded);
            // remove uiima listener
        };
        this.onVideoElPlay = noop;
        this.onVideoElContentVideoEnded = noop;
        this.assignEvent = noop;
        return this;
    }
    Plugin.version = version;
    Plugin.pluginName = 'ima';
    return Plugin;
}());

export default Plugin;
//# sourceMappingURL=stroeerVideoplayer-ima-plugin.esm.js.map
