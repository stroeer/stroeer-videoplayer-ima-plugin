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

    let adActive: boolean = false
    let adsManager: any
    let adDisplayContainer: any
    let adsLoader: any

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
          videoElement.pause()
          videoElement.dispatchEvent(new CustomEvent('ima:adcall'))
          event.preventDefault()

          // Initialize the container. Must be done via a user action on mobile devices.
          videoElement.load()
          adDisplayContainer.initialize()
          console.log('>>> init')

          try {
            adsManager.init(videoElementWidth, videoElementHeight, google.ima.ViewMode.NORMAL)
            adsManager.start()
            console.log('>>> start')
          } catch (adError) {
            // play the video without the ads
            console.log('AdsManager could not be started', adError)
            // eslint-disable-next-line
            videoElement.play()
          }
        }
      }
    }

    this.requestAds = (): void => {
      const adsRequest = new google.ima.AdsRequest()
      adsRequest.adTagUrl = videoElement.getAttribute('data-ivad-preroll-adtag')

      // Specify the linear and nonlinear slot sizes. This helps the SDK to
      // select the correct creative if multiple are returned.
      adsRequest.linearAdSlotWidth = videoElement.clientWidth
      adsRequest.linearAdSlotHeight = videoElement.clientHeight
      adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth
      adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3

      // Pass the request to the adsLoader to request ads
      adsLoader.requestAds(adsRequest)

      videoElementWidth = videoElement.clientWidth
      videoElementHeight = videoElement.clientHeight
    }

    this.initIMA = (): void => {
      adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement)
      adsLoader = new google.ima.AdsLoader(adDisplayContainer)
      adsManager = null

      window.addEventListener('resize', (event) => {
        console.log('window resized', adsManager)
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (adsManager) {
          const width = videoElement.clientWidth
          const height = videoElement.clientHeight
          adsManager.resize(width, height, google.ima.ViewMode.NORMAL)
        }
      })

      console.log('Add loaded listener')
      adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        (adsManagerLoadedEvent: google.ima.AdsManagerLoadedEvent) => {
          console.log('ads manager loaded')
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
            // StroeerVideoplayer.initUI('ima')
            adContainer.style.display = 'block'
            logger.log('Event', 'ima:impression')
            videoElement.dispatchEvent(eventWrapper('ima:impression'))
          })
          adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, () => {
            // StroeerVideoplayer.deinitUI('ima')
            StroeerVideoplayer.initUI('default')
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
        })

      adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        (adErrorEvent: google.ima.AdErrorEvent) => {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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

      console.log('>>> request ads')
      this.requestAds()
    }

    this.onVideoElContentVideoEnded = () => {
      videoElement.addEventListener('play', this.onVideoElPlay)
    }

    videoElement.addEventListener('play', this.onVideoElPlay)
    videoElement.addEventListener('contentVideoEnded', this.onVideoElContentVideoEnded)
    videoElement.addEventListener('loadedmetadata', this.initIMA())
  }

  deinit = (StroeerVideoplayer: IStroeerVideoplayer): void => {
    const videoElement = StroeerVideoplayer.getVideoEl()
    videoElement.removeEventListener('play', this.onVideoElPlay)
    videoElement.removeEventListener('contentVideoEnded', this.onVideoElContentVideoEnded)
  }
}

export default Plugin
