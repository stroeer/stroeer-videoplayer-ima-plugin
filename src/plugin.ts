import { version } from '../package.json'
import noop from './noop'

// import { loadImaSdk, google } from '@alugha/ima'

interface IStroeerVideoplayer {
  getUIEl: Function
  getRootEl: Function
  getVideoEl: Function
  getUIName: Function
  initUI: Function
  deinitUI: Function
}

class IMAPlugin {
  videoplayer: IStroeerVideoplayer
  onVideoElPlay: Function
  videoElement: HTMLVideoElement
  videoElementWidth: number
  videoElementHeight: number
  adsLoaded: boolean
  adContainer: HTMLDivElement
  adDisplayContainer: any
  adsLoader: any
  adsRequest: any
  adsManager: any

  constructor (stroeervideoplayer: IStroeerVideoplayer, imaOpts?: any) {
    this.onVideoElPlay = noop
    this.videoplayer = stroeervideoplayer

    this.adsLoaded = false

    this.videoElement = stroeervideoplayer.getVideoEl()
    this.videoElementWidth = this.videoElement.clientWidth
    this.videoElementHeight = this.videoElement.clientHeight
    this.adContainer = document.createElement('div')
    this.adContainer.classList.add('ad-container')

    this.adContainer.addEventListener('click', () => {
      console.log('ad container clicked')
      // if (this.videoElement.paused) {
      //   // eslint-disable-next-line
      //   this.videoElement.play()
      // } else {
      //   this.videoElement.pause()
      // }
    })

    const uiEl = stroeervideoplayer.getUIEl()

    uiEl.appendChild(this.adContainer)

    return this
  }

  initIMA = (): void => {
    this.adDisplayContainer = new google.ima.AdDisplayContainer(this.adContainer, this.videoElement)
    this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer)

    window.addEventListener('resize', (event) => {
      console.log('window resized')
      if (typeof this.adsManager !== 'undefined') {
        const width = this.videoElement.clientWidth
        const height = this.videoElement.clientHeight
        this.adsManager.resize(width, height, google.ima.ViewMode.NORMAL)
      }
    })

    this.adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, (adsManagerLoadedEvent: any) => {
        console.log('ads manager loaded')
        this.adsManager = adsManagerLoadedEvent.getAdsManager(this.videoElement)
        const adsManager = this.adsManager

        adsManager.addEventListener(
          google.ima.AdErrorEvent.Type.AD_ERROR, (adErrorEvent: any) => {
            console.log(adErrorEvent.getError())
            if (typeof this.adsManager !== 'undefined') {
              this.adsManager.destroy()
            }
          })
        adsManager.addEventListener(
          google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, () => {
            this.videoElement.pause()
          })
        adsManager.addEventListener(
          google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, () => {
            // eslint-disable-next-line
            this.videoElement.play()
            this.adContainer.style.display = 'none'
          })
        adsManager.addEventListener(
          google.ima.AdEvent.Type.LOADED, (adEvent: any) => {
            const ad = adEvent.getAd()
            if (ad.isLinear() === false) {
              // eslint-disable-next-line
              this.videoElement.play()
            }
          })
      }, false)

    this.adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      function () {
        console.log('ad error')
      },
      false)

    // Let the AdsLoader know when the video has ended
    this.videoElement.addEventListener('ended', () => {
      this.adsLoader.contentComplete()
    })

    this.adsRequest = new google.ima.AdsRequest()

    this.adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
      'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
      'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
      'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator='

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    this.adsRequest.linearAdSlotWidth = this.videoElement.clientWidth
    this.adsRequest.linearAdSlotHeight = this.videoElement.clientHeight
    this.adsRequest.nonLinearAdSlotWidth = this.videoElement.clientWidth
    this.adsRequest.nonLinearAdSlotHeight = this.videoElement.clientHeight / 3

    // Pass the request to the adsLoader to request ads
    this.adsLoader.requestAds(this.adsRequest)

    this.videoElementWidth = this.videoElement.clientWidth
    this.videoElementHeight = this.videoElement.clientHeight

    this.videoElement.addEventListener('play', (evt) => {
      if (this.adsLoaded) {
        return
      }
      this.adsLoaded = true

      evt.preventDefault()

      this.videoElement.load()
      this.adDisplayContainer.initialize()

      try {
        this.adsManager.init(this.videoElementWidth, this.videoElementHeight, google.ima.ViewMode.NORMAL)
        this.adsManager.start()
      } catch (adError) {
        // play the video without the ads
        console.log('AdsManager could not be started', adError)
        // eslint-disable-next-line
        this.videoElement.play()
      }
    })
  }

  run = (): void => {}
}

const plugin = {
  pluginName: 'IMA',
  init: function (stroeervideoplayer: IStroeerVideoplayer, opts?: any) {
    opts = opts ?? {}
    const imaPlugin = new IMAPlugin(stroeervideoplayer)
    const videoEl = stroeervideoplayer.getVideoEl()
    videoEl.addEventListener('loadedmetadata', () => {
      imaPlugin.initIMA()
    })
  },
  deinit: function () {
  },
  version: version
}

export default plugin
