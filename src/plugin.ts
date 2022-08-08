/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { version } from '../package.json'
import noop from './noop'
import eventWrapper from './eventWrapper'
import logger from './logger'
import './ima.scss'
import { IStroeerVideoplayer } from '../types/types'
import { loadScript } from './utils'

class Plugin {
  public static version: string = version
  public static pluginName: string = 'ima'

  onVideoElPlay: Function
  onVideoElContentVideoEnded: Function
  assignEvent: Function

  constructor () {
    this.onVideoElPlay = noop
    this.onVideoElContentVideoEnded = noop
    this.assignEvent = noop

    return this
  }

  init = (StroeerVideoplayer: IStroeerVideoplayer, opts?: any): void => {
    opts = opts ?? {}
    const videoElement = StroeerVideoplayer.getVideoEl()

    // load sdk first
    const promise = loadScript('//imasdk.googleapis.com/js/sdkloader/ima3.js')
    promise
      .then(() => {
        this.load(StroeerVideoplayer)
      })
      .catch((error) => {
        videoElement.dispatchEvent(eventWrapper('ima:error', {
          errorCode: 301,
          errorMessage: 'IMA could not be loaded'
        }))
        logger.log('event', 'ima:error', {
          errorCode: 301,
          errorMessage: 'IMA could not be loaded'
        })
      })
  }

  load = (StroeerVideoplayer: IStroeerVideoplayer): void => {
    const videoElement = StroeerVideoplayer.getVideoEl()
    let videoElementWidth = videoElement.clientWidth
    let videoElementHeight = videoElement.clientHeight

    const adContainer = document.createElement('div')
    adContainer.classList.add('ad-container')
    videoElement.after(adContainer)

    let adsManager: any

    const adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement)
    const adsLoader = new google.ima.AdsLoader(adDisplayContainer)

    window.addEventListener('resize', (event) => {
      if (adsManager) {
        adsManager.resize(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL)
      }
    })

    this.assignEvent = (event: Event) => {
      switch (event.type) {
        case google.ima.AdEvent.Type.STARTED:
          StroeerVideoplayer.deinitUI('default')
          StroeerVideoplayer.initUI('ima', { adsManager: adsManager })
          adContainer.style.display = 'block'
          logger.log('Event', 'ima:impression')
          videoElement.dispatchEvent(eventWrapper('ima:impression'))
          break
        case google.ima.AdEvent.Type.COMPLETE:
          StroeerVideoplayer.deinitUI('ima', { adsManager: adsManager })
          StroeerVideoplayer.initUI('default')
          adContainer.style.display = 'none'
          logger.log('Event', 'ima:ended')
          videoElement.dispatchEvent(eventWrapper('ima:ended'))
          break
        case google.ima.AdEvent.Type.PAUSED:
          logger.log('Event', 'ima:pause')
          videoElement.dispatchEvent(eventWrapper('ima:pause'))
          break
        case google.ima.AdEvent.Type.CLICK:
          logger.log('Event', 'ima:click')
          videoElement.dispatchEvent(eventWrapper('ima:click'))
          break
        case google.ima.AdEvent.Type.FIRST_QUARTILE:
          logger.log('Event', 'ima:firstQuartile')
          videoElement.dispatchEvent(eventWrapper('ima:firstQuartile'))
          break
        case google.ima.AdEvent.Type.MIDPOINT:
          logger.log('Event', 'ima:midpoint')
          videoElement.dispatchEvent(eventWrapper('ima:midpoint'))
          break
        case google.ima.AdEvent.Type.THIRD_QUARTILE:
          logger.log('Event', 'ima:thirdQuartile')
          videoElement.dispatchEvent(eventWrapper('ima:thirdQuartile'))
          break
      }
    }

    adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (adsManagerLoadedEvent: google.ima.AdsManagerLoadedEvent) => {
        adsManager = adsManagerLoadedEvent.getAdsManager(videoElement)

        console.log('AdsManager loaded')

        try {
          adsManager.init(videoElementWidth, videoElementHeight, google.ima.ViewMode.NORMAL)
          adsManager.start()
        } catch (adError) {
          // eslint-disable-next-line
          videoElement.play()
        }

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
        })

        const events = [
          google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
          google.ima.AdEvent.Type.CLICK,
          google.ima.AdEvent.Type.AD_PROGRESS,
          google.ima.AdEvent.Type.AD_BUFFERING,
          google.ima.AdEvent.Type.IMPRESSION,
          google.ima.AdEvent.Type.DURATION_CHANGE,
          google.ima.AdEvent.Type.USER_CLOSE,
          google.ima.AdEvent.Type.LINEAR_CHANGED,
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
        ]

        events.forEach((event) => {
          adsManager.addEventListener(event, this.assignEvent)
        })
      })

    adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      (adErrorEvent: google.ima.AdErrorEvent) => {
        console.log('AdsManager error')
        if (adsManager) {
          adsManager.destroy()
        }
        // eslint-disable-next-line
        videoElement.play()

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
          event.preventDefault()
          videoElement.pause()
          videoElement.dispatchEvent(new CustomEvent('ima:adcall'))

          if (adsManager) {
            adsManager.destroy()
          }

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

          // TODO: Initialize the container Must be done via a user action on mobile devices.
          adDisplayContainer.initialize()
        }
      }
    }

    this.onVideoElContentVideoEnded = () => {
      videoElement.addEventListener('play', this.onVideoElPlay)
    }

    videoElement.addEventListener('play', this.onVideoElPlay)
    videoElement.addEventListener('contentVideoEnded', () => {
      adsLoader.contentComplete()
      this.onVideoElContentVideoEnded()
    })
  }

  deinit = (StroeerVideoplayer: IStroeerVideoplayer): void => {
    const videoElement = StroeerVideoplayer.getVideoEl()
    videoElement.removeEventListener('play', this.onVideoElPlay)
    videoElement.removeEventListener('contentVideoEnded', this.onVideoElContentVideoEnded)
  }
}

export default Plugin
