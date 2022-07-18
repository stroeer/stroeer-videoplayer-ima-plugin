/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { version } from '../package.json'
import noop from './noop'
import eventWrapper from './eventWrapper'
import logger from './logger'
import './ima.scss'

interface IStroeerVideoplayer {
  getUIEl: Function
  getRootEl: Function
  getVideoEl: Function
  getUIName: Function
  initUI: Function
  deinitUI: Function
  getHls: Function
}

class Plugin {
  public static version: string = version
  public static pluginName: string = 'ima'

  initIMA: Function
  requestAds: Function
  onVideoElPlay: Function
  onVideoElContentVideoEnded: Function

  constructor () {
    this.initIMA = noop
    this.requestAds = noop
    this.onVideoElPlay = noop
    this.onVideoElContentVideoEnded = noop

    return this
  }

  init = (StroeerVideoplayer: IStroeerVideoplayer, opts?: any): void => {
    opts = opts ?? {}
    opts.numRedirects = opts.numRedirects ?? 10
    opts.timeout = opts.timeout ?? 5000
    opts.adLabel = opts.adLabel ?? 'Advertisment ends in {{seconds}} seconds'

    const videoElement = StroeerVideoplayer.getVideoEl()
    let videoElementWidth = videoElement.clientWidth
    let videoElementHeight = videoElement.clientHeight
    const adContainer = document.createElement('div')
    adContainer.classList.add('ad-container')
    videoElement.after(adContainer)

    let adsLoaded: boolean = false
    let adsManager: any

    const adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement)
    const adsLoader = new google.ima.AdsLoader(adDisplayContainer)

    window.addEventListener('resize', (event) => {
      if (adsManager) {
        const width = videoElement.clientWidth
        const height = videoElement.clientHeight
        adsManager.resize(width, height, google.ima.ViewMode.NORMAL)
      }
    })

    adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (adsManagerLoadedEvent: google.ima.AdsManagerLoadedEvent) => {
        console.log('ads manager loaded')
        const adsRenderingSettings = new google.ima.AdsRenderingSettings()
        adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = false
        adsRenderingSettings.enablePreloading = false
        adsManager = adsManagerLoadedEvent.getAdsManager(videoElement)

        adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,
          (adErrorEvent: google.ima.AdErrorEvent) => {
            const error = adErrorEvent.getError()
            videoElement.dispatchEvent(eventWrapper('ima:error', {
              errorCode: error.getVastErrorCode(),
              errorMessage: error.getMessage()
            }))
            logger.log('Event', 'ima:error', {
              errorCode: error.getVastErrorCode(),
              errorMessage: error.getMessage()
            })
          })
        adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, () => {
          videoElement.pause()
        })
        adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, () => {
          console.log('>>>> resume')
          videoElement.play()
          adContainer.style.display = 'none'
        })
        adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
          logger.log('>>> all ads complete')
        })

        adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, () => {
          logger.log('>>> ad loaded')
        })
        adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, () => {
          StroeerVideoplayer.deinitUI('default')
          StroeerVideoplayer.initUI('ima')
          adContainer.style.display = 'block'
          logger.log('Event', 'ima:impression')
          videoElement.dispatchEvent(eventWrapper('ima:impression'))
        })
        adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, () => {
          StroeerVideoplayer.deinitUI('ima')
          StroeerVideoplayer.initUI('default')
          adsLoaded = false
          logger.log('Event', 'ima:ended')
          videoElement.dispatchEvent(eventWrapper('ima:ended'))
        })

        adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, () => {
          logger.log('Event', 'ima:pause')
          videoElement.dispatchEvent(eventWrapper('ima:pause'))
        })
        adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, () => {
          logger.log('Event', 'ima:click')
          videoElement.dispatchEvent(eventWrapper('ima:click'))
        })
        adsManager.addEventListener(google.ima.AdEvent.Type.FIRST_QUARTILE, () => {
          logger.log('Event', 'ima:firstQuartile')
          videoElement.dispatchEvent(eventWrapper('ima:firstQuartile'))
        })
        adsManager.addEventListener(google.ima.AdEvent.Type.MIDPOINT, () => {
          logger.log('Event', 'ima:midpoint')
          videoElement.dispatchEvent(eventWrapper('ima:midpoint'))
        })
        adsManager.addEventListener(google.ima.AdEvent.Type.THIRD_QUARTILE, () => {
          logger.log('Event', 'ima:thirdQuartile')
          videoElement.dispatchEvent(eventWrapper('ima:thirdQuartile'))
        })
      }, { passive: false })

    adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      (adErrorEvent: google.ima.AdErrorEvent) => {
        console.log('>>> ads loader error')
        if (adsManager) {
          adsManager.destroy()
        }
        const error = adErrorEvent.getError()
        videoElement.dispatchEvent(eventWrapper('ima:error', {
          errorCode: error.getVastErrorCode(),
          errorMessage: error.getMessage()
        }))
        logger.log('Event', 'ima:error', {
          errorCode: error.getVastErrorCode(),
          errorMessage: error.getMessage()
        })
      })

    // Let the AdsLoader know when the video has ended
    videoElement.addEventListener('contentVideoEnded', () => {
      adsLoader.contentComplete()
    })

    const adsRequest = new google.ima.AdsRequest()
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
    'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
    'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
    'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator='

    // videoElement.getAttribute('data-ivad-preroll-adtag')

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = videoElement.clientWidth
    adsRequest.linearAdSlotHeight = videoElement.clientHeight
    adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth
    adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3

    // Pass the request to the adsLoader to request ads
    console.log('>>> request ads')
    adsLoader.requestAds(adsRequest)

    videoElementWidth = videoElement.clientWidth
    videoElementHeight = videoElement.clientHeight

    this.onVideoElPlay = (event: Event) => {
      const prerollAdTag = videoElement.getAttribute('data-ivad-preroll-adtag')

      if (prerollAdTag !== null) {
        videoElement.removeEventListener('play', this.onVideoElPlay)

        if (prerollAdTag === 'adblocked') {
          videoElement.dispatchEvent(eventWrapper('ima:error', {
            errorCode: 301,
            errorMessage: 'VAST redirect timeout reached'
          }))
          logger.log('event', 'ima:error', {
            errorCode: 301,
            errorMessage: 'VAST redirect timeout reached'
          })
        } else {
          console.log('>>> play video with new adtag')
          if (adsLoaded) {
            return
          }
          adsLoaded = true

          // videoElement.pause() // TODO: needed??
          videoElement.dispatchEvent(new CustomEvent('ima:adcall'))
          event.preventDefault()
          // Initialize the container. Must be done via a user action on mobile devices.
          adDisplayContainer.initialize()

          try {
            adsManager.init(videoElementWidth, videoElementHeight, google.ima.ViewMode.NORMAL)
            adsManager.start()
            console.log('>>> ad start')
          } catch (adError) {
            // play the video without the ads
            console.log('AdsManager could not be started', adError)
            // eslint-disable-next-line
            videoElement.play()
          }
        }
      }
    }

    this.onVideoElContentVideoEnded = () => {
      videoElement.addEventListener('play', this.onVideoElPlay)
    }

    videoElement.addEventListener('play', this.onVideoElPlay)
    videoElement.addEventListener('contentVideoEnded', this.onVideoElContentVideoEnded)

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
  }

  deinit = (StroeerVideoplayer: IStroeerVideoplayer): void => {
    const videoElement = StroeerVideoplayer.getVideoEl()
    videoElement.removeEventListener('loadedmetadata', this.initIMA())
    videoElement.removeEventListener('play', this.onVideoElPlay)
    videoElement.removeEventListener('contentVideoEnded', this.onVideoElContentVideoEnded)
    // remove uiima listener
  }
}

export default Plugin
