# soundfont-loader

A web audio soundfont loader:

```js
var ctx = new AudioContext()
var load = require('soundfont-loader')(ctx)
load('http://example.com/piano-ogg.js').then(function (buffers) {
  var source = ctx.createBufferSource()
  source.buffer = buffer['C2']
  source.connect(ctx.destination)
  source.start(ctx.currentTime)
})
```

Maybe you want a more high level library like [soundfont-player](https://github.com/danigb/soundfont-player)

This library loads and decodes pre-rendered sound fonts json objects or javascript files. The source can be an url string, a promise that resolves to a content or a javascript object that maps note names to base64 encoded audio.

## Available pre-rendered sound fonts

As far as I know, the only pre-rendered sound fonts are the [Benjamin Gleitzman's package](https://github.com/gleitz/midi-js-soundfonts). You can load them using http://rawgit.com with the following url builder:

```js
function nameToUrl(name) {
  return 'https://cdn.rawgit.com/gleitz/midi-js-Soundfonts/master/FluidR3_GM/' + name + '-ogg.js'
}
```

## Examples and test and build

To hear the example: `npm i -g beefy` and `beefy examples/piano.js`

To run the tests: `npm i -g mocha` and `npm test`

To build a browser compatible distribution file: `npm i -g browserify uglifyjs` and `npm dist`

# License

MIT License
