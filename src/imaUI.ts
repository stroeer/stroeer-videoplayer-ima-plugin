import { createButton, hideElement, isTouchDevice } from './utils'

export const createUI = (videoElement: HTMLVideoElement, isMuted: boolean, isFullscreen: boolean): void => {
  const adContainer = document.createElement('div')
  adContainer.classList.add('ima-ad-container')
  videoElement.after(adContainer)

  const uiContainer = document.createElement('div')
  uiContainer.className = 'ima'
  adContainer.appendChild(uiContainer)

  const controlBarContainer = document.createElement('div')
  controlBarContainer.classList.add('controlbar-container')
  uiContainer.appendChild(controlBarContainer)

  const controlBar = document.createElement('div')
  controlBar.className = 'controlbar'
  controlBarContainer.appendChild(controlBar)

  const buttonsContainer = document.createElement('div')
  buttonsContainer.className = 'buttons'
  controlBar.appendChild(buttonsContainer)

  createButton(buttonsContainer, 'play', 'Play', 'Icon-Play', true)
  createButton(buttonsContainer, 'pause', 'Pause', 'Icon-Pause', false)
  createButton(buttonsContainer, 'mute', 'Mute', 'Icon-Volume', isMuted)
  createButton(buttonsContainer, 'unmute', 'Unmute', 'Icon-Mute', !isMuted)
  createButton(buttonsContainer, 'enterFullscreen', 'Enter Fullscreen', 'Icon-Fullscreen', isFullscreen)
  createButton(buttonsContainer, 'exitFullscreen', 'Exit Fullscreen', 'Icon-FullscreenOff', !isFullscreen)

  const volumeContainer = document.createElement('div')
  volumeContainer.className = 'volume-container'
  volumeContainer.style.opacity = '0'
  controlBar.appendChild(volumeContainer)

  const volumeRange = document.createElement('div')
  volumeRange.className = 'volume-range'
  volumeContainer.appendChild(volumeRange)

  const volumeLevel = document.createElement('div')
  volumeLevel.className = 'volume-level'
  volumeRange.appendChild(volumeLevel)

  const volumeLevelBubble = document.createElement('div')
  volumeLevelBubble.className = 'volume-level-bubble'
  volumeRange.appendChild(volumeLevelBubble)

  const timeDisp = document.createElement('div')
  timeDisp.classList.add('time')
  controlBar.appendChild(timeDisp)

  if (isTouchDevice()) {
    const overlayTouchClickContainer = document.createElement('div')
    overlayTouchClickContainer.className = 'video-overlay-touchclick'
    overlayTouchClickContainer.innerHTML = 'Mehr Informationen'
    uiContainer.appendChild(overlayTouchClickContainer)
  }

  const loadingSpinnerContainer = document.createElement('div')
  const loadingSpinnerAnimation = document.createElement('div')
  loadingSpinnerContainer.className = 'loading-spinner'
  hideElement(loadingSpinnerContainer)
  loadingSpinnerAnimation.className = 'animation'
  loadingSpinnerContainer.appendChild(loadingSpinnerAnimation)
  uiContainer.appendChild(loadingSpinnerContainer)

  for (let i = 0; i < 12; i++) {
    const d = document.createElement('div')
    loadingSpinnerAnimation.appendChild(d)
  }
}
