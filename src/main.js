
let statusQueue = []
function updateStatus () {
  function setStatus (text) {
    document.getElementById('status').innerText = text
  }
  let isQueueEmpty = statusQueue.length === 0
  if (isQueueEmpty) {
    setStatus('')
    return
  }
  setStatus('Compressing ' + statusQueue[0] + '...')
}

function compressionStarting (name) {
  statusQueue.push(name)
  updateStatus()
}

function compressionDone () {
  statusQueue.shift()
  updateStatus()
}

const uppy = Uppy.Core({
  autoProceed: false,
  debug: true,
  restrictions: {
    allowedFileTypes: ['image/*']
  },
  onBeforeFileAdded: (curr, files) => {
    compressionStarting(curr.name)
    return new ImageCompressor().compress(curr.data, {
      maxWidth: 400,
      quality: .8,
    })
    .then(compressedFile => {
      curr.data = compressedFile
      compressionDone()
      return Promise.resolve()
    })
    .catch(err => {
      console.log('Failed to compress ' + curr.name + ', caused by ' + err.message)
      return Promise.reject(err)
    })
  }
})

uppy.use(Uppy.Dashboard, {
  target: '#app',
  inline: true
})

uppy.use(Uppy.XHRUpload, {
  bundle: true,
  endpoint: 'http://localhost:9967/upload',
  fieldName: 'files'
})

uppy.run()
