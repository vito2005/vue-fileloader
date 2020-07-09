const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const fileStorage = {}
const chunks = []

function sendBadRequest (response) {
  response.setHeader('Content-Type', 'application/json')
  response.write(JSON.stringify({ status: 400 }))
  response.end()
}

app.post('/api/upload', (request, response) => {
  const fileId = request.headers['x-content-id']
  const chunkSize = Number(request.headers['content-length'])
  const chunkId = request.headers['x-chunk-id']
  const chunksQuantity = +request.headers['x-chunks-quantity']
  const fileName = decodeURIComponent(request.headers['x-content-name'])
  const fileSize = Number(request.headers['x-content-length'])
  const file = fileStorage[fileId] || (fileStorage[fileId] = [])
  const chunk = []

  request.on('data', (part) => {
    chunk.push(part)
  }).on('end', () => {
    const completeChunk = Buffer.concat(chunk)
    if (completeChunk.length !== chunkSize) {
      sendBadRequest(response)
      return
    }
    file[chunkId] = completeChunk
    const fileCompleted = file.length === chunksQuantity
    if (fileCompleted) {
      const completeFile = Buffer.concat(file)

      if (completeFile.length !== fileSize) {
        sendBadRequest(response)
        return
      }

      const fileStream = fs.createWriteStream(path.join(__dirname, '/files/' + fileName))

      fileStream.write(completeFile)
      fileStream.end()

      delete fileStorage[fileId]
      chunks.length = 0
    }

    response.setHeader('Content-Type', 'application/json')
    response.write(JSON.stringify({ status: 200 }))
    response.end()
  })
})

app.use(express.static(path.join(__dirname, '/dist/')))
app.get('/.*/', (req, res) => res.sendFile(path.join(__dirname, '/dist/index.html')))

app.listen(3000)
