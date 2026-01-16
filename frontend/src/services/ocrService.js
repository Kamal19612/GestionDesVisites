import api from './api'

const ocrService = {
  uploadDocumentForOcr: async (visitorId, file) => {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post(`/v1/visiteurs/${visitorId}/scan-document`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
}

export default ocrService
