import api from './api'

export const register = (payload) => api.post('/auth/register', payload)
export const verifyEmail = (email, code) => {
    console.warn('⚠️ verifyEmail stubbed (Always success).');
    return new Promise(resolve => setTimeout(() => resolve({ data: { message: "Email vérifié avec succès" } }), 800));
}

export const login = (payload) => api.post('/auth/login', payload)
// export const getProfile = () => api.get('/auth/me') // Endpoint non existant
export const logout = () => Promise.resolve() // Logout client-side uniquement

export const resendVerification = (email) => {
    console.warn('⚠️ resendVerification stubbed.');
    return new Promise(resolve => setTimeout(() => resolve({ data: { message: "Email renvoyé" } }), 500));
}

export default { register, verifyEmail, login, logout, resendVerification }
