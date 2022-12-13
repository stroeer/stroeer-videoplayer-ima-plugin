export interface IStroeerVideoplayer {
  getUIEl: Function
  getRootEl: Function
  getVideoEl: Function
  getUIName: Function
  initUI: Function
  deinitUI: Function
  getHls: Function
}

declare global {
  interface Document {
    mozCancelFullScreen?: () => Promise<void>
    msExitFullscreen?: () => void
    webkitExitFullscreen?: () => void
    mozFullScreenElement?: Element
    msFullscreenElement?: Element
    webkitFullscreenElement?: Element
  }

  interface HTMLElement {
    msRequestFullscreen?: () => Promise<void>
    mozRequestFullscreen?: () => Promise<void>
    webkitRequestFullscreen?: () => Promise<void>
    webkitEnterFullscreen?: () => Promise<void>
    webkitExitFullscreen?: () => void
  }
}

declare class Plugin {
  version: string
  pluginName: string
  videoElement: HTMLVideoElement
  rootElement: HTMLElement
  adContainer: HTMLElement
  loadingSpinnerContainer: HTMLElement
  timeDisp: HTMLElement
  playButton: HTMLElement
  pauseButton: HTMLElement
  muteButton: HTMLElement
  unmuteButton: HTMLElement
  onDocumentFullscreenChange: Function
  onDrag: EventListener
  onDragStart: EventListener
  onDragEnd: EventListener
  assignEvent: Function
  toggleControlBarInterval: ReturnType<typeof setInterval>
  toggleVolumeBarInterval: ReturnType<typeof setInterval>
  isMuted: boolean
  volume: number
  loadIMAScript: Promise<unknown>
  autoplay: boolean
  adsManager: any
  adsLoader: any
  adsDisplayContainer: any
  clickLayer: HTMLDivElement
  adsInitialized: boolean
  constructor ()
  init: (StroeerVideoplayer: IStroeerVideoplayer) => void
  onVideoElementPlay: (event: Event) => void
  onContentVideoEnded: (event: Event) => void
  createAdsManager: () => void
  onAdsManagerLoaded: (adsManagerLoadedEvent: any) => void
  onAdsManagerError: (adErrorEvent: any) => void
  requestAds: () => void
  addAdsManagerEvents: () => void
  connectUiWithAdsManager: () => void
  createUI: (uiContainer: HTMLElement, videoElement: HTMLVideoElement, isMuted: boolean, isFullscreen: boolean) => void
  showLoadingSpinner: (modus: boolean) => void
  setTimeDisp: (remainingTime: number) => void
  dispatchAndLogError: (code: number, message: string) => void
  removeClickLayer: () => void
  deinit: (StroeerVideoplayer: IStroeerVideoplayer) => void
}

export default Plugin
