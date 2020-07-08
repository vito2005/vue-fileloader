let progressCache = {}
let uploadedSize = 0
export const resetCache = () => {
  uploadedSize = 0
  progressCache = {}
}
export const upload = async (url, options) => {
  const { file, currentChunk, chunksQuantity } = options
  return new Promise(function (resolve, reject) {
    try {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', (event) => (progressCache[currentChunk.id] = event.loaded))
      xhr.addEventListener('loadend', (event) => {
        if (xhr.status !== 200) {
          reject(new Error('error'))
        }
        uploadedSize += progressCache[currentChunk.id] || 0
        delete progressCache[currentChunk.id]
        resolve(uploadedSize)
      })
      xhr.open('POST', url)
      xhr.setRequestHeader('X-Chunks-Quantity', chunksQuantity)
      xhr.setRequestHeader('X-Chunk-Id', currentChunk.id)
      xhr.setRequestHeader('X-Content-Id', file.id)
      xhr.setRequestHeader('X-Content-Length', file.size)
      xhr.setRequestHeader('X-Content-Name', encodeURIComponent(file.name))
      xhr.onreadystatechange = (event) => {
        if (xhr.status !== 200) {
          reject(new Error('error'))
        }
      }
      xhr.send(currentChunk.value)
    } catch (e) {
      reject(new Error('error'))
    }
  })
}
