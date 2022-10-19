import SVGHelper from './SVGHelper'

export async function loadScript (url: string): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.className = 'loaded-script'
    script.async = true
    script.onload = (): void => {
      script.remove()
      resolve()
    }
    script.onerror = (): void => {
      script.remove()
      reject(new Error(`${url} could not be loaded`))
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (document.head) {
      document.head.appendChild(script)
    }
  })
}

export const convertLocalStorageIntegerToBoolean = (key: string): boolean => {
  if (typeof window !== 'undefined') {
    const localStorageItem = window.localStorage.getItem(key)
    if (localStorageItem !== null) {
      const probablyInteger = parseInt(localStorageItem, 10)
      if (isNaN(probablyInteger)) {
        return false
      } else {
        return Boolean(probablyInteger)
      }
    }
  }
  return false
}

export const convertLocalStorageStringToNumber = (key: string): number => {
  if (typeof window !== 'undefined') {
    const localStorageItem = window.localStorage.getItem(key)
    if (localStorageItem !== null) {
      const number = parseFloat(localStorageItem)
      if (number >= 0 && number <= 1) {
        return number
      } else {
        return 0.5
      }
    } else {
      return 0.5
    }
  }
  return 0.5
}

export const hideElement = (element: HTMLElement): void => {
  element.classList.add('hidden')
  element.setAttribute('aria-hidden', 'true')
}

export const showElement = (element: HTMLElement): void => {
  element.classList.remove('hidden')
  element.removeAttribute('aria-hidden')
}

export const createButton = (container: HTMLElement, tag: string, cls: string, aria: string, svgid: string, ishidden: boolean): HTMLElement => {
  const el = document.createElement(tag)
  el.classList.add(cls)
  el.setAttribute('aria-label', aria)
  el.appendChild(SVGHelper(svgid))
  if (ishidden) hideElement(el)
  container.appendChild(el)
  return el
}

export const dispatchEvent = (target: HTMLVideoElement, eventName: string, data?: any): void => {
  const event = new CustomEvent(eventName, { detail: data })
  target.dispatchEvent(event)
}

export const calculateVolumePercentageBasedOnYCoords = (y: number, offsetHeight: number): number => {
  const percentage = (100 / offsetHeight) * y
  return percentage
}

export const setTimeDisp = (timeDisp: HTMLElement, remainingTime: number): void => {
  const secondsLeftString = String(Math.floor(remainingTime))
  if (isNaN(remainingTime)) {
    timeDisp.innerHTML = 'Werbung'
  } else {
    timeDisp.innerHTML = 'Werbung endet in ' + secondsLeftString + ' Sekunden'
  }
}

export const isTouchDevice = (): boolean => {
  return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
}

export const isAlreadyInFullscreenMode = (rootElement: HTMLElement, videoElement: HTMLVideoElement): boolean => {
  return (document.fullscreenElement === rootElement || document.fullscreenElement === videoElement)
}
