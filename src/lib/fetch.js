class StatusError extends Error {
  constructor (status, message) {
    super(message)
    this.status = status
  }
}

export const fetch = async (url, options, extra) => {
  options = Object.assign(options || {}, extra)
  if (!options.headers) {
    options.headers = Object.assign(options.headers || {}, {
      'Content-Type': 'application/json'
    })
    options.body = options.body && JSON.stringify(options.body)
  }
  const result = await window.fetch(url, options)
  if (!result.ok) throw new StatusError(result.status, result.statusText)
  if (result.headers.get('Content-Type') === 'application/vnd.ms-powerpoint') return result.blob()
  return result.json()
}

export const get = async (url, options) => {
  return fetch(url, options, { method: 'GET' })
}

export const post = async (url, options) => {
  return fetch(url, options, { method: 'POST' })
}

export const put = async (url, options) => {
  return fetch(url, options, { method: 'PUT' })
}

export const del = async (url, options) => {
  return fetch(url, options, { method: 'DELETE' })
}
