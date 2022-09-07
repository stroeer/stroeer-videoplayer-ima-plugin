import * as utils from './utils'

test('test loadScript function', async () => {
  const url = '//imasdk.googleapis.com/js/sdkloader/ima3.js'
  await utils.loadScript(url)
  expect(document.querySelector('.loaded-script')).not.toEqual(null)
})
