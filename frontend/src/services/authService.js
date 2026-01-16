import api from './api'

export const register = (payload) => api.post('/auth/register', payload)
export const verifyEmail = (email, code) => api.post('/auth/verify-email', null, { params: { email, code } })
export const login = (payload) => api.post('/auth/login', payload)
// export const getProfile = () => api.get('/auth/me') // Endpoint non existant
export const logout = () => Promise.resolve() // Logout client-side uniquement
export const resendVerification = (email) => api.post('/auth/resend-verification', null, { params: { email } })

export default { register, verifyEmail, login, logout, resendVerification }
