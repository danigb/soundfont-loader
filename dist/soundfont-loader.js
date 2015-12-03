(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function b64ToUint6 (nChr) {
  return nChr > 64 && nChr < 91 ?
      nChr - 65
    : nChr > 96 && nChr < 123 ?
      nChr - 71
    : nChr > 47 && nChr < 58 ?
      nChr + 4
    : nChr === 43 ?
      62
    : nChr === 47 ?
      63
    :
      0;

}

// Decode Base64 to Uint8Array
// ---------------------------
function base64DecodeToArray(sBase64, nBlocksSize) {
  var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, "");
  var nInLen = sB64Enc.length;
  var nOutLen = nBlocksSize ?
    Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize :
    nInLen * 3 + 1 >> 2;
  var taBytes = new Uint8Array(nOutLen);

  for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
    nMod4 = nInIdx & 3;
    nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
    if (nMod4 === 3 || nInLen - nInIdx === 1) {
      for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
      }
      nUint24 = 0;
    }
  }
  return taBytes;
}

module.exports = base64DecodeToArray;

},{}],2:[function(require,module,exports){
'use strict'

var base64DecodeToArray = require('./b64decode.js')

/**
 * Load a soundfont bank
 *
 * @param {AudioContext} ctx - the audio context object
 * @param {String} url - the url of the js file
 * @param {Function} get - (Optional) given a url return a promise with the contents
 * @param {Function} parse - (Optinal) given a js file return JSON object
 */
module.exports = function load (ctx, source, parser, decoder) {
  if (arguments.length === 1) return function (s, p, d) { return load(ctx, s, p, d) }

  var deferred
  parser = parser || parseJavascript
  decoder = decoder || decodeBuffer

  if (typeof source === 'string') deferred = getRequest(source).then(parser)
  else if (source.then) deferred = source.then(parser)
  else if (typeof source === 'object') deferred = Promise.resolve(source)
  else return Promise.reject('Invalid source.')

  return deferred.then(function (data) {
    return decodeData(ctx, data, decoder)
  })
}

/*
 * Decode a bank
 * @param {Object} bank - the bank object
 * @return {Promise} a promise that resolves to the bank with the buffers decoded
 * @api private
 */
function decodeData (ctx, data, decoder) {
  var buffers = []
  var promises = Object.keys(data).map(function (note) {
    return decoder(ctx, data[note])
    .then(function (buffer) {
      buffers[note] = buffer
    })
  })

  return Promise.all(promises).then(function () {
    return buffers
  })
}

/**
 * Given a base64 encoded audio data, return a prmomise with an audio buffer
 *
 * @param {AudioContext} context - the [audio context](https://developer.mozilla.org/en/docs/Web/API/AudioContext)
 * @param {String} data - the base64 encoded audio data
 * @return {Promise} a promise that resolves to an [audio buffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer)
 * @api private
 */
function decodeBuffer (context, data) {
  return new Promise(function (done, reject) {
    var decodedData = base64DecodeToArray(data.split(',')[1]).buffer
    context.decodeAudioData(decodedData, function (buffer) {
      done(buffer)
    }, function (e) {
      reject('DecodeAudioData error', e)
    })
  })
}

/**
 *  Parse the SoundFont data and return a JSON object
 *  (SoundFont data are .js files wrapping json data)
 *
 * @param {String} data - the SoundFont js file content
 * @return {JSON} the parsed data as JSON object
 * @api private
 */
function parseJavascript (data) {
  var begin = data.indexOf('MIDI.Soundfont.')
  begin = data.indexOf('=', begin) + 2
  var end = data.lastIndexOf(',')
  return JSON.parse(data.slice(begin, end) + '}')
}

function getRequest (url) {
  return new Promise(function (done, reject) {
    var req = new window.XMLHttpRequest()
    req.open('GET', url)

    req.onload = function () {
      if (req.status === 200) {
        done(req.response)
      } else {
        reject(Error(req.statusText))
      }
    }
    req.onerror = function () {
      reject(Error('Network Error'))
    }
    req.send()
  })
}

},{"./b64decode.js":1}]},{},[2]);
