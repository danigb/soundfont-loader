# soundfont-loader

A web audio soundfont loader:

```js
var ctx = new AudioContext()
var load = require('soundfont-loader')(ctx)
load('http://').then(function (buffers) {
  var source = ctx.createBufferSource()
  source.buffer = buffer['C2']
  source.connect(ctx.destination)
  source.start(ctx.currentTime)
})
```

Works out of the box with Benjamin Gleitzman's package of
[pre-rendered sound fonts](https://github.com/gleitz/midi-js-soundfonts). Just build the url with this function:

```js
function nameToUrl(name) {
  return 'https://cdn.rawgit.com/gleitz/midi-js-Soundfonts/master/FluidR3_GM/' + name + '-ogg.js'
}
```
