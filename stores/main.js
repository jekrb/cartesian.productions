var fileReader = require('filereader-stream')
var csv = require('csv-parser')
var product = require('cartesian-product')

module.exports = store

function store (state, emitter) {
  emitter.on('DOMContentLoaded', function () {
    emitter.on('files', function (files) {
      state.product = null
      state.cols = []
      state.headers = []
      var stream = fileReader(files[0]).pipe(csv())
      stream.on('headers', function (headers) {
        state.headers = headers
      })
      stream.on('data', function (row) {
        Object.keys(row).forEach(function (key, i) {
          var cell = row[key]
          if (!cell.length) return
          if (!state.cols[i]) state.cols[i] = []
          state.cols[i].push(cell)
        })
      })
      stream.on('end', function () {
        state.product = product(state.cols)
        emitter.emit(state.events.RENDER)
      })
    })
  })
}
