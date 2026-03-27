import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3000/api'
})

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

// Auth
export const signup = (data) => API.post('/auth/signup', data)
export const login  = (data) => API.post('/auth/login', data)

// Transactions
export const getTransactions    = ()     => API.get('/transactions')
export const addTransaction     = (data) => API.post('/transactions', data)
export const deleteTransaction  = (id)   => API.delete(`/transactions/${id}`)

// Admin
export const getAdminUsers        = () => API.get('/admin/users')
export const getAdminTransactions = () => API.get('/admin/transactions')
export const deleteUser           = (id) => API.delete(`/admin/users/${id}`)
export const updateProfile   = (data) => API.put('/auth/update-profile', data)
export const changePassword  = (data) => API.put('/auth/change-password', data)
export const forgotPassword  = (data) => API.post('/auth/forgot-password', data)