'use strict'

var ctx = new window.AudioContext()
var load = require('../')(ctx)

function nameToUrl (name) {
  return 'https://cdn.rawgit.com/gleitz/midi-js-Soundfonts/master/FluidR3_GM/' + name + '-ogg.js'
}
var url = nameToUrl('acoustic_grand_piano')
console.log('loading: ', url)

load(url).then(function (buffers) {
  console.log('loaded.')
  var source = ctx.createBufferSource()
  source.buffer = buffers['C2']
  source.connect(ctx.destination)
  source.start(ctx.currentTime)
})
