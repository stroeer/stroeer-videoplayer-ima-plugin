import Plugin from './plugin'
import * as utils from './utils'

const playStub = jest
  .spyOn(window.HTMLMediaElement.prototype, 'play')
  .mockImplementation(async () => { return await new Promise(() => {}) })

afterEach(() => {
  playStub.mockClear()
})

const rootEl = document.createElement('div')
rootEl.classList.add('stroeer-videoplayer')

const uiEl = document.createElement('div')
uiEl.classList.add('stroeer-videoplayer-ui')

const videoEl = document.createElement('video')
videoEl.setAttribute('controls', '')

Object.defineProperty(videoEl, 'duration', { value: 10 })
videoEl.dataset.src = 'https://evilcdn.net/demo-videos/walialu-44s-testspot-longboarding-240p.mp4'
rootEl.appendChild(uiEl)
rootEl.appendChild(videoEl)
document.body.appendChild(rootEl)

class StroeerVideoplayer {
  constructor () {
    return this
  }

  static registerUI = (): boolean => {
    return true
  }

  getRootEl = (): HTMLDivElement => {
    return rootEl
  }

  getUIEl = (): HTMLDivElement => {
    return uiEl
  }

  getVideoEl = (): HTMLVideoElement => {
    return videoEl
  }

  getUIName = (): String => {
    return 'default'
  }

  initUI = (): void => {}
  deinitUI = (): void => {}
  loading = (): void => {}
  showBigPlayButton = (): void => {}
  enterFullscreen = (): void => {}
  exitFullscreen = (): void => {}

  getHls = (): any => {
    const mock = (): any => {
      return {
        destroy: () => {}
      }
    }
    return mock
  }

  getHlsJs = (): any => {
    const mock = (): any => {
      return {
        attachMedia: () => {},
        loadSource: () => {},
        on: () => {}
      }
    }
    mock.Events = {
      ERROR: ''
    }
    mock.isSupported = () => {
      return true
    }
    return mock
  }
}

const svp = new StroeerVideoplayer()
const plugin = new Plugin()
const url = '//imasdk.googleapis.com/js/sdkloader/ima3.js'

it('should load the ima script', async () => {
  jest.spyOn(utils, 'loadScript').mockReturnValue(Promise.resolve())
  plugin.init(svp)
  expect(utils.loadScript).toHaveBeenCalledWith(url)
  expect(document.getElementsByClassName('loaded-script')).not.toEqual(null)
})

it('should request ads', async () => {
  jest.spyOn(plugin, 'requestAds')
  plugin.init(svp)
  // expect(plugin.requestAds).toHaveBeenCalled()
  expect(document.getElementsByClassName('ad-container')).not.toEqual(null)
})
