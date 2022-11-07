/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { version } from '../package.json'
import './ima.scss'
import noop from './noop'
import eventWrapper from './eventWrapper'
import logger from './logger'
import { IStroeerVideoplayer } from '../types/types'
import { createUI } from './imaUI'
import * as utils from './utils'
import {
  convertLocalStorageIntegerToBoolean, convertLocalStorageStringToNumber,
  dispatchEvent, hideElement, showElement, setTimeDisp, isTouchDevice,
  calculateVolumePercentageBasedOnYCoords
} from './utils'

declare const google: any

class Plugin {
  public static version: string = version
  public static pluginName: string = 'ima'

  onVideoElPlay: Function
  onVideoElContentVideoEnded: Function
  onDocumentFullscreenChange: Function
  onDrag: EventListener
  onDragStart: EventListener
  onDragEnd: EventListener
  assignEvent: Function
  toggleControlBarInterval: ReturnType<typeof setInterval>
  toggleVolumeBarInterval: ReturnType<typeof setInterval>
  isMuted: boolean
  volume: number

  constructor () {
    this.onVideoElPlay = noop
    this.onVideoElContentVideoEnded = noop
    this.onDocumentFullscreenChange = noop
    this.onDrag = noop
    this.onDragStart = noop
    this.onDragEnd = noop
    this.assignEvent = noop
    this.toggleControlBarInterval = setInterval(noop, 1000)
    this.toggleVolumeBarInterval = setInterval(noop, 1000)
    this.isMuted = false
    this.volume = 0

    return this
  }

  init = (StroeerVideoplayer: IStroeerVideoplayer, opts?: any): void => {
    opts = opts ?? {}
    const videoElement = StroeerVideoplayer.getVideoEl()

    // load sdk first
    const promise = utils.loadScript('//imasdk.googleapis.com/js/sdkloader/ima3.js')
    promise
      .then(() => {
        this.requestAds(StroeerVideoplayer)
      })
      .catch(() => {
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

  requestAds = (StroeerVideoplayer: IStroeerVideoplayer): void => {
    const videoElement = StroeerVideoplayer.getVideoEl()
    const rootElement = StroeerVideoplayer.getRootEl()

    this.isMuted = convertLocalStorageIntegerToBoolean('StroeerVideoplayerMuted')
    this.volume = convertLocalStorageStringToNumber('StroeerVideoplayerVolume')

    createUI(videoElement, this.isMuted, utils.isAlreadyInFullscreenMode(rootElement, videoElement))

    const adContainer = document.querySelector('.ima-ad-container') as HTMLElement
    const loadingSpinnerContainer = adContainer?.querySelector('.loading-spinner') as HTMLElement
    const controlbarContainer = adContainer?.querySelector('.controlbar-container') as HTMLElement
    const playButton = adContainer?.querySelector('.buttons .play') as HTMLElement
    const pauseButton = adContainer?.querySelector('.buttons .pause') as HTMLElement
    const muteButton = adContainer?.querySelector('.buttons .mute') as HTMLElement
    const unmuteButton = adContainer?.querySelector('.buttons .unmute') as HTMLElement
    const timeDisp = adContainer?.querySelector('.controlbar .time') as HTMLElement
    const enterFullscreenButton = adContainer?.querySelector('.buttons .enterFullscreen') as HTMLElement
    const exitFullscreenButton = adContainer?.querySelector('.buttons .exitFullscreen') as HTMLElement

    const volumeContainer = adContainer?.querySelector('.volume-container') as HTMLElement
    const volumeRange = volumeContainer?.querySelector('.volume-range') as HTMLElement
    const volumeLevel = volumeContainer?.querySelector('.volume-level') as HTMLElement
    const volumeLevelBubble = volumeContainer?.querySelector('.volume-level-bubble') as HTMLElement

    const toggleControlbarInSeconds = 5
    let toggleControlbarSecondsLeft = toggleControlbarInSeconds
    const toggleControlbarTicker = (): void => {
      if (toggleControlbarSecondsLeft === 0) {
        controlbarContainer.style.opacity = '0'
      } else {
        toggleControlbarSecondsLeft = toggleControlbarSecondsLeft - 1
      }
    }

    const showLoading = (modus: boolean): void => {
      if (modus) {
        showElement(loadingSpinnerContainer)
      } else {
        hideElement(loadingSpinnerContainer)
      }
    }

    showLoading(true)

    rootElement.addEventListener('mousemove', () => {
      toggleControlbarSecondsLeft = toggleControlbarInSeconds
      controlbarContainer.style.opacity = '1'
    })

    clearInterval(this.toggleControlBarInterval)
    this.toggleControlBarInterval = setInterval(toggleControlbarTicker, 1000)

    const toggleVolumeSliderInSeconds = 2
    let toggleVolumeSliderSecondsLeft = toggleVolumeSliderInSeconds
    const toggleVolumeSliderTicker = (): void => {
      if (toggleVolumeSliderSecondsLeft === 0) {
        volumeContainer.style.opacity = '0'
      } else {
        toggleVolumeSliderSecondsLeft = toggleVolumeSliderSecondsLeft - 1
      }
    }

    const volumeHeight = String((this.volume * 100).toFixed(2)) + '%'
    volumeLevel.style.height = volumeHeight
    volumeLevelBubble.style.bottom = 'calc(' + volumeHeight + ' - 4px)'

    volumeContainer.addEventListener('mousemove', () => {
      toggleVolumeSliderSecondsLeft = toggleVolumeSliderInSeconds
    })

    clearInterval(this.toggleVolumeBarInterval)
    this.toggleVolumeBarInterval = setInterval(toggleVolumeSliderTicker, 1000)

    window.addEventListener('resize', (event) => {
      adsManager?.resize(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL)
    })

    playButton.addEventListener('click', () => {
      adsManager?.resume()
    })

    pauseButton.addEventListener('click', () => {
      adsManager?.pause()
    })

    muteButton.addEventListener('click', () => {
      if (adsManager) {
        this.volume = adsManager.getVolume() || this.volume
        this.isMuted = true
        adsManager.setVolume(0)
        hideElement(muteButton)
        showElement(unmuteButton)
      }
    })

    unmuteButton.addEventListener('click', () => {
      if (adsManager) {
        adsManager.setVolume(this.volume)
        this.isMuted = false
        hideElement(unmuteButton)
        showElement(muteButton)
      }
    })

    muteButton.addEventListener('mouseover', () => {
      if (!isTouchDevice()) {
        volumeContainer.style.opacity = '1'
        toggleVolumeSliderSecondsLeft = toggleVolumeSliderInSeconds
      }
    })

    unmuteButton.addEventListener('mouseover', () => {
      if (!isTouchDevice()) {
        volumeContainer.style.opacity = '1'
        toggleVolumeSliderSecondsLeft = toggleVolumeSliderInSeconds
      }
    })

    enterFullscreenButton.addEventListener('click', () => {
      if (adsManager) {
        dispatchEvent(videoElement, 'UIEnterFullscreen', adsManager.getRemainingTime())
        dispatchEvent(videoElement, 'uiima:enterFullscreen', adsManager.getRemainingTime())
        adsManager.resize(window.innerWidth, window.innerHeight, google.ima.ViewMode.FULLSCREEN)

        if (typeof rootElement.requestFullscreen === 'function') {
          rootElement.requestFullscreen()
        } else if (typeof rootElement.webkitRequestFullscreen === 'function') {
          if (navigator.userAgent.includes('iPad')) {
            videoElement.webkitRequestFullscreen()
          } else {
            rootElement.webkitRequestFullscreen()
          }
        } else if (typeof rootElement.mozRequestFullScreen === 'function') {
          rootElement.mozRequestFullScreen()
        } else if (typeof rootElement.msRequestFullscreen === 'function') {
          rootElement.msRequestFullscreen()
        } else if (typeof rootElement.webkitEnterFullscreen === 'function') {
          rootElement.webkitEnterFullscreen()
        } else if (typeof videoElement.webkitEnterFullscreen === 'function') {
          videoElement.webkitEnterFullscreen()
        } else {
          console.log('Error trying to enter Fullscreen mode: No Request Fullscreen Function found')
        }
      }
    })

    exitFullscreenButton.addEventListener('click', () => {
      if (adsManager) {
        dispatchEvent(videoElement, 'UIExitFullscreen', adsManager.getRemainingTime())
        dispatchEvent(videoElement, 'uiima:exitFullscreen', adsManager.getRemainingTime())

        if (typeof document.exitFullscreen === 'function') {
          document.exitFullscreen().then(noop).catch(noop)
        } else if (typeof document.webkitExitFullscreen === 'function') {
          document.webkitExitFullscreen()
        } else if (typeof document.mozCancelFullScreen === 'function') {
          document.mozCancelFullScreen().then(noop).catch(noop)
        } else if (typeof document.msExitFullscreen === 'function') {
          document.msExitFullscreen()
        } else if (typeof videoElement.webkitExitFullscreen === 'function') {
          videoElement.webkitExitFullscreen()
        } else {
          console.log('Error trying to enter Fullscreen mode: No Request Fullscreen Function found')
        }

        adsManager.resize(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL)
      }
    })

    this.onDocumentFullscreenChange = () => {
      if (document.fullscreenElement === rootElement || document.fullscreenElement === videoElement) {
        videoElement.dispatchEvent(new Event('fullscreen'))
        hideElement(enterFullscreenButton)
        showElement(exitFullscreenButton)
      } else {
        videoElement.dispatchEvent(new Event('exitFullscreen'))
        showElement(enterFullscreenButton)
        hideElement(exitFullscreenButton)
      }
    }

    // @ts-expect-error
    document.addEventListener('fullscreenchange', this.onDocumentFullscreenChange)

    // iOS Workarounds
    videoElement.addEventListener('webkitendfullscreen', function () {
      // @ts-expect-error
      document.fullscreenElement = null
      showElement(enterFullscreenButton)
      hideElement(exitFullscreenButton)
    })

    document.addEventListener('webkitfullscreenchange', function () {
      if (document.webkitFullscreenElement !== null) {
        showElement(exitFullscreenButton)
        hideElement(enterFullscreenButton)
      } else {
        showElement(enterFullscreenButton)
        hideElement(exitFullscreenButton)
      }
    })

    // IE11 workaround
    document.addEventListener('MSFullscreenChange', function () {
      if (document.msFullscreenElement !== null) {
        showElement(exitFullscreenButton)
        hideElement(enterFullscreenButton)
      } else {
        hideElement(exitFullscreenButton)
        showElement(enterFullscreenButton)
      }
    })

    const updateVolumeWhileDragging = (evt: any): void => {
      if (evt.target === volumeContainer ||
          evt.target === volumeLevel ||
          evt.target === volumeLevelBubble ||
          evt.target === volumeRange
      ) {
        let clientY = evt.clientY
        if (clientY === undefined) {
          if ('touches' in evt && evt.touches.length > 0) {
            clientY = evt.touches[0].clientY
          } else {
            clientY = false
          }
        }
        if (clientY === false) return
        const volumeRangeBoundingClientRect: any = volumeRange.getBoundingClientRect()
        let volumeContainerOffsetY = 0
        if ('y' in volumeRangeBoundingClientRect) {
          volumeContainerOffsetY = volumeRangeBoundingClientRect.y
        } else {
          volumeContainerOffsetY = volumeRangeBoundingClientRect.top
        }

        let y = clientY - volumeContainerOffsetY
        if (y < 0) {
          y = 0
        }
        if (y > volumeRangeBoundingClientRect.height) {
          y = volumeRangeBoundingClientRect.height
        }
        const percentageY = calculateVolumePercentageBasedOnYCoords(y, volumeRange.offsetHeight)
        const percentageHeight = 100 - percentageY
        const percentageHeightString = String(percentageHeight)
        const percentageYString = String(percentageY)
        volumeLevel.style.height = percentageHeightString + '%'
        if (percentageY < 90) {
          volumeLevelBubble.style.top = percentageYString + '%'
        }
        const volume = percentageHeight / 100
        this.volume = volume
        window.localStorage.setItem('StroeerVideoplayerVolume', this.volume.toFixed(2))
        if (!this.isMuted) {
          adsManager.setVolume(volume)
        }
      }
    }

    let draggingWhat = ''

    this.onDragStart = (evt: any): void => {
      switch (evt.target) {
        case volumeRange:
        case volumeLevel:
        case volumeLevelBubble:
          dispatchEvent(videoElement, 'UIVolumeChangeStart', {
            volume: adsManager.getVolume(),
            currentTime: adsManager.getRemainingTime()
          })
          dispatchEvent(videoElement, 'uiima:volumeChangeStart', {
            volume: adsManager.getVolume(),
            currentTime: adsManager.getRemainingTime()
          })
          draggingWhat = 'volume'
          break
        default:
          break
      }
    }

    this.onDragEnd = (evt: any): void => {
      if (draggingWhat === 'volume') {
        draggingWhat = ''
        updateVolumeWhileDragging(evt)
        dispatchEvent(videoElement, 'UIVolumeChangeEnd', {
          volume: adsManager.getVolume(),
          currentTime: adsManager.getRemainingTime()
        })
        dispatchEvent(videoElement, 'uiima:volumeChangeEnd', {
          volume: adsManager.getVolume(),
          currentTime: adsManager.getRemainingTime()
        })
      }
    }

    this.onDrag = (evt: any): void => {
      if (draggingWhat === 'volume') {
        updateVolumeWhileDragging(evt)
      }
    }

    document.body.addEventListener('touchstart', this.onDragStart, { passive: true })
    document.body.addEventListener('touchend', this.onDragEnd, { passive: true })
    document.body.addEventListener('touchmove', this.onDrag, { passive: true })
    document.body.addEventListener('mousedown', this.onDragStart, { passive: true })
    document.body.addEventListener('mouseup', this.onDragEnd, { passive: true })
    document.body.addEventListener('mousemove', this.onDrag, { passive: true })

    // ima settings

    google.ima.settings.setNumRedirects(10)
    google.ima.settings.setLocale('de')

    let adsManager: any

    const adDisplayContainer = new google.ima.AdDisplayContainer(adContainer)
    const adsLoader = new google.ima.AdsLoader(adDisplayContainer)

    this.assignEvent = (event: Event) => {
      switch (event.type) {
        case google.ima.AdEvent.Type.AD_CAN_PLAY:
          showLoading(false)
          break
        case google.ima.AdEvent.Type.AD_BUFFERING:
          showLoading(true)
          break
        case google.ima.AdEvent.Type.AD_METADATA:
          setTimeDisp(timeDisp, adsManager.getRemainingTime())
          break
        case google.ima.AdEvent.Type.AD_PROGRESS:
          // showLoading(false)
          setTimeDisp(timeDisp, adsManager.getRemainingTime())
          break
        case google.ima.AdEvent.Type.STARTED:
          adContainer.style.display = 'block'
          hideElement(playButton)
          showElement(pauseButton)

          if (this.isMuted) {
            adsManager.setVolume(0)
            hideElement(muteButton)
            showElement(unmuteButton)
          } else {
            adsManager.setVolume(this.volume)
            showElement(muteButton)
            hideElement(unmuteButton)
          }

          logger.log('Event', 'ima:impression')
          videoElement.dispatchEvent(eventWrapper('ima:impression'))
          dispatchEvent(videoElement, 'UIPlay', adsManager.getRemainingTime())
          dispatchEvent(videoElement, 'uiima:play', adsManager.getRemainingTime())
          break
        case google.ima.AdEvent.Type.RESUMED:
          hideElement(playButton)
          showElement(pauseButton)
          dispatchEvent(videoElement, 'uiima:resume', adsManager.getRemainingTime())
          break
        case google.ima.AdEvent.Type.SKIPPED:
        case google.ima.AdEvent.Type.COMPLETE:
          adContainer.style.display = 'none'

          logger.log('Event', 'ima:ended')
          videoElement.dispatchEvent(eventWrapper('ima:ended'))
          break
        case google.ima.AdEvent.Type.PAUSED:
          showElement(playButton)
          hideElement(pauseButton)

          logger.log('Event', 'ima:pause')
          videoElement.dispatchEvent(eventWrapper('ima:pause'))
          dispatchEvent(videoElement, 'UIPause', adsManager.getRemainingTime())
          dispatchEvent(videoElement, 'uiima:pause', adsManager.getRemainingTime())
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
        case google.ima.AdEvent.Type.VOLUME_CHANGED:
          if (!this.isMuted) {
            this.volume = adsManager.getVolume()
            window.localStorage.setItem('StroeerVideoplayerVolume', this.volume.toFixed(2))
            dispatchEvent(videoElement, 'UIUnmute', adsManager.getRemainingTime())
            dispatchEvent(videoElement, 'uiima:unmute', adsManager.getRemainingTime())
          }
          window.localStorage.setItem('StroeerVideoplayerMuted', this.isMuted ? '1' : '0')
          break
        case google.ima.AdEvent.Type.VOLUME_MUTED:
          window.localStorage.setItem('StroeerVideoplayerMuted', '1')
          dispatchEvent(videoElement, 'UIMute', adsManager.getRemainingTime())
          dispatchEvent(videoElement, 'uiima:mute', adsManager.getRemainingTime())
          break
        case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
          videoElement.pause()
          break
        case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
          videoElement.play()
          break
      }
    }

    adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (adsManagerLoadedEvent: any) => {
        const adsRenderingSettings = new google.ima.AdsRenderingSettings()
        adsRenderingSettings.loadVideoTimeout = -1
        adsRenderingSettings.uiElements = []

        adsManager = adsManagerLoadedEvent.getAdsManager(videoElement, adsRenderingSettings)
        logger.log('IMA AdsManager loaded')

        if (!this.isMuted) {
          adsManager.setVolume(convertLocalStorageStringToNumber('StroeerVideoplayerVolume'))
        } else {
          adsManager.setVolume(convertLocalStorageIntegerToBoolean('StroeerVideoplayerMuted'))
        }

        try {
          adsManager.init(videoElement.clientWidth, videoElement.clientHeight, google.ima.ViewMode.NORMAL)
          adsManager.start()
        } catch (adError) {
          // eslint-disable-next-line
          videoElement.play()
        }

        adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,
          (adErrorEvent: any) => {
            const error = adErrorEvent.getError()
            videoElement.dispatchEvent(eventWrapper('ima:error', {
              errorCode: error.getVastErrorCode(),
              errorMessage: error.getMessage()
            }))
            logger.log('adsManager ', 'ima:error', {
              errorCode: error.getVastErrorCode(),
              errorMessage: error.getMessage()
            })
          })

        const events = [
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
          google.ima.AdEvent.Type.VOLUME_MUTED,
          google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
          google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED
        ]

        events.forEach((event) => {
          adsManager.addEventListener(event, this.assignEvent)
        })
      })

    adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      (adErrorEvent: any) => {
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
        logger.log('adsLoader ', 'ima:error', {
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

          adsRequest.omidAccessModeRules = {}
          adsRequest.omidAccessModeRules[google.ima.OmidVerificationVendor.GOOGLE] = google.ima.OmidAccessMode.FULL

          // Specify the linear and nonlinear slot sizes. This helps the SDK to
          // select the correct creative if multiple are returned.
          adsRequest.linearAdSlotWidth = videoElement.clientWidth
          adsRequest.linearAdSlotHeight = videoElement.clientHeight
          adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth
          adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3

          // Pass the request to the adsLoader to request ads
          adsLoader.requestAds(adsRequest)

          // TODO: Initialize the container Must be done via a user action on mobile devices.
          adDisplayContainer.initialize()
        }
      }
    }

    this.onVideoElContentVideoEnded = () => {
      videoElement.addEventListener('play', this.onVideoElPlay)
    }
    videoElement.addEventListener('contentVideoEnded', () => {
      this.onVideoElContentVideoEnded()
    })
    videoElement.addEventListener('play', this.onVideoElPlay)
  }

  deinit = (StroeerVideoplayer: IStroeerVideoplayer): void => {
    const videoElement = StroeerVideoplayer.getVideoEl()
    videoElement.removeEventListener('play', this.onVideoElPlay)
    videoElement.removeEventListener('contentVideoEnded', this.onVideoElContentVideoEnded)
  }
}

export default Plugin
