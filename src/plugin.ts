import { version } from '../package.json'
import noop from './noop'
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

  constructor (StroeerVideoplayer: IStroeerVideoplayer, imaOpts?: any) {
    this.initIMA = noop

    return this
  }

  init = (StroeerVideoplayer: IStroeerVideoplayer, opts?: any): void => {
    opts = opts ?? {}

    this.initIMA = (): void => {
      let videoElementWidth: number
      let videoElementHeight: number
      let adsLoaded: boolean
      let adsManager: any

      adsLoaded = false

      const videoElement = StroeerVideoplayer.getVideoEl()
      videoElementWidth = videoElement.clientWidth
      videoElementHeight = videoElement.clientHeight
      const adContainer = document.createElement('div')
      adContainer.classList.add('ad-container')
      videoElement.after(adContainer)

      adContainer.addEventListener('click', () => {
        console.log('ad container clicked')
      })

      const adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement)
      const adsLoader = new google.ima.AdsLoader(adDisplayContainer)

      window.addEventListener('resize', (event) => {
        console.log('window resized')
        if (adsManager) {
          const width = videoElement.clientWidth
          const height = videoElement.clientHeight
          adsManager.resize(width, height, google.ima.ViewMode.NORMAL)
        }
      })

      adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, (adsManagerLoadedEvent: any) => {
          console.log('ads manager loaded')
          adsManager = adsManagerLoadedEvent.getAdsManager(videoElement)

          adsManager.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR, (adErrorEvent: any) => {
              console.log(adErrorEvent.getError())
              if (adsManager) {
                adsManager.destroy()
              }
            }, false)

          /*
          adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, () => {
              videoElement.pause()
            })

          adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, () => {
              // eslint-disable-next-line
              videoElement.play()
              adContainer.style.display = 'none'
            })
          */

          adsManager.addEventListener(
            google.ima.AdEvent.Type.LOADED, (adEvent: any) => {
              const ad = adEvent.getAd()
              if (ad.isLinear() === false) {
                // eslint-disable-next-line
                videoElement.play()
              }
            })
        }, false)

      /*
      adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        function () {
          console.log('ad error')
        },
        false)
      */

      // Let the AdsLoader know when the video has ended
      videoElement.addEventListener('contentVideoEnded', () => {
        adsLoader.contentComplete()
      })

      const adsRequest = new google.ima.AdsRequest()

      adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
        'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
        'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
        'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator='

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

      videoElement.addEventListener('play', (evt: Event) => {
        if (adsLoaded) {
          return
        }
        adsLoaded = true

        evt.preventDefault()

        videoElement.load()
        adDisplayContainer.initialize()

        try {
          adsManager.init(videoElementWidth, videoElementHeight, google.ima.ViewMode.NORMAL)
          adsManager.start()
        } catch (adError) {
          // play the video without the ads
          console.log('AdsManager could not be started', adError)
          // eslint-disable-next-line
          videoElement.play()
        }
      })
    }

    const videoEl = StroeerVideoplayer.getVideoEl()
    videoEl.addEventListener('loadedmetadata', () => {
      this.initIMA()
    })
  }
}

export default Plugin
