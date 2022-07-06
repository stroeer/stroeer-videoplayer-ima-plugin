import StroeerVideoplayer from '@stroeer/stroeer-videoplayer'
import StroeerVideoplayerDefaultUI from '@stroeer/stroeer-videoplayer-default-ui'
import { StroeerVideoplayerEndcardPlugin } from '@stroeer/stroeer-videoplayer-plugin-endcard'
import StroeerVideoplayerIMAPlugin from './stroeerVideoplayer-ima-plugin.esm'

StroeerVideoplayer.registerUI(StroeerVideoplayerDefaultUI)
StroeerVideoplayer.registerPlugin(StroeerVideoplayerIMAPlugin)
StroeerVideoplayer.registerPlugin(StroeerVideoplayerEndcardPlugin)

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
myvideoplayer.loadStreamSource()
myvideoplayer.loadFirstChunk()

myvideoplayer.initPlugin('ima', {})
myvideoplayer.initPlugin('endcard', {
  revolverplayTime: 7,
  dataKeyMap: {
    image_large: 'preview_image',
    image_medium: 'preview_image',
    image_small: 'thumbnail',
    endpoint: 'endcard_url',
    poster: 'preview_image'
  }
})
// console.log(myvideoplayer)
