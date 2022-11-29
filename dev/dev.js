import StroeerVideoplayer from '@stroeer/stroeer-videoplayer'
import StroeerVideoplayerDefaultUI from '@stroeer/stroeer-videoplayer-default-ui'
import { StroeerVideoplayerEndcardPlugin } from '@stroeer/stroeer-videoplayer-plugin-endcard'
import StroeerVideoplayerIMAPlugin from './stroeervideoplayer-ima-plugin.esm'

StroeerVideoplayer.registerUI(StroeerVideoplayerDefaultUI)
StroeerVideoplayer.registerPlugin(StroeerVideoplayerIMAPlugin)
StroeerVideoplayer.registerPlugin(StroeerVideoplayerEndcardPlugin)

const video = document.getElementById('myvideo')

video.addEventListener('error', function () {
  console.log('error', this.error.code, this.error.message)
})

const myvideoplayer = new StroeerVideoplayer(video)

myvideoplayer.initPlugin('ima')
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

myvideoplayer.loadStreamSource()
// myvideoplayer.loadFirstChunk()

// autoplay video
video.muted = true
video.play()
