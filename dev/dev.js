import StroeerVideoplayer from '@stroeer/stroeer-videoplayer'
import StroeerVideoplayerDefaultUI from '@stroeer/stroeer-videoplayer-default-ui'
import StroeerVideoplayerIMAPlugin from './stroeerVideoplayer-ima-plugin.esm'

StroeerVideoplayer.registerUI(StroeerVideoplayerDefaultUI)
StroeerVideoplayer.registerPlugin(StroeerVideoplayerIMAPlugin)

let videoData
const video = document.getElementById('myvideo')

video.addEventListener('error', function () {
  console.log('error', this.error.code, this.error.message)
})

video.addEventListener('firstPlay', function () {
  console.log('firstPlay')
})

video.addEventListener('contentVideoSeeked', function () {
  console.log('contentVideoSeeked')
})

video.addEventListener('contentVideoPause', function () {
  console.log('contentVideoPause')
})

video.addEventListener('contentVideoResume', function () {
  console.log('contentVideoResume')
})

video.addEventListener('replay', function () {
  console.log('replay')
})

video.addEventListener('contentVideoStart', function () {
  videoData = video.dataset.meta
  console.log('contentVideoStart', videoData)
})

video.addEventListener('contentVideoEnded', function () {
  console.log('contentVideoEnded')
})

video.addEventListener('contentVideoSecondOctile', function () {
  console.log('contentVideoSecondOctile')
})

video.addEventListener('contentVideoMidpoint', function () {
  console.log('contentVideoMidpoint')
})

video.addEventListener('contentVideoSixthOctile', function () {
  console.log('contentVideoSixthOctile')
})

const myvideoplayer = new StroeerVideoplayer(video)
myvideoplayer.initPlugin('ima', {})
// myvideoplayer.loadStreamSource()
// myvideoplayer.loadFirstChunk()
// console.log(myvideoplayer)
