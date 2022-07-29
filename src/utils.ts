async function loadScript (url: string): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
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

export {
  loadScript
}
