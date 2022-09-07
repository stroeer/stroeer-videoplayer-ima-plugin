let debugMode = false
if (window.localStorage?.getItem?.('StroeerVideoplayerLoggingEnabled') !== null) {
  debugMode = true
}
const Logger = {
  log: function (...args: any[]) {
    if (debugMode) {
      console.log.apply(console, args)
    }
  }
}

export default Logger
