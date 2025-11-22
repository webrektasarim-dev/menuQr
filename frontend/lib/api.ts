import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Try localStorage first, then sessionStorage
    let token = localStorage.getItem('token')
    if (!token) {
      token = sessionStorage.getItem('token')
      // If found in sessionStorage, also save to localStorage
      if (token) {
        localStorage.setItem('token', token)
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Track if we're already redirecting to prevent loops
let isRedirecting = false

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if we're not already on login/register page
    // and if it's a real 401 (not a handled error)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !isRedirecting) {
        const currentPath = window.location.pathname
        
        // Don't redirect if:
        // 1. Already on auth pages
        // 2. On dashboard page (API calls are optional there)
        // 3. On admin pages that handle their own errors
        if (
          currentPath.startsWith('/auth/') ||
          currentPath === '/admin/dashboard' ||
          currentPath.startsWith('/admin/menu') ||
          currentPath.startsWith('/admin/tables') ||
          currentPath.startsWith('/admin/orders') ||
          currentPath.startsWith('/admin/settings')
        ) {
          // Just reject the error, don't redirect
          return Promise.reject(error)
        }
        
        const token = localStorage.getItem('token')
        if (token) {
          // Token exists but is invalid, clear it and redirect
          isRedirecting = true
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('user')
          // Use setTimeout to avoid redirect during render
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login'
            }
            // Reset flag after redirect
            setTimeout(() => {
              isRedirecting = false
            }, 1000)
          }, 100)
        }
      }
    }
    return Promise.reject(error)
  }
)

