'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only check on client side
    if (typeof window === 'undefined') return
    
    // Don't redirect if already on login page
    if (pathname?.startsWith('/auth/')) {
      return
    }
    
    // Wait a bit for token to be saved (especially after login)
    const checkToken = () => {
      const token = localStorage.getItem('token')
      
      if (!token && pathname?.startsWith('/admin')) {
        // Only redirect if we're sure there's no token
        // Give it a moment in case it's being saved
        setTimeout(() => {
          const tokenAgain = localStorage.getItem('token')
          if (!tokenAgain) {
            router.replace('/auth/login')
          }
        }, 500)
      }
    }
    
    // Check immediately
    checkToken()
    
    // Also check after a short delay (for cases where token is being saved)
    const timer = setTimeout(checkToken, 200)
    
    return () => clearTimeout(timer)
  }, [router, pathname])

  return <>{children}</>
}

