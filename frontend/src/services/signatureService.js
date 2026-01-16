import api from './api'

const signatureService = {
  uploadSignature: async (visitorId, blob) => {
    const form = new FormData()
    form.append('file', blob, 'signature.png')
    // If backend expects multipart form under another field, adapt here
    const res = await api.post(`/v1/visiteurs/${visitorId}/upload-signature`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
}

export default signatureService
