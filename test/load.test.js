/* global describe it */
var assert = require('assert')
var load = require('../')

function decode (ctx, audio) { return Promise.resolve(audio.toUpperCase()) }

describe('sound-font loader', () => {
  describe('source', () => {
    it('when its an object the parser is ignored', (done) => {
      var parse = () => { throw Error() }
      load(null, {'C2': 'audio'}, parse, decode).then((result) => {
        assert.deepEqual(result, { C2: 'AUDIO' })
      }).then(done, done)
    })

    it('accepts a promise', (done) => {
      var parse = (d) => { d['C2'] = 'parsed-' + d['C2']; return d }
      load(null, Promise.resolve({'C2': 'audio'}), parse, decode).then((result) => {
        assert.deepEqual(result, { C2: 'PARSED-AUDIO' })
      }).then(done, done)
    })
  })
})
