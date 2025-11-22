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
    
    const token = localStorage.getItem('token')
    
    if (!token && pathname?.startsWith('/admin')) {
      // Use replace instead of push to avoid back button issues
      router.replace('/auth/login')
    }
  }, [router, pathname])

  return <>{children}</>
}

