import StroeerVideoplayer from '@stroeer/stroeer-videoplayer'
import StroeerVideoplayerDefaultUI from '@stroeer/stroeer-videoplayer-default-ui'
import StroeerVideoplayerImaUI from '@stroeer/stroeer-videoplayer-ima-ui'
import { StroeerVideoplayerEndcardPlugin } from '@stroeer/stroeer-videoplayer-plugin-endcard'
import StroeerVideoplayerIMAPlugin from './stroeerVideoplayer-ima-plugin.esm'

StroeerVideoplayer.registerUI(StroeerVideoplayerDefaultUI)
StroeerVideoplayer.registerUI(StroeerVideoplayerImaUI)
StroeerVideoplayer.registerPlugin(StroeerVideoplayerIMAPlugin)
StroeerVideoplayer.registerPlugin(StroeerVideoplayerEndcardPlugin)

const video = document.getElementById('myvideo')

video.addEventListener('error', function () {
  console.log('error', this.error.code, this.error.message)
})

const myvideoplayer = new StroeerVideoplayer(video)
myvideoplayer.loadStreamSource()
// myvideoplayer.loadFirstChunk()

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
