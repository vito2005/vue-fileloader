const progressCache = {}
let uploadedSize = 0
export default async (url, options) => {
  const { file, currentChunk, chunksQuantity } = options
  return new Promise(function (resolve, reject) {
    try {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', (event) => (progressCache[currentChunk.id] = event.loaded))
      // xhr.addEventListener('error', progressListener)
      // xhr.addEventListener('abort', progressListener)
      xhr.addEventListener('loadend', (event) => {
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
          reject(xhr.statusText)
        }
      }
      xhr.onerror = (error) => {
        console.log('Upload error: ', error)
        reject(error)
      }
      xhr.onabort = () => {
        console.log('Upload canceled by user')
        reject(new Error('Upload canceled by user'))
      }
      xhr.send(currentChunk.value)
    } catch (e) {
      reject(e)
    }
  })
}
