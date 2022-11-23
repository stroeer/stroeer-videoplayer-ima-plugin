/* eslint-disable @typescript-eslint/no-floating-promises */
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

  videoElement: HTMLVideoElement
  rootElement: HTMLElement
  adContainer: HTMLElement
  onDocumentFullscreenChange: Function
  onDrag: EventListener
  onDragStart: EventListener
  onDragEnd: EventListener
  assignEvent: Function
  toggleControlBarInterval: ReturnType<typeof setInterval>
  toggleVolumeBarInterval: ReturnType<typeof setInterval>
  isMuted: boolean
  volume: number
  promise: Promise<unknown>

  constructor () {
    this.videoElement = new HTMLVideoElement()
    this.rootElement = new HTMLElement()
    this.adContainer = new HTMLElement()
    this.onDocumentFullscreenChange = noop
    this.onDrag = noop
    this.onDragStart = noop
    this.onDragEnd = noop
    this.assignEvent = noop
    this.toggleControlBarInterval = setInterval(noop, 1000)
    this.toggleVolumeBarInterval = setInterval(noop, 1000)
    this.isMuted = false
    this.volume = 0
    this.promise = new Promise((resolve, reject) => {})

    return this
  }

  init = (StroeerVideoplayer: IStroeerVideoplayer, opts?: any): void => {
    opts = opts ?? {}
    this.isMuted = convertLocalStorageIntegerToBoolean('StroeerVideoplayerMuted')
    this.volume = convertLocalStorageStringToNumber('StroeerVideoplayerVolume')

    this.videoElement = StroeerVideoplayer.getVideoEl()
    this.rootElement = StroeerVideoplayer.getRootEl()

    this.adContainer = document.createElement('div')
    this.adContainer.classList.add('ima-ad-container')
    this.videoElement.after(this.adContainer)

    const uiContainer = document.createElement('div')
    uiContainer.className = 'ima'
    this.adContainer.appendChild(uiContainer)

    createUI(uiContainer, this.videoElement, this.isMuted, utils.isAlreadyInFullscreenMode(this.rootElement, this.videoElement))

    this.videoElement.addEventListener('contentVideoEnded', this.onVideoElContentVideoEnded)

    this.videoElement.addEventListener('play', this.onVideoElementPlay)

    this.promise = utils.loadScript('//imasdk.googleapis.com/js/sdkloader/ima3.js')
  }

  onVideoElContentVideoEnded = (event: Event): void => {
    this.videoElement.addEventListener('play', this.onVideoElementPlay)
  }

  onVideoElementPlay = (event: Event): void => {
    const prerollAdTag = this.videoElement.getAttribute('data-ivad-preroll-adtag')

    if (prerollAdTag === null) return

    if (prerollAdTag === 'adblocked') {
      this.videoElement.dispatchEvent(eventWrapper('ima:error', {
        errorCode: 301,
        errorMessage: 'VAST redirect timeout reached'
      }))
      logger.log('event', 'ima:error', {
        errorCode: 301,
        errorMessage: 'VAST redirect timeout reached'
      })

      return
    }

    event.preventDefault()
    this.videoElement.removeEventListener('play', this.onVideoElementPlay)

    // show loading spinner

    this.videoElement.pause()

    // check for multiple play events
    this.promise
      .then(() => {
        // only once
        this.createAdManager()
        // call on every play
        this.requestAds()
      })
      .catch(() => {
        this.videoElement.dispatchEvent(eventWrapper('ima:error', {
          errorCode: 301,
          errorMessage: 'IMA could not be loaded'
        }))
        logger.log('event', 'ima:error', {
          errorCode: 301,
          errorMessage: 'IMA could not be loaded'
        })
      })
  }

  createAdManager = (): void => {
    // ima settings
    google.ima.settings.setNumRedirects(10)
    google.ima.settings.setLocale('de')

    const adDisplayContainer = new google.ima.AdDisplayContainer(this.adContainer)
    const adsLoader = new google.ima.AdsLoader(adDisplayContainer)

    adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (adsManagerLoadedEvent: any) => {
        const adsRenderingSettings = new google.ima.AdsRenderingSettings()
        adsRenderingSettings.loadVideoTimeout = -1
        adsRenderingSettings.uiElements = []

        const adsManager = adsManagerLoadedEvent.getAdsManager(this.videoElement, adsRenderingSettings)
        logger.log('IMA AdsManager loaded')

        this.addAdsManagerEvents(adsManager)

        this.addUiFunctions(adsManager)

        if (!this.isMuted) {
          adsManager.setVolume(convertLocalStorageStringToNumber('StroeerVideoplayerVolume'))
        } else {
          adsManager.setVolume(convertLocalStorageIntegerToBoolean('StroeerVideoplayerMuted'))
        }

        try {
          adsManager.init(this.videoElement.clientWidth, this.videoElement.clientHeight, google.ima.ViewMode.NORMAL)
          adsManager.start()
        } catch (adError) {
          this.videoElement.play()
        }
      })

    // adsManager Error Event Listener
  }

  addAdsManagerEvents = (adsManager: any): void => {
    adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,
      (adErrorEvent: any) => {
        const error = adErrorEvent.getError()
        this.videoElement.dispatchEvent(eventWrapper('ima:error', {
          errorCode: error.getVastErrorCode(),
          errorMessage: error.getMessage()
        }))
        logger.log('adsManager ', 'ima:error', {
          errorCode: error.getVastErrorCode(),
          errorMessage: error.getMessage()
        })
      })

    adsManager.addEventListener(google.ima.AdEvent.Type.AD_CAN_PLAY, () => {
      showLoading(false)
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.AD_BUFFERING, () => {
      showLoading(true)
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.AD_METADATA, () => {
      setTimeDisp(timeDisp, adsManager.getRemainingTime())
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.AD_PROGRESS, () => {
      // showLoading(false)
      setTimeDisp(timeDisp, adsManager.getRemainingTime())
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, () => {
      logger.log('Event', 'ima:click')
      this.videoElement.dispatchEvent(eventWrapper('ima:click'))
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, () => {
      this.adContainer.style.display = 'none'
      logger.log('Event', 'ima:ended')
      this.videoElement.dispatchEvent(eventWrapper('ima:ended'))
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, () => {
      this.adContainer.style.display = 'none'
      logger.log('Event', 'ima:ended')
      this.videoElement.dispatchEvent(eventWrapper('ima:ended'))
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.FIRST_QUARTILE, () => {
      logger.log('Event', 'ima:firstQuartile')
      this.videoElement.dispatchEvent(eventWrapper('ima:firstQuartile'))
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.MIDPOINT, () => {
      logger.log('Event', 'ima:midpoint')
      this.videoElement.dispatchEvent(eventWrapper('ima:midpoint'))
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, () => {
      showElement(playButton)
      hideElement(pauseButton)

      logger.log('Event', 'ima:pause')
      this.videoElement.dispatchEvent(eventWrapper('ima:pause'))
      dispatchEvent(this.videoElement, 'UIPause', adsManager.getRemainingTime())
      dispatchEvent(this.videoElement, 'uiima:pause', adsManager.getRemainingTime())
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, () => {
      hideElement(playButton)
      showElement(pauseButton)
      dispatchEvent(this.videoElement, 'uiima:resume', adsManager.getRemainingTime())
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, () => {
      this.adContainer.style.display = 'block'
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
      this.videoElement.dispatchEvent(eventWrapper('ima:impression'))
      dispatchEvent(this.videoElement, 'UIPlay', adsManager.getRemainingTime())
      dispatchEvent(this.videoElement, 'uiima:play', adsManager.getRemainingTime())
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.THIRD_QUARTILE, () => {
      logger.log('Event', 'ima:thirdQuartile')
      this.videoElement.dispatchEvent(eventWrapper('ima:thirdQuartile'))
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED, () => {
      if (!this.isMuted) {
        this.volume = adsManager.getVolume()
        window.localStorage.setItem('StroeerVideoplayerVolume', this.volume.toFixed(2))
        dispatchEvent(this.videoElement, 'UIUnmute', adsManager.getRemainingTime())
        dispatchEvent(this.videoElement, 'uiima:unmute', adsManager.getRemainingTime())
      }
      window.localStorage.setItem('StroeerVideoplayerMuted', this.isMuted ? '1' : '0')
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED, () => {
      window.localStorage.setItem('StroeerVideoplayerMuted', '1')
      dispatchEvent(this.videoElement, 'UIMute', adsManager.getRemainingTime())
      dispatchEvent(this.videoElement, 'uiima:mute', adsManager.getRemainingTime())
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, () => {
      this.videoElement.pause()
    })

    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, () => {
      this.videoElement.play()
    })
  }

  requestAds = (): void => {
    const adsRequest = new google.ima.AdsRequest()
    adsRequest.adTagUrl = this.videoElement.getAttribute('data-ivad-preroll-adtag')

    adsRequest.omidAccessModeRules = {}
    adsRequest.omidAccessModeRules[google.ima.OmidVerificationVendor.GOOGLE] = google.ima.OmidAccessMode.FULL
    adsRequest.omidAccessModeRules[google.ima.OmidVerificationVendor.OTHER] = google.ima.OmidAccessMode.FULL

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = this.videoElement.clientWidth
    adsRequest.linearAdSlotHeight = this.videoElement.clientHeight
    adsRequest.nonLinearAdSlotWidth = this.videoElement.clientWidth
    adsRequest.nonLinearAdSlotHeight = this.videoElement.clientHeight / 3

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

    // Pass the request to the adsLoader to request ads
    adsLoader.requestAds(adsRequest)
    this.videoElement.dispatchEvent(new CustomEvent('ima:adcall'))

    // TODO: Initialize the container Must be done via a user action on mobile devices.
    adDisplayContainer.initialize()
  }

  addUiFunctions = (adsManager: any): void => {
    // const loadingSpinnerContainer = this.adContainer.querySelector('.loading-spinner') as HTMLElement
    // const timeDisp = this.adContainer.querySelector('.controlbar .time') as HTMLElement
    const controlbarContainer = this.adContainer.querySelector('.controlbar-container') as HTMLElement
    const playButton = this.adContainer.querySelector('.buttons .play') as HTMLElement
    const pauseButton = this.adContainer.querySelector('.buttons .pause') as HTMLElement
    const muteButton = this.adContainer.querySelector('.buttons .mute') as HTMLElement
    const unmuteButton = this.adContainer.querySelector('.buttons .unmute') as HTMLElement
    const enterFullscreenButton = this.adContainer.querySelector('.buttons .enterFullscreen') as HTMLElement
    const exitFullscreenButton = this.adContainer.querySelector('.buttons .exitFullscreen') as HTMLElement

    const volumeContainer = this.adContainer.querySelector('.volume-container') as HTMLElement
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

    this.rootElement.addEventListener('mousemove', () => {
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
      adsManager?.resize(this.videoElement.clientWidth, this.videoElement.clientHeight, google.ima.ViewMode.NORMAL)
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
        dispatchEvent(this.videoElement, 'UIEnterFullscreen', adsManager.getRemainingTime())
        dispatchEvent(this.videoElement, 'uiima:enterFullscreen', adsManager.getRemainingTime())
        adsManager.resize(window.innerWidth, window.innerHeight, google.ima.ViewMode.FULLSCREEN)

        if (typeof this.rootElement.requestFullscreen === 'function') {
          this.rootElement.requestFullscreen()
        } else if (typeof this.rootElement.webkitRequestFullscreen === 'function') {
          if (navigator.userAgent.includes('iPad')) {
            this.videoElement.webkitRequestFullscreen()
          } else {
            this.rootElement.webkitRequestFullscreen()
          }
        } else if (typeof this.rootElement.mozRequestFullScreen === 'function') {
          this.rootElement.mozRequestFullScreen()
        } else if (typeof this.rootElement.msRequestFullscreen === 'function') {
          this.rootElement.msRequestFullscreen()
        } else if (typeof this.rootElement.webkitEnterFullscreen === 'function') {
          this.rootElement.webkitEnterFullscreen()
        } else if (typeof this.videoElement.webkitEnterFullscreen === 'function') {
          this.videoElement.webkitEnterFullscreen()
        } else {
          console.log('Error trying to enter Fullscreen mode: No Request Fullscreen Function found')
        }
      }
    })

    exitFullscreenButton.addEventListener('click', () => {
      if (adsManager) {
        dispatchEvent(this.videoElement, 'UIExitFullscreen', adsManager.getRemainingTime())
        dispatchEvent(this.videoElement, 'uiima:exitFullscreen', adsManager.getRemainingTime())

        if (typeof document.exitFullscreen === 'function') {
          document.exitFullscreen().then(noop).catch(noop)
        } else if (typeof document.webkitExitFullscreen === 'function') {
          document.webkitExitFullscreen()
        } else if (typeof document.mozCancelFullScreen === 'function') {
          document.mozCancelFullScreen().then(noop).catch(noop)
        } else if (typeof document.msExitFullscreen === 'function') {
          document.msExitFullscreen()
        } else if (typeof this.videoElement.webkitExitFullscreen === 'function') {
          this.videoElement.webkitExitFullscreen()
        } else {
          console.log('Error trying to enter Fullscreen mode: No Request Fullscreen Function found')
        }

        adsManager.resize(this.videoElement.clientWidth, this.videoElement.clientHeight, google.ima.ViewMode.NORMAL)
      }
    })

    this.onDocumentFullscreenChange = () => {
      if (document.fullscreenElement === this.rootElement || document.fullscreenElement === this.videoElement) {
        this.videoElement.dispatchEvent(new Event('fullscreen'))
        hideElement(enterFullscreenButton)
        showElement(exitFullscreenButton)
      } else {
        this.videoElement.dispatchEvent(new Event('exitFullscreen'))
        showElement(enterFullscreenButton)
        hideElement(exitFullscreenButton)
      }
    }

    // @ts-expect-error
    document.addEventListener('fullscreenchange', this.onDocumentFullscreenChange)

    // iOS Workarounds
    this.videoElement.addEventListener('webkitendfullscreen', function () {
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
          dispatchEvent(this.videoElement, 'UIVolumeChangeStart', {
            volume: adsManager.getVolume(),
            currentTime: adsManager.getRemainingTime()
          })
          dispatchEvent(this.videoElement, 'uiima:volumeChangeStart', {
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
        dispatchEvent(this.videoElement, 'UIVolumeChangeEnd', {
          volume: adsManager.getVolume(),
          currentTime: adsManager.getRemainingTime()
        })
        dispatchEvent(this.videoElement, 'uiima:volumeChangeEnd', {
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
  }

  deinit = (StroeerVideoplayer: IStroeerVideoplayer): void => {
    // const videoElement = StroeerVideoplayer.getVideoEl()
    this.videoElement.removeEventListener('play', this.onVideoElementPlay)
    this.videoElement.removeEventListener('contentVideoEnded', this.onVideoElContentVideoEnded)
  }
}

export default Plugin
