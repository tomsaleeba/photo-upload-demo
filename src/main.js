
let statusQueue = []
function updateStatus () {
  function setStatus (text) {
    document.getElementById('status').innerText = text
  }
  function toggleSpinner (isVisible) {
    let val = isVisible ? 'block' : 'none'
    document.getElementById('spinner').style.display = val
  }
  let isQueueEmpty = statusQueue.length === 0
  if (isQueueEmpty) {
    setStatus('')
    toggleSpinner(false)
    return
  }
  setStatus('Compressing ' + statusQueue[0] + '...')
  toggleSpinner(true)
}

function compressionStarting (name) {
  statusQueue.push(name)
  updateStatus()
}

function compressionDone () {
  statusQueue.shift()
  updateStatus()
}

const originalImages = {}
let isCompressionOn = true
const uppy = Uppy.Core({
  autoProceed: false,
  debug: true,
  restrictions: {
    allowedFileTypes: ['image/*']
  },
  onBeforeFileAdded: (curr, files) => {
    if (isCompressionOn === false) {
      return Promise.resolve()
    }
    compressionStarting(curr.name)
    return new ImageCompressor().compress(curr.data, {
      maxWidth: 400,
      quality: .8,
    })
    .then(compressedFile => {
      let clone = {
        name: curr.name,
        type: curr.type,
        data: curr.data,
        source: curr.source,
        isRemote: curr.isRemote
      }
      originalImages[curr.name] = clone
      curr.data = compressedFile
      curr.name = 'thumb_' + curr.name
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

uppy.use(Uppy.Tus, {
  endpoint: 'http://localhost:9967/files/',
  resume: true,
  autoRetry: true,
  retryDelays: [0, 1000, 3000, 5000]
})

uppy.on('complete', (result) => {
  document.getElementById('prep-btn').style.display = 'inline-block'
  console.log('successful files:', result.successful)
  console.log('failed files:', result.failed)
})

function getTaggedPhotos () {
  let allOrigKeys = Object.keys(originalImages)
  let result = allOrigKeys.reduce((accum, curr) => {
    if (Math.random() > 0.5) {
      return accum
    }
    accum.push(curr)
    return accum
  }, [])
  let isThatOneTimeWeGetNoMatches = result.length === 0
  if (isThatOneTimeWeGetNoMatches) {
    result.push(allOrigKeys[0])
  }
  return result
}

function prepBtnHandler () {
  uppy.reset()
  isCompressionOn = false
  getTaggedPhotos().forEach(currKey => {
    let curr = originalImages[currKey]
    uppy.addFile(curr)
  })
}

uppy.run()
