const isAndroid = require('is-android')

exports.INPUT_TYPE = isAndroid ? 'tel' : 'text'

exports.callAll = (...fns) => arg => fns.forEach(fn => fn && fn(arg))
